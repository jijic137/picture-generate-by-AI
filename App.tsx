import React, { useState } from 'react';
import { Header } from './components/Header';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { StyleSelector } from './components/StyleSelector';
import { ImageDisplay } from './components/ImageDisplay';
import { generateImageOnServer } from './services/geminiService';
import { AspectRatio, LoadingState, ImageStyle } from './types';
import { Wand2, AlertTriangle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [imageStyle, setImageStyle] = useState<ImageStyle>(ImageStyle.NONE);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoadingState('generating');
    setError(null);
    setGeneratedImage(null);

    try {
      // Calling the "Backend" service
      const result = await generateImageOnServer(prompt, aspectRatio, imageStyle);
      setGeneratedImage(result.imageUrl);
      setLoadingState('success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'The server encountered an issue generating your image.');
      setLoadingState('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-violet-500/30 selection:text-violet-200">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">Create your vision</h2>
              <p className="text-zinc-400 font-light leading-relaxed">
                Describe your imagination in detail. Our AI will handle the rest, processing your request securely on the backend.
              </p>
            </div>

            <div className="space-y-6">
              
              {/* Prompt Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="prompt" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Prompt
                  </label>
                  <span className={`text-xs ${prompt.length > 500 ? 'text-orange-500' : 'text-zinc-600'}`}>
                    {prompt.length} / 1000
                  </span>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl opacity-20 group-hover:opacity-50 transition duration-500 blur"></div>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="A futuristic city on Mars with glass domes, red dust storms, cinematic lighting..."
                    disabled={loadingState === 'generating'}
                    className="relative w-full h-36 px-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none text-zinc-100 placeholder:text-zinc-600 text-sm leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Controls Grid */}
              <div className="p-5 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl space-y-6 backdrop-blur-sm">
                {/* Styles */}
                <StyleSelector 
                  value={imageStyle}
                  onChange={setImageStyle}
                  disabled={loadingState === 'generating'}
                />

                {/* Aspect Ratio */}
                <AspectRatioSelector 
                  value={aspectRatio} 
                  onChange={setAspectRatio} 
                  disabled={loadingState === 'generating'}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start gap-3 text-red-200 animate-in fade-in slide-in-from-top-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loadingState === 'generating' || !prompt.trim()}
                className={`
                  w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-3 transition-all duration-300
                  ${loadingState === 'generating' || !prompt.trim() 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-900/30 hover:scale-[1.02] active:scale-[0.98]'}
                `}
              >
                {loadingState === 'generating' ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="animate-pulse">Processing on Server...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Artwork
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            <div className="sticky top-28">
                <ImageDisplay 
                    imageSrc={generatedImage} 
                    loading={loadingState === 'generating'} 
                    onRetry={handleGenerate}
                />
                
                {generatedImage && (
                  <div className="mt-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-violet-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-zinc-300">Prompt used</h4>
                      <p className="text-xs text-zinc-500 mt-1 italic">
                        "{prompt}" 
                        {imageStyle !== ImageStyle.NONE && <span className="text-violet-400"> + {imageStyle} Style</span>}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;