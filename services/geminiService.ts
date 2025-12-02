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
      const text = await response.text();
      console.error("Received non-JSON response from API:", text.substring(0, 200));
      
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isLocal) {
        throw new Error(
          "API not accessible. Please run the app using 'npx vercel dev' to enable the backend functions."
        );
      } else {
        throw new Error(
          "Unable to connect to generation service. The server might be misconfigured (check API Keys) or busy."
        );
      }
    }

    const data = await response.json();

    if (!response.ok) {
      // Pass through specific backend messages
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