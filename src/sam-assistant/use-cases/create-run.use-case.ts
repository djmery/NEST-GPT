import OpenAI from "openai";

interface Options {
    threadId: string;
    assistantId?: string;
}


export const createRunUseCase = async (openai: OpenAI, options: Options) => {

    const { threadId, assistantId = 'asst_r42GzG5K3aWEPf9Rzkib1SwF' } = options;


    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId
        // instructions: OJO!! Sobrescribe el asistente
    });

    console.log({ run });
    return run;

}