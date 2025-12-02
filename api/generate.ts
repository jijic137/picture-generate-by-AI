import type { VercelRequest, VercelResponse } from '@vercel/node';

// We use FLUX.1-schnell because it's fast, open (Apache 2.0), and works great on free inference API.
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";

const STYLE_PROMPTS: Record<string, string> = {
  "None": "",
  "Photorealistic": ", highly detailed, photorealistic, 8k resolution, raw photography, sharp focus, realistic texture",
  "Cinematic": ", cinematic lighting, movie scene, dramatic atmosphere, color graded, wide angle, 4k, anamorphic lens",
  "Anime": ", anime style, studio ghibli inspired, vibrant colors, cel shaded, detailed background, 2d animation",
  "Cyberpunk": ", cyberpunk, neon lights, futuristic, high contrast, sci-fi atmosphere, chromatic aberration, blade runner style",
  "Oil Painting": ", oil painting texture, visible brushstrokes, classic art style, rich colors, canvas texture",
  "3D Render": ", 3D render, unreal engine 5, octane render, ray tracing, physically based rendering, hyper detailed",
  "Minimalist": ", minimalist, flat design, vector art, simple shapes, clean lines, pastel colors, high key"
};

// Map AspectRatio enum to pixel dimensions (FLUX works best with multiples of 8/16)
const DIMENSIONS: Record<string, { width: number; height: number }> = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1024, height: 576 }, // Landscape
  "9:16": { width: 576, height: 1024 }, // Portrait
  "4:3": { width: 1024, height: 768 },  // Standard
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { prompt, aspectRatio, style } = req.body;

    // 1. Check API Key
    if (!process.env.API_KEY) {
      return res.status(500).json({ 
        message: 'Server Configuration Error: Missing API_KEY. Please set your Hugging Face Token in Vercel settings.' 
      });
    }

    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    // 2. Prepare Prompt & Dimensions
    const styleSuffix = STYLE_PROMPTS[style] || "";
    const finalPrompt = `${prompt}${styleSuffix}`;
    
    // Default to square if ratio not found
    const dims = DIMENSIONS[aspectRatio] || DIMENSIONS["1:1"];

    console.log(`[Server] Requesting Hugging Face: ${HF_MODEL_URL}`);
    console.log(`[Server] Size: ${dims.width}x${dims.height}, Style: ${style}`);

    // 3. Call Hugging Face API
    const response = await fetch(HF_MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: finalPrompt,
        parameters: {
            width: dims.width,
            height: dims.height,
            // FLUX specific:
            guidance_scale: 3.5, 
            num_inference_steps: 4, // Schnell is fast, 4 steps is usually enough
            seed: Math.floor(Math.random() * 1000000)
        }
      }),
    });

    // 4. Handle Response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[HF API Error]", response.status, errorText);
      
      let userMsg = "Failed to generate image.";
      
      if (response.status === 503) {
        userMsg = "The model is currently loading (cold start). Please try again in 20 seconds.";
      } else if (response.status === 401 || response.status === 403) {
        userMsg = "Invalid API Key. Please check your Hugging Face token.";
      } else if (errorText.includes("rate limit")) {
        userMsg = "Rate limit exceeded. Please wait a moment.";
      }

      return res.status(response.status).json({ message: userMsg, details: errorText });
    }

    // 5. Convert Binary Image to Base64
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    return res.status(200).json({ imageUrl, textMessage: "Generated with FLUX.1-schnell" });

  } catch (error: any) {
    console.error("Backend Error:", error);
    return res.status(500).json({ 
      message: error.message || 'Internal Server Error',
    });
  }
}