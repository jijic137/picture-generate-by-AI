import { AspectRatio, GenerationResult, ImageStyle } from "../types";

/**
 * Frontend Service
 * Sends the prompt to our secure Vercel Backend (/api/generate).
 * The API Key is NO LONGER exposed here.
 */
export const generateImageOnServer = async (
  originalPrompt: string, 
  aspectRatio: AspectRatio,
  style: ImageStyle
): Promise<GenerationResult> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: originalPrompt,
        aspectRatio: aspectRatio,
        style: style
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Server error: ${response.status}`);
    }

    return {
      imageUrl: data.imageUrl,
      textMessage: data.textMessage
    };

  } catch (error: any) {
    console.error("Generation Request Failed:", error);
    throw new Error(error.message || "Failed to connect to the generation server.");
  }
};