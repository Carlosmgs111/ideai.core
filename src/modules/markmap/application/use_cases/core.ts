import { CachingService, SocketService } from "../../../../config/dependencies";
import { createNewMarkmap } from "./crud";
import pdfExtraction from "pdf-extraction";
import { streamText } from "ai";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import config from "../../../../config";

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

const prePrompt = `
Ten presente estos puntos:
- Conserva todo enlace externo. 
- Conserva los ejemplos de codigo y ubicalos dentro de
\`\`\`
code
\`\`\`.

- Devuelve el resultado todo en español.
- Cuando se trate de un parrafo, siempre preceder con '- '.
- Elimina todo espacio en el inicio.
- Ignora todo indice de contenido.`;

export const transformFileToMarkmap = async (ctx: any) => {
  const { payload, uuid, clientSocketID } = ctx;
  const pdfText = await extractTextFromPdf({ pdfFile: payload });
  const prompt = `
  ${prePrompt}
    
  ${pdfText}
  `;
  return await presetRunPrompt({ prompt, uuid, clientSocketID });
};

export const createUsingPrompt = async (ctx: any) => {
  const { prompt, uuid, clientSocketID, topics } = ctx;
  const customPrompt = `
  Buscaras y condensaras toda la informacion que encuentres sobre lo siguiente, 
  ademas de asignar un titulo adecuado:
  
  ${prompt}

  ${topics ? `Guiate por los siguientes temas: ${topics}` : ""}
  `;
  return await presetRunPrompt({ prompt: customPrompt, uuid, clientSocketID });
};

export const presetRunPrompt = async (ctx: any) => {
  const { prompt, uuid, clientSocketID } = ctx;
  const system_prompt = `
  Eres un experto analista que identifica y extrae la informacion mas relevante 
  e importante y la condensa en formato MARKDOWN y MINDMAP, sigue el siguiente 
  ejemplo escrito en MARKDOWN para saber como estructurar la respuesta, ten en
  cuenta las anotaciones, asi sabras que hace cada conjunto de caracteres:

  ${markmapExample}
  `;
  let title = "";
  const tableName = "markmaps";

  CachingService.addTable(tableName);
  CachingService.addData(tableName, uuid, {
    id: uuid,
    uuid,
    title,
    text: "",
  });

  let initChunk = "";
  let buffer = "";
  const minChunkSize = 800;
  const onStream = (data: any) => {
    CachingService.appendStringData(tableName, uuid, {
      text: data,
    });
    if (!title) {
      initChunk += data;
      if (initChunk.includes("##")) {
        title = extractTitle(initChunk).trim();
        SocketService.sockets[clientSocketID].emit(
          `appendToMarkmapText$${uuid}`,
          {
            uuid,
            text: initChunk,
            title,
          }
        );
      }
      return;
    }
    buffer += data;
    process.stdout.write(`${buffer}`);
    if (buffer.length >= minChunkSize) {
      SocketService.sockets[clientSocketID].emit(
        `appendToMarkmapText$${uuid}`,
        {
          uuid,
          text: buffer,
          title,
        }
      );
      buffer = "";
    }
  };

  await runPrompt({
    prompt,
    system_prompt,
    onStream,
  });

  const cachedMarkmap = CachingService.getData(tableName, uuid);
  createNewMarkmap({
    uuid,
    title,
    text: cachedMarkmap.text,
  });
  return cachedMarkmap;
};

export const runPrompt = async (ctx: any) => {
  const { prompt, system_prompt, onStream } = ctx;
  const groq = createGroq({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: config.groqApiKey,
  });
  const { textStream } = await streamText({
    model: groq("llama-3.1-70b-versatile"),
    system: system_prompt,
    prompt,
  });
  for await (const textPart of textStream) {
    onStream(`${textPart}`);
  }
};

export const extractTextFromPdf = async (ctx: any) => {
  const { pdfFile } = ctx;
  const treatedPdf = await pdfExtraction(Buffer.from(pdfFile, "base64"));
  const { text } = treatedPdf;
  return text;
};

export const extractTitle = (str: string) => {
  const regex = /(?<=#)([\s\S]*?)(?=\n|$)/;
  const match: any = str.match(regex);
  if (!match) return "";
  const title = match[1];
  return title;
};
