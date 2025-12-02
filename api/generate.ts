import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define styles here to avoid complex relative import issues in serverless environment
const STYLE_PROMPTS: Record<string, string> = {
  "None": "",
  "Photorealistic": ", highly detailed, photorealistic, 8k resolution, raw photography, sharp focus",
  "Cinematic": ", cinematic lighting, movie scene, dramatic atmosphere, color graded, wide angle, 4k",
  "Anime": ", anime style, studio ghibli inspired, vibrant colors, cel shaded, detailed background",
  "Cyberpunk": ", cyberpunk, neon lights, futuristic, high contrast, sci-fi atmosphere, chromatic aberration",
  "Oil Painting": ", oil painting texture, visible brushstrokes, classic art style, rich colors",
  "3D Render": ", 3D render, unreal engine 5, octane render, ray tracing, physically based rendering",
  "Minimalist": ", minimalist, flat design, vector art, simple shapes, clean lines, pastel colors"
};

// Supported aspect ratios by Gemini 2.5 Flash Image
const SUPPORTED_RATIOS = ["1:1", "3:4", "4:3", "9:16", "16:9"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt, aspectRatio, style } = req.body;

    // 1. Validation: API Key
    if (!process.env.API_KEY) {
      console.error("Server Error: API_KEY is missing in environment variables.");
      return res.status(500).json({ 
        message: 'Configuration Error: The server is missing the API_KEY. Please set it in your Vercel project settings.' 
      });
    }

    // 2. Validation: Prompt
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // 3. Validation: Aspect Ratio
    // Fallback to 1:1 if the provided ratio is not supported to prevent API errors
    let validAspectRatio = aspectRatio;
    if (!SUPPORTED_RATIOS.includes(aspectRatio)) {
      console.warn(`Unsupported aspect ratio received: ${aspectRatio}. Defaulting to 1:1.`);
      validAspectRatio = "1:1";
    }

    // Initialize Gemini API
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Enhance prompt
    const styleSuffix = STYLE_PROMPTS[style] || "";
    const finalPrompt = `${prompt}${styleSuffix}`;

    console.log(`[Server] Generating with model 'gemini-2.5-flash-image'. Ratio: ${validAspectRatio}`);

    // Call Model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: validAspectRatio,
        }
      }
    });

    // Extract Image
    let imageUrl: string | null = null;
    let textMessage: string = "";

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textMessage += part.text;
        }
      }
    }

    if (!imageUrl) {
      // Sometimes safety filters block the image
      console.warn("No image URL found in response", JSON.stringify(response));
      return res.status(500).json({ 
        message: 'No image was generated. The prompt might have triggered safety filters or the service is busy.' 
      });
    }

    return res.status(200).json({ imageUrl, textMessage });

  } catch (error: any) {
    console.error("Backend Error:", error);
    // Return the actual error message to help debugging (be careful in prod, but helpful now)
    return res.status(500).json({ 
      message: error.message || 'Internal Server Error',
      details: 'Check Vercel Function Logs for more info.'
    });
  }
}