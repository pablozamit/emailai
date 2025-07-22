import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAiClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API key not provided.");
  }
  return new GoogleGenAI({ apiKey });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { instruction, apiKey } = req.body;

    if (!instruction || !apiKey) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    const ai = getAiClient(apiKey);

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: instruction,
            config: {
              temperature: 0.7,
              maxOutputTokens: 100,
            },
          });

        const suggestion = response.text;
        res.status(200).json({ suggestion });

    } catch (error) {
        console.error("Error generating suggestion:", error);
        res.status(500).json({ message: "Failed to generate suggestion from AI." });
    }
}
