import { GoogleGenAI, Type } from "@google/genai";
import { Business } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeBusiness = async (business: Business) => {
  const prompt = `
    Analyze this business lead for a B2B service provider.
    Business Name: ${business.name}
    Rating: ${business.rating}
    Reviews: ${business.reviews}
    Notes: ${business.notes || "No notes provided."}
    
    Provide:
    1. A "Lead Score" from 0 to 100 based on how promising this lead seems.
    2. A short "Strategic Summary" (max 2 sentences) on why this lead is valuable or what the main challenge might be.
    3. A personalized "Cold Outreach Email" template (subject and body) tailored to this specific business.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: {
            type: Type.NUMBER,
            description: "Lead score from 0 to 100."
          },
          summary: {
            type: Type.STRING,
            description: "Short strategic summary."
          },
          outreach: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              body: { type: Type.STRING }
            },
            required: ["subject", "body"]
          }
        },
        required: ["score", "summary", "outreach"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};
