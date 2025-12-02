import React, { useState } from 'react';
import { Header } from './components/Header';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { ImageDisplay } from './components/ImageDisplay';
import { generateImageFromPrompt } from './services/geminiService';
import { AspectRatio, LoadingState } from './types';
import { Wand2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoadingState('generating');
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateImageFromPrompt(prompt, aspectRatio);
      setGeneratedImage(result.imageUrl);
      setLoadingState('success');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while generating the image.');
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Create your vision</h2>
              <p className="text-slate-500">Describe what you want to see, and our AI will bring it to life instantly.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              
              {/* Prompt Input */}
              <div className="space-y-2">
                <label htmlFor="prompt" className="text-sm font-medium text-slate-700 block">
                  Prompt
                </label>
                <div className="relative">
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="A futuristic city with flying cars at sunset, cyberpunk style, high detail..."
                    disabled={loadingState === 'generating'}
                    className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all resize-none text-slate-900 placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium">
                    {prompt.length} chars
                  </div>
                </div>
              </div>

              {/* Aspect Ratio */}
              <AspectRatioSelector 
                value={aspectRatio} 
                onChange={setAspectRatio} 
                disabled={loadingState === 'generating'}
              />

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loadingState === 'generating' || !prompt.trim()}
                className={`
                  w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95
                  ${loadingState === 'generating' || !prompt.trim() 
                    ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/25'}
                `}
              >
                {loadingState === 'generating' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Image
                  </>
                )}
              </button>
            </div>
            
            <div className="text-xs text-center text-slate-400">
                Powered by Google Gemini 2.5 Flash Image Model
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
                <ImageDisplay 
                    imageSrc={generatedImage} 
                    loading={loadingState === 'generating'} 
                />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;