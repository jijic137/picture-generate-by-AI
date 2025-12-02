export enum AspectRatio {
  SQUARE = "1:1",
  LANDSCAPE = "16:9",
  PORTRAIT = "9:16",
  STANDARD_LANDSCAPE = "4:3",
  STANDARD_PORTRAIT = "3:4"
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
