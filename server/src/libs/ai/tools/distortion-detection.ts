// @ts-nocheck
import { z } from "zod";
import { buildStoryContext, openai, ToolFn } from "..";
import prisma from "../../db";
import { buildJournalPayload } from "../../../utils/mappers";
import {
  countDistortionFrequencies,
  distributeDistortionsEvenly,
} from "../../../utils/common";
import {
  distortionKeys,
  ENEMIES_AMOUNT,
  journalAnalysisSchema,
} from "../schemas";
import { zodResponseFormat } from "openai/helpers/zod";

export const distortionDetectionToolDefinition = {
  name: "distortion_detection",
  parameters: z.object({
    payload: z.object({
      userId: z.string().describe("userId from the journal payload"),
      body: z.string().describe("body of the original journal"),
      cognitiveDistortionIds: z
        .array(z.string())
        .describe(
          "cognitiveDistortionIds or Distortion category key names that matches outputSchema.insight.distortions"
        ),
      contextKeywords: z
        .array(z.string())
        .describe(
          "Context keywords that represents a whole, structured and clear gist of the journal"
        ),
    }),
  }),
  description: "Performing a cognitive distortion detection",
};

type Args = z.infer<typeof distortionDetectionToolDefinition.parameters>;

export const storyBuilding: ToolFn<Args, string> = async ({ toolArgs }) => {
  try {
    const [player, journalAnalysisResponse, contextExtractionResponse] =
      await Promise.all([
        prisma.player.findUnique({
          where: {
            id: toolArgs.payload.userId,
          },
        }),
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `
                Take the payload, analyze, breakdown, suggest a feedback and build an alternative story.

                Instruction
                - Provide a comprehensive cognitive distortions breakdown from the following journal payload: "userId", "title" and "body" and extract its main theme, Depth: 1.
                - Compare your identified distortions with the user's selection of "cognitiveDistortionIds", and assess their accuracy.
                - Combine your cognitive distortions breakdown result with the user selection ones, make sure to store them in "outputSchema.insight.distortions".
                - Based on this comparison, generate a concise (under 300 characters), supportive, and encouraging feedback highlighting the user's ability to recognize their own cognitive distortions. Assign this feedback to "outputSchema.insight.feedback".
              `,
            },
          ],
          temperature: 0.9,
          response_format: zodResponseFormat(
            journalAnalysisSchema,
            "journal-analysis-schema"
          ),
        }),
        openai.embeddings.create({
          model: "text-embedding-3-small",
          input: toolArgs.payload.contextKeywords.join(", "),
        }),
      ]);

    if (!player) {
      // It's better to throw a specific error than let `player.encryptionKey!` fail silently
      throw new Error(`Player with ID ${toolArgs.payload.userId} not found.`);
    }

    const journalAnalysis = JSON.parse(
      journalAnalysisResponse.choices[0].message.content
    );

    const base = buildJournalPayload(
      {
        title: toolArgs.payload.title,
        body: toolArgs.payload.body,
        challenge: "",
        alternative: "",
        cognitiveDistortionIds: toolArgs.payload.cognitiveDistortionIds,
      },
      { encryptionKey: player?.encryptionKey! }
    );

    const payload = {
      data: {
        ...base,
        belongsToId: toolArgs.payload.userId,
        embedding: contextExtractionResponse.data[0].embedding,
        contextKeywords: toolArgs.payload.contextKeywords,
      },
    };

    const journal = await prisma.journal.create(payload);

    const neighborsWithEmbeddings = await prisma.journal.findMany({
      from: contextExtractionResponse.data[0].embedding,
      orderBy: { embedding: "InnerProduct" },
      where: {
        belongsToId: toolArgs.payload.userId,
      },
      select: {
        contextKeywords: true,
        cognitiveDistortionIds: true,
      },
    });

    const neighbors = neighborsWithEmbeddings.map((neighbor) => {
      const { embedding, ...rest } = neighbor as any;
      return rest;
    });

    return JSON.stringify({
      success: true,
      data: {
        id: journal?.id,
        journalAnalysis,
        metadata: {
          neighbors,
          contextKeywords: toolArgs.payload.contextKeywords,
        },
      },
    });
  } catch (error) {
    console.error("Error during distortion detection", error);
    return JSON.stringify({ success: false, error });
  }
};
