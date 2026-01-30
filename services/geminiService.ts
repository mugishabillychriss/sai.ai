
import { GoogleGenAI, Type } from "@google/genai";
import { ArtifactAnalysis } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeArtifactWithGemini = async (imageBase64: string): Promise<ArtifactAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          text: `You are an expert archaeological AI. Analyze this image and provide a highly detailed interpretation.
          
          Focus on:
          1. MATERIAL ANALYSIS: Identify the specific material (e.g., high-tin bronze, fine-grain marble, slips-coated terracotta).
          2. CONDITION ASSESSMENT: Evaluate state of preservation (e.g., intact, severe surface mineralization, fragmented with missing parts).
          3. DECORATIVE ELEMENTS: Describe any visible patterns, inscriptions, motifs, or symbolic marks.
          4. KNOWLEDGE BASE INTEGRATION: Provide a concise historical summary of the identified culture and period, acting as a linked knowledge base entry.
          
          Return the data in valid JSON format.`
        },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.split(',')[1] || imageBase64,
          },
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Common or academic name of the artifact" },
          estimatedPeriod: { type: Type.STRING, description: "Specific chronological range" },
          origin: { type: Type.STRING, description: "Cultural or geographical context" },
          material: { type: Type.STRING, description: "Detailed material composition" },
          condition: { type: Type.STRING, description: "Assessment of preservation and damage" },
          decorativeElements: { type: Type.STRING, description: "Description of motifs or inscriptions" },
          detectedFeatures: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Bullet points of specific visible identifiers."
          },
          historicalSignificance: { type: Type.STRING, description: "Context and importance" },
          conservationAdvice: { type: Type.STRING, description: "Handling and preservation protocol" },
          knowledgeBaseSummary: { type: Type.STRING, description: "Broader historical context of the culture/period" },
          confidenceScore: { type: Type.NUMBER, description: "Scale 0-1" }
        },
        required: ["name", "estimatedPeriod", "origin", "material", "condition", "knowledgeBaseSummary", "confidenceScore"]
      }
    }
  });

  const analysis = JSON.parse(response.text);
  return {
    ...analysis,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
};
