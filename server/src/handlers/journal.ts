import { JournalProcessor } from "../libs/ai";
import { tools } from "../libs/ai/tools";
import * as dotenv from "dotenv";
import prisma from "../libs/db";
import { buildJournalPayload, extractJournal } from "../utils/mappers";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const journalProcessor = new JournalProcessor({ tools });

export const journalBreakdown = async (req: any, res: any, next: any) => {
  try {
    const result = await journalProcessor.runAgentLoop({
      userId: req?.user?.id,
      payload: req.body,
      withEnemyGeneration: false,
    });

    return res.json(result);
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

    const payload = {
      title: req.body.title,
      body: req.body.body,
      challenge: req.body.challenge,
      alternative: req.body.alternative,
      cognitiveDistortionIds: req.body.cognitiveDistortionIds,
    };

    const base = buildJournalPayload(payload, {
      encryptionKey: player?.encryptionKey!,
    });

    await prisma.journal.update({
      where: { id: req.params.id, belongsToId: req.user.id },
      data: {
        ...base,
        belongsToId: req.user.id,
      },
    });

    const result = await journalProcessor.runAgentLoop({
      userId: req?.user?.id,
      payload,
      withEnemyGeneration: true,
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};
