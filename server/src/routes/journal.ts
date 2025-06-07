import { Router } from "express";
import { z } from "zod";
import validate from "../utils/validate";
import {
  getAllJournals,
  journalBatchUpdate,
  journalBreakdown,
  journalUpdate,
} from "../handlers/journal";

const journalRouter: Router = Router();

const journalSchema = z.object({
  id: z.string().optional(),
  _destroy: z.boolean().optional(),
  title: z
    .string()
    .min(5, { message: "Must be 5 or more characters long" })
    .max(100, { message: "Must be 100 or fewer characters long" }),
  body: z
    .string()
    .min(5, { message: "Must be 5 or more characters long" })
    .max(500, { message: "Must be 500 or fewer characters long" }),
  challenge: z
    .string()
    .min(5, { message: "Must be 5 or more characters long" })
    .max(500, { message: "Must be 500 or fewer characters long" })
    .or(z.literal("")),
  alternative: z
    .string()
    .min(5, { message: "Must be 5 or more characters long" })
    .max(500, { message: "Must be 500 or fewer characters long" })
    .or(z.literal("")),
  cognitiveDistortionIds: z.array(z.string()).default([]),
});

const journalsSchema = z.object({ journals: z.array(journalSchema).min(1) });

journalRouter.put(
  "/batch-update",
  validate(journalsSchema),
  journalBatchUpdate
);
journalRouter.post("/", validate(journalSchema), journalBreakdown);
journalRouter.put("/:id", validate(journalSchema), journalUpdate);
journalRouter.get("/", getAllJournals);

export default journalRouter;
