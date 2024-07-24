import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';

interface Options {
    prompt: string;
    voice?: string;
}

export const textToAudioUseCase = async (openAI: OpenAI, { prompt, voice }: Options) => {

    const voices = {
        'nova': 'nova',
        'alloy': 'alloy',
        'echo': 'echo',
        'fable': 'fable',
        'onyx': 'onyx',
        'shimmer': 'shimmer'

    }

    const selectedVoice = voices[voice] ?? 'nova';


    //aquí es donde quiero grabar mi audio
    const folderPath = path.resolve(__dirname, '../../../generated/audios');
    const speecFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);

    //sino existe el directorio que vaya recursivamente y los cree todos
    //fs permite interactuar con los archivos del sistema.
    fs.mkdirSync(folderPath, { recursive: true });

    const mp3 = await openAI.audio.speech.create({
        model: 'tts-1',
        voice: selectedVoice,
        input: prompt,
        response_format: 'mp3',

    });

    //Buffer viene en node
    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(speecFile, buffer);

    return speecFile;

}