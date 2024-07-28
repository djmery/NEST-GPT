import { Injectable, NotFoundException } from '@nestjs/common';
import { AudioToTextDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { orthographyCheckUseCase, prosConsDicusserUseCase, prosConsDicusserStreamUseCase, translateUseCase, textToAudioUseCase, audioToTextUseCase } from './use-cases';
import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';



// el servicio es un lugar en el cual nosotros mediante injeccioes de depedencia, los servicios son un lugar centralikzado
// para mantener información

@Injectable()
export class GptService {
    // solo va a llamar casos de uso

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase(this.openai, {
            prompt: orthographyDto.prompt
        });
    }

    async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserUseCase(this.openai, { prompt });
    }

    async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserStreamUseCase(this.openai, { prompt });
    }

    async translateCheck({ prompt, lang }: TranslateDto) {
        return await translateUseCase(this.openai, { prompt, lang });
    }

    async textToAudio({ prompt, voice }: TextToAudioDto) {
        return await textToAudioUseCase(this.openai, { prompt, voice });
    }

    async textToAudioGetter(fileId: string) {
        const filePath = path.resolve(__dirname, '../../generated/audios', `${fileId}.mp3`);
        const wasFound = fs.existsSync(filePath);
        if (!wasFound) throw new NotFoundException(`File ${fileId} not found`);

        return filePath;
    }

    async audioToText(audioFile: Express.Multer.File, { prompt }: AudioToTextDto) {
        return await audioToTextUseCase(this.openai, { audioFile, prompt });
    }


}

