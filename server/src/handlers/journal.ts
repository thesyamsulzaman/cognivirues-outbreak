import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("Missing GOOGLE_AI_API_KEY environment variable");
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const distortionKeys = [
  "all_or_nothing_thinking",
  "catastrophizing",
  "emotional_reasoning",
  "fortune_telling",
  "labeling",
  "magnification_of_the_negative",
  "mind_reading",
  "minimization_of_the_positive",
  "other_blaming",
  "over_generalization",
  "self_blaming",
  "should_statements",
];

const generatePrompt = ({ body }) => {
  const config = { depth: 1, focusArea: null };

  const prompt = `
    Provide a comprehensive cognitive distortions breakdown from the following journal and extract it's main theme: "${body}"
    
    Depth level: ${config.depth}

    Format your response as a valid JSON object with this structure:
    {
      "title": "Context specific main idea of the journal. Do not use markdown formatting or special characters.",
      "distortions": [ List of cognitive distortions formatted as a valid JSON object with this structure: 
        { 
          key: "Distortion category key name, should match the ${distortionKeys}, ( Do not change the property to anything else )",
          type: "Distortion category name",
          description: "Pinpoint it from the journal and give brief distortion explaination with sympathy ( use "You" only, not "they", "writes", "he/she"), also give some advice on what the writers can do in the situation ( do not create a new property, keep it in "description" property),
        }
      ]
    }

    Rules:
    1. Focus on the concrete and written cognitive distortions characteristics from the journal.
    2. Always refer to 10 Common type of Cognitive Distortions
    3. Response must be ONLY the JSON object, no other text.
    4. Adjust the detail level based on the depth parameter.
    5. Do not use markdown formatting or special characters in any text fields.  
    6. The "key" property should match ${distortionKeys} or no value at all
  `;

  return prompt;
};

export const openAIBreakdownJournal = async (req: any, res: any, next: any) => {
  const payload = {
    title: req.body.title,
    body: req.body.body,
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    messages: [
      { role: "system", content: generatePrompt({ body: payload.body }) },
    ],
  });

  console.log(response.choices[0].message.content);

  res.json({ message: "Breaking down journal" });
};

export const geminiBreakdownJournal = async (req: any, res: any, next: any) => {
  try {
    const payload = {
      title: req.body.title,
      body: req.body.body,
    };

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = generatePrompt({ body: payload.body });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const jsonStr = jsonMatch[0];
      const jsonResponse = JSON.parse(jsonStr);

      // Basic validation of the response structure
      if (
        !jsonResponse.title ||
        !jsonResponse.distortions.length ||
        !jsonResponse.distortions[0].key ||
        !jsonResponse.distortions[0].type ||
        !jsonResponse.distortions[0].description
      ) {
        throw new Error("Invalid response structure");
      }

      res.json({ data: jsonResponse, message: "Breaking down journal" });
    } catch (parseError) {
      console.error("Parse error:", parseError);
      console.error("Raw response:", text);

      res
        .status(500)
        .json({ error: "Failed to parse the AI response. Please try again." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
