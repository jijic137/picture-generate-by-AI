import { GoogleGenAI } from "@google/genai";
import { AspectRatio, GenerationResult } from "../types";

// Initialize the client.
// In a real production full-stack app, this code would reside on a Node.js/Python server
// to keep the API_KEY hidden from the browser network tab.
// For this SPA environment, we use the process.env injection provided by the runtime.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using the Gemini 2.5 Flash Image model.
 * 
 * @param prompt The user's description of the image.
 * @param aspectRatio The desired aspect ratio (e.g., "16:9").
 * @returns A promise resolving to the image URL (base64) and optional text.
 */
export const generateImageFromPrompt = async (
  prompt: string, 
  aspectRatio: AspectRatio
): Promise<GenerationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // note: imageSize is only supported in gemini-3-pro-image-preview
        }
      }
    });

    let imageUrl: string | null = null;
    let textMessage: string = "";

    // Parse the response parts. Gemini may return text along with the image.
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      
      for (const part of parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          // Construct the data URI
          imageUrl = `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
        } else if (part.text) {
          textMessage += part.text;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image data received from the model.");
    }

    return { imageUrl, textMessage };

  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};