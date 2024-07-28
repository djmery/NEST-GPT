import OpenAI from "openai";
import * as fs from 'fs';

interface Options {
    prompt?: string;
    audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openai: OpenAI, options: Options) => {

    const { prompt, audioFile } = options;

    console.log({ prompt, audioFile });

    const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        //el archivo que tenemos que enviar, lo tenemos que enviar como un string de información
        //el path donde está fisicamente el archivo
        file: fs.createReadStream(audioFile.path),
        prompt: prompt, // tiene que ser en el mismo idioma que el audio
        language: 'es',
        //response_format: 'srt' //'vtt' //es el mas completo
        response_format: 'verbose_json', // da mucha más información

    });

    console.log(response);

    return response;
}
