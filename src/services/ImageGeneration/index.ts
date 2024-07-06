import fs from "fs";
import { SocketService } from "../../config/dependencies";

export const generatedImages = async (images: any) => {
  try {
    for (let image of images) {
      const { encoded_image, img_title, img_format } = image;
      const decodedImage = Buffer.from(encoded_image, "base64");
      const imagesDirectory = "datasets/images/";
      if (!fs.existsSync(imagesDirectory)) {
        fs.mkdirSync(imagesDirectory, { recursive: true });
        console.log("Directory created successfully.");
      }
      fs.writeFile(
        `${imagesDirectory}${img_title}.${img_format}`,
        decodedImage,
        (err) => {
          if (err) throw err;
          console.log("La imagen fue guardada correctamente");
        }
      );
    }
  } catch (error: any) {
    console.error(`Ocurrió un error al guardar la imagen: ${error}`.bgRed);
    throw new Error(error.message);
  }

  return images;
};

export const generateImages = async (data: any) => {
  const { prompt, options = {} } = data;
  const imagesGenerated = await SocketService.sendMessage(
    {
      imageService: {
        generate_images: [
          prompt,
          ...Object.entries(options).flatMap((b) => b[1]),
        ],
      },
    },
    { generatedImages }
  );

  return imagesGenerated;
};

SocketService.addEvent({ generateImages });

export const modifyImages = (data: any) => {
  const { images } = data;
};

export const availabelSettings = () => ({
  outputs: [1, 4],
  sizes: [128, 256, 512, 768, 1024],
  inferenceSteps: { min: 1, max: 500 },
  guidanceScale: { min: 1, max: 20 },
});
