import { runAIAgent } from "../libs/ai";
import { zodResponseFormat } from "openai/helpers/zod";
import { tools } from "../libs/ai/tools";
import { runTool } from "../libs/ai/ai-tool-runner";
import {
  addMessages,
  clearMessages,
  getMessages,
  saveToolResponse,
} from "../libs/memory";

import * as dotenv from "dotenv";
import prisma from "../libs/db";
import { buildJournalPayload, extractJournal } from "../utils/mappers";
import { distortionDetectionToolDefinition } from "../libs/ai/tools/distortion-detection";
import { ENEMIES_AMOUNT, journalOutputSchema } from "../libs/ai/schemas";
import { enemiesGenerationToolDefinition } from "../libs/ai/tools/enemies-generation";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export const journalBreakdown = async (req: any, res: any, next: any) => {
  try {
    const output = {};
    const userId = req?.user?.id;
    const { name: distortionDetection } = distortionDetectionToolDefinition;
    const { name: enemiesGenerationTool } = enemiesGenerationToolDefinition;

    await clearMessages(userId);

    const payload = {
      title: req.body.title,
      body: req.body.body,
      cognitiveDistortionIds: req.body.cognitiveDistortionIds,
    };

    const prompt = `
      Here's the user journal payload:

      \`\`\`json
        {
          "userId": "${req?.user?.id}"
          "title": "${payload.title}",
          "body": "${payload.body}",
          "cognitiveDistortionIds": ${JSON.stringify(
            payload.cognitiveDistortionIds
          )}
        }
      \`\`\`

      1. Call **${distortionDetection}** to take the payload, analyze, breakdown and suggest a feedback
      2. Call **${enemiesGenerationTool}** to build ${ENEMIES_AMOUNT} alternative stories in a specified enemy json format
    `;

    await addMessages(userId, [{ role: "user", content: prompt }]);

    // Agent Loop Starts
    while (true) {
      const history = await getMessages(userId);
      const response = await runAIAgent({
        messages: history,
        tools,
        response_format: zodResponseFormat(
          journalOutputSchema,
          "journal-output-schema"
        ),
      });

      await addMessages(userId, [response]);

      if (response.content) {
        await clearMessages(userId);

        const content = JSON.parse(response?.content);
        output["id"] = content?.id;
        output["journalAnalysis"] = content?.journalAnalysis;

        return res.json({
          message: "Cognitive Distortion Breakdown",
          data: { original: payload, ...output },
        });
      }

      if (response.tool_calls) {
        const toolCall = response.tool_calls[0];
        const toolResponse = await runTool(toolCall, prompt);
        const jsonToolResponse = JSON.parse(toolResponse);

        if (jsonToolResponse?.success === false && jsonToolResponse?.error) {
          throw new Error(JSON.stringify(jsonToolResponse.error));
        }

        if (
          toolCall?.function?.name === enemiesGenerationTool &&
          jsonToolResponse.success
        ) {
          output["enemies"] = jsonToolResponse?.data?.enemies;
        }

        await saveToolResponse(userId, toolCall.id, toolResponse);
      }
    }
  } catch (error) {
    next(error);
  }
};

export const getAllJournals = async (req: any, res: any, next: any) => {
  try {
    const player = await prisma.player.findUnique({
      where: { id: req.user.id },
      include: {
        journals: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!player) return res.status(404).json({ error: "Player not found" });

    const { encryptionKey } = player;

    const journals = player.journals.map((journal: any) => {
      const {
        id,
        title,
        body,
        alternative,
        challenge,
        cognitiveDistortionIds,
        encryptionMetadata,
        createdAt,
      } = journal;

      return {
        id,
        cognitiveDistortionIds,
        createdAt,
        ...extractJournal(
          {
            title: {
              data: title,
              iv: encryptionMetadata?.title_iv,
              authTag: encryptionMetadata?.title_authTag,
            },
            body: {
              data: body,
              iv: encryptionMetadata?.body_iv,
              authTag: encryptionMetadata?.body_authTag,
            },
            alternative: {
              data: alternative,
              iv: encryptionMetadata?.alternative_iv,
              authTag: encryptionMetadata?.alternative_authTag,
            },
            challenge: {
              data: challenge,
              iv: encryptionMetadata?.challenge_iv,
              authTag: encryptionMetadata?.challenge_authTag,
            },
          },
          { encryptionKey: encryptionKey! }
        ),
      };
    });

    return res.json({ data: journals });
  } catch (error) {
    next(error);
  }
};

export const journalBatchUpdate = async (req: any, res: any, next: any) => {
  try {
    const { journals } = req.body;
    const player = await prisma.player.findUnique({
      where: { id: req.user.id },
    });

    if (!player) return res.status(404).json({ error: "Player not found" });

    const operations: any[] = [];

    for (const entry of journals) {
      const {
        id,
        title,
        body,
        challenge,
        alternative,
        cognitiveDistortionIds,
        _destroy,
      } = entry;

      if (_destroy && id) {
        operations.push(prisma.journal.delete({ where: { id } }));
        continue;
      }

      const commonData = {
        ...buildJournalPayload(
          {
            title,
            body,
            challenge,
            alternative,
            cognitiveDistortionIds,
          },
          { encryptionKey: player?.encryptionKey! }
        ),
        belongsToId: req.user.id,
      };

      operations.push(
        id ? prisma.journal.update({ where: { id }, data: commonData }) : null // handle create here if needed later
      );
    }

    const result = await prisma.$transaction(operations.filter(Boolean));
    return res.json({ message: "Success", data: result });
  } catch (error) {
    next(error);
  }
};

export const journalUpdate = async (req: any, res: any, next: any) => {
  try {
    const player = await prisma.player.findUnique({
      where: { id: req.user.id },
    });

    if (!player) return res.status(404).json({ error: "Player not found" });

    const base = buildJournalPayload(
      {
        title: req.body.title,
        body: req.body.body,
        challenge: req.body.challenge,
        alternative: req.body.alternative,
        cognitiveDistortionIds: req.body.cognitiveDistortionIds,
      },
      { encryptionKey: player?.encryptionKey! }
    );

    const updated = await prisma.journal.update({
      where: { id: req.params.id, belongsToId: req.user.id },
      data: {
        ...base,
        belongsToId: req.user.id,
      },
    });

    return res.json({
      message: "Cognitive Distortion Breakdown",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
