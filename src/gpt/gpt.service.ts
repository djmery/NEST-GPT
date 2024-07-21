import { Injectable } from '@nestjs/common';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import { orthographyCheckUseCase, prosConsDicusserUseCase, prosConsDicusserStreamUseCase, TranslateUseCase } from './use-cases';
import OpenAI from 'openai';



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
        return await TranslateUseCase(this.openai, { prompt, lang });
    }
}

