import type OpenAI from "openai";
import {
  enemiesGeneration,
  enemiesGenerationToolDefinition,
} from "./tools/enemies-generation";
import {
  distortionDetection,
  distortionDetectionToolDefinition,
} from "./tools/distortion-detection";

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || "{}"),
  };

  switch (toolCall.function.name) {
    case distortionDetectionToolDefinition.name:
      return distortionDetection(input);

    case enemiesGenerationToolDefinition.name:
      return enemiesGeneration(input);

    default:
      return `Never run this tool: ${toolCall.function.name} again, or else!`;
  }
};
