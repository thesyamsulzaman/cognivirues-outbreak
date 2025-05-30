import { z } from "zod";
import { openai, ToolFn } from "..";
import { zodResponseFormat } from "openai/helpers/zod";
import { distortionKeys, infectedOutputSchema } from "../schemas";

export const enemiesGenerationToolDefinition = {
  name: "enemies_generation",
  parameters: z.object({
    payload: z.object({
      context: z
        .string()
        .describe(
          "Generated context from vector search result and the latest contextKeywords"
        ),
      distributedDistortionSets: z
        .array(z.array(z.string()))
        .describe(
          "an array of cognitiveDistortionIds on which each item is weighted by their frequency,"
        ),
      contextKeywords: z
        .array(z.string())
        .describe(
          "Context keywords that represents a whole, structured and clear gist of the journal"
        ),
    }),
  }),
  description:
    "Turning story into enemy json and ensure structured game response format",
};

type Args = z.infer<typeof enemiesGenerationToolDefinition.parameters>;

export const enemiesGeneration: ToolFn<Args, string> = async ({ toolArgs }) => {
  try {
    const enemies = await Promise.all(
      toolArgs.payload.distributedDistortionSets?.map(
        async (distortionSets) => {
          const prompt = `
            The user has been experiencing emotional challenges.

            Focus **primarily (80%)** on these recent thoughts:
            ${toolArgs.payload.contextKeywords.join(", ")}

            Use these broader themes as context or setting inspiration:
            ${toolArgs.payload.context}

            Create a story that reflects these struggles, written in **first person**, using the following cognitive distortions:
            ${distortionSets}

            Then transform the story into a **structured RPG-style enemy** that fits the following schema:

            ---

            ## Enemy Schema Output (All fields required):

            - **name**: A random first name for the enemy.
            - **description**: A short sentence (under 100 characters) describing the enemy emotionally.
            - **team**: "enemy"
            - **tile**: Always "26x15"
            - **xp**: 30
            - **hp**: 100
            - **maxXp**: 100
            - **maxHp**: 100

            ## Story Segments (Keep each message under 20 words):

            - **intro**: 2–4 'textMessage' items narrating the beginning of the enemy’s emotional journey that will show up before battle.
            - **backstories**: 2–4 'textMessage' items deepening the emotional struggles or past pain, Each starts with "{CASTER}: ..." .
            - **finalRemarks**: 1–3 'textMessage' items showing the state of the enemy after battle, Each starts with "{CASTER}: ..." .

            ## actions (Minimum 2 actions — each represents one distortion):

            Each **action** must include:
            - **distortedThoughts**: An array of 2–5 'textMessage' items. Each starts with "{CASTER}: ..." and reflects the distortion clearly.
            - **answer**: The answer that represent the correct distortion, the key must be taken from exactly: ${distortionKeys}
            - **options**: An array of 3 unique distortion keys from ${distortionKeys}, the array order must always be shuffled, where:
              - One must be the same as **answer**.
              - The other two are randomly selected from the remaining keys.

            Respond in **valid JSON format** according to this schema, no additional commentary.
          `.trim();

          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are a highly skilled and creative storyteller capable of evoking a realistic and brutally honest deep emotions through your writing. You seamlessly weave cognitive distortions into your narratives without explicitly mentioning them, allowing readers to experience them organically.`,
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.9,
            response_format: zodResponseFormat(
              infectedOutputSchema,
              "infected-output-schema"
            ),
          });

          return JSON.parse(response.choices[0].message.content ?? "{}");
        }
      )
    );

    return JSON.stringify({
      success: true,
      data: { enemies },
    });
  } catch (error) {
    console.error("Error during enemies generation", error);
    return JSON.stringify({ success: false, error });
  }
};
