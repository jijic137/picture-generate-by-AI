import { AspectRatio, GenerationResult, ImageStyle } from "../types";

/**
 * Frontend Service
 * Sends the prompt to our secure Vercel Backend (/api/generate).
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

    // Check if the response content type is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") === -1) {
      // If we get HTML back, it usually means 404/500 from Vite dev server, not the API
      const text = await response.text();
      console.error("Received non-JSON response:", text.substring(0, 100));
      throw new Error(
        "API endpoint not found. If running locally, use 'vercel dev' instead of 'npm run dev' to support API functions."
      );
    }

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