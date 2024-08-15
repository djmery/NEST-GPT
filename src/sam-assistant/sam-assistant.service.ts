import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { checkCompleteStatusUseCase, createMessageUseCase, createRunUseCase, createThreadUseCase, getMessageListUseCase } from './use-cases';
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class SamAssistantService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    async createThread() {
        return await createThreadUseCase(this.openai);
    }

    async userQuestion({ threadId, question }: QuestionDto) {
        //const message = await createMessageUseCase(this.openai, { threadId, question }); //creamos el mensaje
        await createMessageUseCase(this.openai, { threadId, question }); //creamos el mensaje
        const run = await createRunUseCase(this.openai, { threadId }); //creamos el run
        await checkCompleteStatusUseCase(this.openai, { runId: run.id, threadId }); //estamos esperando el estado completado del run 
        const messages = await getMessageListUseCase(this.openai, { threadId }); // obtenemos todos los mensajes basados en este threat

        return messages;
    }
}