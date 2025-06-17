import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { buildStoryContext, openai, ToolFn } from "..";
import { countAndDistributeDistortions } from "../../../utils/common";
import { distortionKeys, ENEMIES_AMOUNT, enemySchema } from "../schemas";

export const enemiesGenerationToolDefinition = {
  name: "enemies_generation",
  parameters: z.object({
    payload: z.object({
      neighbors: z
        .array(
          z.object({
            contextKeywords: z.array(z.string()),
            cognitiveDistortionIds: z.array(z.string()),
          })
        )
        .describe("Neighbors result from the distortion detection metadata"),
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
    const context = await buildStoryContext(
      toolArgs.payload.neighbors?.map(
        (journal: any) => journal?.contextKeywords
      ),
      {}
    );

    const distributedDistortionSets = countAndDistributeDistortions(
      toolArgs.payload.neighbors.map(
        (journal: any) => journal?.cognitiveDistortionIds
      ),
      ENEMIES_AMOUNT,
      distortionKeys
    );

    const enemies = await Promise.all(
      distributedDistortionSets?.map(async (distortionSets) => {
        const prompt = `
          The user has been experiencing emotional challenges.

          Focus **primarily (80%)** on these recent thoughts:
          ${toolArgs.payload.contextKeywords.join(", ")}

          Use these broader themes as context or setting inspiration:
          ${context}

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

          ## Actions (Minimum: 2 actions, each represents one distortion):
          Each **action** must include the following fields:

          - **distortedThoughts**: An array of 2–5 'textMessage' items.  
            - Each must begin with '{CASTER}: ...'
            - Each must vividly express a specific cognitive distortion based on the **correct** distortion key.  
            - Avoid vague or ambiguous wording—each message must be clearly indicative of the chosen distortion.

          - **answer**: The correct distortion key from the allowed list: ${distortionKeys}  
            - This must **directly correspond** to the distortedThoughts above.

          - **options**: An array of 3 **unique** distortion keys from ${distortionKeys}:
            - **One must match** the 'answer'.
            - The **other two must be clearly different** distortions from the 'answer' (not easily confused).
            - The array **must be shuffled randomly** to avoid always putting the correct answer in the same position.

          Important Constraints:
          - The incorrect options must be **meaningfully different** and not plausible correct answers for the given distortedThoughts.
          - The final 'options' array must be in **random order**, and not predictable or sorted.

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
          response_format: zodResponseFormat(enemySchema, "enemies-schema"),
        });

        return JSON.parse(response.choices[0].message.content ?? "{}");
      })
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
