import OpenAI from 'openai';

interface Options {
    threadId: string;
    question: string;
}

export const createMessageUseCase = async (openai: OpenAI, options: Options) => {

    const { threadId, question } = options;

    //crea el mensaje en el thread
    const message = await openai.beta.threads.messages.create(
        threadId,
        {
            role: "user",
            content: question
        });

    return message;

}