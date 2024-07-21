import { Markmap } from "../../domain/entities/Markmap.entity";
import {
  CachingService,
  SocketService,
  RepositoryService,
} from "../../../../config/dependencies";
import Replicate from "replicate";
import pdf from "pdf-extraction";
import fs from "fs";

const replicate = new Replicate();

const markmapExample = `
# Title

## Explanation
- This is a large paragraph dedicated to explain something long and big, use this to add precise explanations.

## Links
- [Website](https://markmap.js.org/)
- [GitHub](https://github.com/gera2ld/markmap)

## Related Projects

- [coc-markmap](https://github.com/gera2ld/coc-markmap) for Neovim
- [markmap-vscode](https://marketplace.visualstudio.com/items?itemName=gera2ld.markmap-vscode) for VSCode
- [eaf-markmap](https://github.com/emacs-eaf/eaf-markmap) for Emacs

## Features

### Lists

- **strong** ~~del~~ *italic* ==highlight==
- \`inline code\`
- [x] checkbox
- Katex: $x = {-b \pm \sqrt{b^2-4ac} \over 2a}$ <!-- markmap: fold -->
  - [More Katex Examples](#?d=gist:af76a4c245b302206b16aec503dbe07b:katex.md)
- Now we can wrap very very very very long text based on \`maxWidth\` option

### Blocks

\`\`\`js
console.log('hello, JavaScript')
\`\`\`

| Products | Price |
|-|-|
| Apple | 4 |
| Banana | 2 |

![](/favicon.png)`;

const prePrompt = `Ten presente estos puntos:
- Conserva todo enlace externo. 
- Conserva los ejemplos de codigo y ubiquelos dentro de
\`\`\`
code
\`\`\`.
- Devuelve el resultado todo en español.
- Cuando se trate de un parrafo, siempre preceder con '- '.
- Eliminar todo espacio en el inicio.`;

export const transformFileToMarkmap = async (ctx: any) => {
  const { format, payload, uuid, clientSocketID } = ctx;
  const { title, pdfText } = await extractTextFromPdf({ pdfFile: payload });

  const timestamp = new Date()
    .toLocaleString()
    .replaceAll("/", ".")
    .replaceAll(" ", ".")
    .replaceAll(",", "")
    .replaceAll(":", ".");

  const prompt = `
  ${prePrompt}
    
  ${pdfText}
  `;
  const tableName = "markmaps";
  const entityIndex = `${title}_${timestamp}`;

  CachingService.addTable(tableName);
  CachingService.addData(tableName, entityIndex, {
    id: entityIndex,
    uuid,
    title,
    text: "",
  });
  const stream = fs.createWriteStream(`output/${title}_${timestamp}.txt`, {
    flags: "a",
  });
  await runPrompt({
    prompt,
    stream: (data: any) => {
      CachingService.appendStringData(tableName, entityIndex, {
        text: data,
      });
      SocketService.sockets[clientSocketID].emit(
        `appendToMarkmapText$${uuid}`,
        {
          uuid,
          text: data,
          title,
        }
      );
      stream.write(data);
    },
    clientSocketID,
  });
  stream.end();

  const cachedMarkmap = CachingService.getData(tableName, entityIndex);
  Markmap.createOne(RepositoryService, {
    uuid,
    title,
    text: cachedMarkmap.text,
  });
  return cachedMarkmap;
};

export const extractTextFromPdf = async (ctx: any) => {
  const { pdfFile } = ctx;

  const extractTitle = (text: string) => {
    const lines = text.split("\n");
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        // Asume que el título está en mayúsculas y no es demasiado largo
        if (
          trimmedLine === trimmedLine.toUpperCase() &&
          trimmedLine.length < 100
        ) {
          return trimmedLine;
        }
      }
    }
    // Si no se encuentra un título según las reglas, devolver la primera línea
    return lines.length > 0 ? lines[0].trim() : null;
  };
  const { text: pdfText } = await pdf(Buffer.from(pdfFile, "base64"));
  const title = extractTitle(pdfText);
  return { title, pdfText };
};

export const runPrompt = async (ctx: any) => {
  const { prompt, stream, clientSocketID } = ctx;
  const input = {
    top_p: 0.9,
    prompt,
    system_prompt: `
    Eres un experto analista que identifica y extrae la informacion mas relevante 
    e importante y la condensa en formato MARKDOWN y MINDMAP, sigue el siguiente 
    ejemplo escrito en MARKDOWN para saber como estructurar la respuesta, ten en
    cuenta las anotaciones, asi sabras que hace cada conjunto de caracteres:

    ${markmapExample}
    `,
    min_tokens: 0,
    temperature: 0.6,
  };
  for await (const event of replicate.stream("meta/meta-llama-3-70b-instruct", {
    input,
  })) {
    process.stdout.write(`${event}`);
    stream(`${event}`);
  }
};

export const initChatWithMarkmap = (ctx: any) => {
  
};
