import { z } from "zod";
import { buildStoryContext, openai, ToolFn } from "..";
import prisma from "../../db";
import { buildJournalPayload } from "../../../utils/mappers";
import {
  countDistortionFrequencies,
  distributeDistortionsEvenly,
} from "../../../utils/common";
import { distortionKeys, ENEMIES_AMOUNT } from "../schemas";

export const distortionDetectionToolDefinition = {
  name: "distortion_detection",
  parameters: z.object({
    payload: z.object({
      userId: z.string().describe("id of a user that wrote the journal"),
      title: z.string().describe("title from the original journal"),
      body: z.string().describe("body of the original journal"),
      cognitiveDistortionIds: z
        .array(z.string())
        .describe(
          "cognitiveDistortionIds or Distortion category key names that matches outputSchema.journalAnalysis.distortions"
        ),
      contextKeywords: z
        .array(z.string())
        .describe(
          "Context keywords that represents a whole, structured and clear gist of the journal"
        ),
    }),
  }),
  description: `
    to take the payload, analyze, breakdown, suggest a feedback and build an alternative story.

    Instruction
    - Provide a comprehensive cognitive distortions breakdown from the following journal payload: "userId", "title" and "body" and extract its main theme, Depth: 1.
    - Compare your identified distortions with the user's selection of "cognitiveDistortionIds", and assess their accuracy.
    - Combine your cognitive distortions breakdown result with the user selection ones, make sure to store them in "outputSchema.journalAnalysis.distortions".
    - Based on this comparison, generate a concise (under 300 characters), supportive, and encouraging feedback highlighting the user's ability to recognize their own cognitive distortions. Assign this feedback to "outputSchema.journalAnalysis.feedback".
  `,
};

type Args = z.infer<typeof distortionDetectionToolDefinition.parameters>;

export const storyBuilding: ToolFn<Args, string> = async ({ toolArgs }) => {
  try {
    const player = await prisma.player.findUnique({
      where: {
        id: toolArgs.payload.userId,
      },
    });

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

    const contextExtractionResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: `${toolArgs.payload.contextKeywords.join(", ")}`,
    });

    const payload = {
      data: {
        ...base,
        belongsToId: toolArgs.payload.userId,
        embedding: contextExtractionResponse.data[0].embedding,
        contextKeywords: toolArgs.payload.contextKeywords,
      },
    };

    const journal = await prisma.journal.create(payload);

    const neighbors = await prisma.journal.findMany({
      from: contextExtractionResponse.data[0].embedding,
      orderBy: { embedding: "InnerProduct" },
      where: {
        belongsToId: toolArgs.payload.userId,
      },
      select: {
        contextKeywords: true,
        embedding: true,
        cognitiveDistortionIds: true,
      },
    });

    const cognitiveDistortionFrequencies = countDistortionFrequencies(
      neighbors?.map((journal) => journal?.cognitiveDistortionIds),
      distortionKeys
    );

    const distributedDistortionSets = distributeDistortionsEvenly(
      cognitiveDistortionFrequencies,
      ENEMIES_AMOUNT
    );

    const context = await buildStoryContext(
      neighbors?.map((journal) => journal?.contextKeywords)!,
      {
        windowSize: 2,
        step: 1,
        useSummarization: true,
      }
    );

    return JSON.stringify({
      success: true,
      data: {
        journalId: journal?.id,
        context,
        distributedDistortionSets,
      },
    });
  } catch (error) {
    console.error("Error during distortion detection", error);

    return JSON.stringify({ success: false, error });
  }
};
