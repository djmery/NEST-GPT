import OpenAI from "openai";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helpers";
import * as fs from 'fs';

interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async (openai: OpenAI, options: Options) => {
    const { prompt, originalImage, maskImage } = options;

    //Todo: Verificar originalImage

    if (!originalImage || !maskImage) {

        const response = await openai.images.generate({
            prompt: prompt,
            model: 'dall-e-3',
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            response_format: 'url'
        });

        //Todo: Guardar la imagen en FS
        const fileName = await downloadImageAsPng(response.data[0].url);
        const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;


        return {
            url: url, //este es el url qu vamos a utilizar todo: http://localhost:3000/gpt/image-generation/1722622937152.png
            openAIUrl: response.data[0].url, //este es el url del openai
            revised_prompt: response.data[0].revised_prompt,
        }
    }

    //originalImage = http://localhost:3000/gpt/image-generation/1722622937152.png
    //maskImage=Base;AÑKFAKFJAÑKJñfjlñjfajfaljfakfjajfajfajfñj (ejemplo de lo que puede venir)
    const pngImagePath = await downloadImageAsPng(originalImage);
    const maskPath = await downloadBase64ImageAsPng(maskImage);

    const response = await openai.images.edit({
        model: 'dall-e-2',
        prompt: prompt,
        image: fs.createReadStream(pngImagePath),
        mask: fs.createReadStream(maskPath),
        n: 1,
        size: '1024x1024',
        response_format: 'url'
    });

    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
        url: url,
        openAIUrl: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt,
    }
}
