import * as dotenv from "dotenv";
import OpenAI from "openai";
import { zodFunction, zodResponseFormat } from "openai/helpers/zod";
import { biasedMergeKeywordWindows } from "../../utils/common";
import {
  addMessages,
  clearMessages,
  getMessages,
  saveToolResponse,
} from "../memory";
import { distortionDetectionToolDefinition } from "./tools/distortion-detection";
import { enemiesGenerationToolDefinition } from "./tools/enemies-generation";
import { enemySchema, journalAnalysisSchema } from "./schemas";
import { runTool } from "./ai-tool-runner";
import { z } from "zod";

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

const distortionDetection = distortionDetectionToolDefinition?.name;
const enemiesGeneration = enemiesGenerationToolDefinition?.name;

export const openai = new OpenAI({});

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
  try {
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export class JournalProcessor {
  private userId: string = "";
  private output: any = {};
  private tools: any[];

  constructor({ tools }) {
    this.tools = tools;
  }

  async enemyGenerationApproval({ history, prompt, approved = false }) {
    const lastMessage = history.at(-1);
    const toolCall = lastMessage?.tool_calls?.[0];

    if (!toolCall || toolCall.function.name !== enemiesGeneration) {
      return;
    }

    if (approved) {
      console.log(`[EXECUTING TOOL]: ${toolCall.function.name}`);
      const toolResponse = await runTool(toolCall, prompt);
      const jsonToolResponse = JSON.parse(toolResponse);
      await saveToolResponse(this.userId, toolCall.id, toolResponse);

      console.log(`[EXECUTED TOOL]: ${toolCall.function.name}`);

      if (jsonToolResponse.success) {
        this.output["enemies"] = jsonToolResponse?.data?.enemies;

        return {
          message: "Cognitive Distortion Breakdown",
          data: this.output,
        };
      }
    } else {
      await saveToolResponse(
        this.userId,
        toolCall.id,
        "User did not finish the journaling session"
      );
    }
  }

  async runAgentLoop({ userId, payload, withEnemyGeneration = false }) {
    try {
      this.userId = userId;

      const prompt = `
        Here's the user journal payload:

        \`\`\`json
          {
            "userId": "${userId}"
            "title": "${payload.title}",
            "body": "${payload.body}",
            "cognitiveDistortionIds": ${JSON.stringify(
              payload.cognitiveDistortionIds
            )}
          }
        \`\`\`

        1. Call **${distortionDetection}** to take the payload, analyze, breakdown and suggest a feedback
        2. Call **${enemiesGeneration}** to build 6 alternative stories in a specified enemy json format
      `;

      const history = await getMessages(this.userId);
      const generatedEnemies = await this.enemyGenerationApproval({
        history,
        prompt,
        approved: withEnemyGeneration,
      });

      if (!withEnemyGeneration) {
        this.output = {};
        await clearMessages(this.userId);
        await addMessages(this.userId, [{ role: "user", content: prompt }]);
      } else {
        return generatedEnemies;
      }

      while (true) {
        const history = await getMessages(this.userId);
        const response = await runAIAgent({
          messages: history,
          tools: this.tools,
          response_format: zodResponseFormat(
            z.object({
              id: z.string().describe("id of the journal"),
              ...journalAnalysisSchema.shape,
              enemies: z.array(enemySchema).describe("list of enemies"),
            }),
            "thought-record-output-schema"
          ),
        });

        await addMessages(this.userId, [response]);

        if (response.content) {
          await clearMessages(this.userId);
        }

        if (response.tool_calls) {
          const toolCall = response.tool_calls[0];
          console.log(`[EXECUTING TOOL]: ${toolCall.function.name}`);

          // Stop the agent loop before enemies generation
          if (toolCall.function.name === enemiesGeneration) {
            return {
              message: "Cognitive Distortion Breakdown",
              data: this.output,
            };
          }

          const toolResponse = await runTool(toolCall, prompt);
          const jsonToolResponse = JSON.parse(toolResponse);

          if (jsonToolResponse?.success === false && jsonToolResponse?.error) {
            throw new Error(JSON.stringify(jsonToolResponse.error));
          }

          if (
            toolCall.function.name === distortionDetection &&
            jsonToolResponse.success
          ) {
            this.output["id"] = jsonToolResponse?.data?.id;
            this.output["journalAnalysis"] =
              jsonToolResponse?.data?.journalAnalysis;
            this.output["metadata"] = jsonToolResponse?.data?.metadata;
          }

          await saveToolResponse(this.userId, toolCall.id, toolResponse);
          console.log(`[EXECUTED TOOL]: ${toolCall.function.name}`);
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export async function buildStoryContext(
  userKeywordHistory: string[][],
  { useSummarization = true }
) {
  const merged = biasedMergeKeywordWindows(userKeywordHistory);

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
