import { GoogleGenAI } from "@google/genai";
import { AspectRatio, GenerationResult, ImageStyle } from "../types";

// ==================================================================================
// BACKEND SIMULATION
// ==================================================================================
// In a real architecture, this file would be a Server Action (Next.js) or 
// a controller in an Express/Python backend.
// The API_KEY is strictly accessed here and should NEVER be exposed to the client bundle
// in a production build.
// ==================================================================================

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const enhancePromptWithStyle = (prompt: string, style: ImageStyle): string => {
  if (style === ImageStyle.NONE) return prompt;
  
  const stylePrompts: Record<ImageStyle, string> = {
    [ImageStyle.NONE]: "",
    [ImageStyle.PHOTOREALISTIC]: ", highly detailed, photorealistic, 8k resolution, raw photography, sharp focus",
    [ImageStyle.CINEMATIC]: ", cinematic lighting, movie scene, dramatic atmosphere, color graded, wide angle, 4k",
    [ImageStyle.ANIME]: ", anime style, studio ghibli inspired, vibrant colors, cel shaded, detailed background",
    [ImageStyle.CYBERPUNK]: ", cyberpunk, neon lights, futuristic, high contrast, sci-fi atmosphere, chromatic aberration",
    [ImageStyle.OIL_PAINTING]: ", oil painting texture, visible brushstrokes, classic art style, rich colors",
    [ImageStyle.d3_RENDER]: ", 3D render, unreal engine 5, octane render, ray tracing, physically based rendering",
    [ImageStyle.MINIMALIST]: ", minimalist, flat design, vector art, simple shapes, clean lines, pastel colors"
  };

  return `${prompt}${stylePrompts[style] || ""}`;
};

/**
 * Server-side function to generate image.
 * This acts as the secure bridge between the frontend request and the Google Gemini API.
 */
export const generateImageOnServer = async (
  originalPrompt: string, 
  aspectRatio: AspectRatio,
  style: ImageStyle
): Promise<GenerationResult> => {
  try {
    // 1. Validate Input (Basic Security)
    if (!originalPrompt || originalPrompt.length > 1000) {
      throw new Error("Invalid prompt length.");
    }

    // 2. Enhance Prompt based on style selection
    const finalPrompt = enhancePromptWithStyle(originalPrompt, style);
    
    console.log(`[Server] Generating with prompt: ${finalPrompt}`);

    // 3. Call Gemini API
    // Using 'gemini-2.5-flash-image' for fast, high-quality generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: finalPrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    // 4. Process Response
    let imageUrl: string | null = null;
    let textMessage: string = "";

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      
      for (const part of parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          imageUrl = `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
        } else if (part.text) {
          textMessage += part.text;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("The model did not return an image. It might have been blocked by safety filters.");
    }

    return { imageUrl, textMessage };

  } catch (error: any) {
    console.error("Backend Error:", error);
    throw new Error(error.message || "Failed to process request on server.");
  }
};