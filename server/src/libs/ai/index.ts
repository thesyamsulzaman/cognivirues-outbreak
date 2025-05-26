import * as dotenv from "dotenv";
import OpenAI from "openai";
import { zodFunction, zodResponseFormat } from "openai/helpers/zod";
import { biasedMergeKeywordWindows, slidingWindows } from "../../utils/common";

dotenv.config();

export type AIMessage =
  | OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam
  | { role: "user"; content: string }
  | { role: "tool"; content: string; tool_call_id: string };

export interface ToolFn<A = any, T = any> {
  (input: { userMessage: string; toolArgs: A }): Promise<T>;
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export const openai = new OpenAI({
  // fetch: async (url: any, init?: RequestInit): Promise<Response> => {
  //   console.log("About to make a request", url, init);
  //   const response = await fetch(url, init);
  //   console.log("Got response", response);
  //   return response;
  // },
});

export const runAIAgent = async ({
  messages,
  tools = [],
  temperature = 0.1,
  response_format,
}: {
  messages: AIMessage[];
  tools?: any[];
  temperature?: number;
  response_format?: any;
}): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> => {
  const formattedTools = tools.map(zodFunction);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature,
    messages: [
      {
        role: "system",
        content: `
          You are an AI therapist. Your role is to assist users in reflecting on their thoughts, detecting cognitive distortions, and generating meaningful in-game challenges.
          Your responses should be empathetic, structured, and aligned with Cognitive Behavioral Therapy (CBT) principles, you always use provided tool.
        `,
      },
      ...messages,
    ],
    response_format,
    tools: formattedTools,
    tool_choice: "auto",
    parallel_tool_calls: false,
  });

  return response.choices[0].message;
};

export async function buildStoryContext(
  userKeywordHistory: string[][],
  { windowSize = 2, step = 1, useSummarization = true }
) {
  const windows = slidingWindows(userKeywordHistory, windowSize, step);
  const merged = biasedMergeKeywordWindows(windows);

  if (useSummarization) {
    const summaries = await Promise.all(
      merged.map(async (themeKeywords) => {
        const keywords = themeKeywords.join(", ");

        const res = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `Summarize the emotional pattern in: ${keywords}}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 50,
        });
        return res.choices[0].message.content!.trim();
      })
    );

    return summaries.map((s, i) => `(${i + 1}) ${s}`).join("\n");
  } else {
    return merged.map((w, i) => `(${i + 1}) ${w.join(", ")}`).join("\n");
  }
}
