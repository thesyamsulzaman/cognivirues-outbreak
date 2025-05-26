import { z } from "zod";

export const distortionKeys = [
  "all_or_nothing_thinking",
  "catastrophizing",
  "emotional_reasoning",
  "fortune_telling",
  "labeling",
  "magnification_of_the_negative",
  "mind_reading",
  "minimization_of_the_positive",
  "over_generalization",
  "should_statements",
  "self_blaming",
  "other_blaming",
];

export const ENEMIES_AMOUNT = 6;

export const textMessage = z.object({
  type: z.literal("textMessage"),
  text: z.string(),
});

export const stateChange = z.object({
  type: z.literal("stateChange"),
  damage: z.number(),
  onCaster: z
    .boolean()
    .optional()
    .describe("If true, damage applies to {CASTER}."),
});

const actionSchema = z.object({
  distortedThoughts: z
    .array(textMessage)
    .describe(
      "textMessage - '{CASTER}: Statements made by the enemy that clearly reflect the cognitive distortion. Displayed as part of the battle story. e.g., They’re all thinking I’m an idiot. I can see it in their eyes.'"
    ),
  answer: z
    .enum(distortionKeys as any)
    .describe(`The answer that represent the correct distortion`),
  options: z.array(z.enum(distortionKeys as any)).describe(`
      An array of 3 unique distortion keys, where:
      - One must be the same as **answer**.
      - The other two are randomly selected from the remaining keys.
      - The array order should be shuffled.
    `),
});

export const infectedOutputSchema = z.object({
  name: z.string().describe("A random first name of the enemy character"),
  description: z
    .string()
    .describe("Less than 100 letters description about the enemy"),
  team: z.literal("enemy"),
  tile: z.literal("26x15"),
  xp: z.literal(30),
  hp: z.literal(100),
  maxXp: z.literal(100),
  maxHp: z.literal(100),
  intro: z
    .array(textMessage)
    .describe(
      "Brief narration of the enemy's emotional journey. Keep each message under 20 words."
    ),
  backstories: z
    .array(textMessage)
    .describe(
      "Brief narration of the enemy's emotional journey. Keep each message under 20 words."
    ),
  finalRemarks: z
    .array(textMessage)
    .describe(
      "Brief final narration of the enemy's emotional journey. Keep each message under 20 words."
    ),
  actions: z
    .array(actionSchema)
    .describe(
      "It must have 2 unique actions minimum. Enemy actions derived from cognitive distortions."
    ),
});

export const journalOutputSchema = z.object({
  id: z.string().describe("journalId from created journal"),
  journalAnalysis: z.object({
    title: z
      .string()
      .describe(
        "Context specific main idea of the journal. Do not use markdown formatting or special characters."
      ),
    distortions: z
      .array(
        z.object({
          id: z
            .enum(distortionKeys as any)
            .optional()
            .describe(
              `Distortion category key name, should match the ${distortionKeys}, ( Do not change the property to anything else )`
            ),
          type: z.string().describe("Distortion category name"),
          description: z
            .string()
            .describe(
              'Pinpoint it from the journal and give brief distortion explaination with sympathy ( use "You" only, not "they", "writes", "he/she"), express affirmation for their feelings and emotions, also give some advice on what the writers can do in the situation ( do not create a new property, keep it in "description" property)'
            ),
        })
      )
      .describe("List of formatted cognitive distortions "),
    feedback: z
      .string()
      .describe(
        "A positive encouraging feedback for trying to identifying cognitive distortions"
      ),
  }),
});
