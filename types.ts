export enum AspectRatio {
  SQUARE = "1:1",
  LANDSCAPE = "16:9",
  PORTRAIT = "9:16",
  WIDE = "2:1"
}

export enum ImageStyle {
  NONE = "None",
  PHOTOREALISTIC = "Photorealistic",
  CINEMATIC = "Cinematic",
  ANIME = "Anime",
  CYBERPUNK = "Cyberpunk",
  OIL_PAINTING = "Oil Painting",
  d3_RENDER = "3D Render",
  MINIMALIST = "Minimalist"
}

export interface GenerationResult {
  imageUrl: string | null;
  textMessage?: string;
}

export interface GenerationError {
  message: string;
  code?: string;
}

export type LoadingState = 'idle' | 'generating' | 'success' | 'error';