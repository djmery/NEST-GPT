import OpenAI from "openai";

interface Options {
    threadId: string,
    runId: string;
}

export const checkCompleteStatusUseCase = async (openai: OpenAI, options: Options) => {
    const { threadId, runId } = options;
    const runStatus = await openai.beta.threads.runs.retrieve(
        threadId,
        runId
    );

    console.log({ status: runStatus.status }); //seguimos la función hasta que tengamos un status de completed

    if (runStatus.status === 'completed') {
        return runStatus;
    }

    // esperamos un segundo antes de volver a consultar

    await new Promise(resolve => setTimeout(resolve, 1000));

    return await checkCompleteStatusUseCase(openai, options); //sino se cumple en completed, volvemos a llamar la función // función recursiva

}