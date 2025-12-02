import React from 'react';
import { Download, ExternalLink, RefreshCw } from 'lucide-react';

interface ImageDisplayProps {
  imageSrc: string | null;
  loading: boolean;
  onRetry?: () => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageSrc, loading, onRetry }) => {
  if (loading) {
    return (
      <div className="w-full h-full min-h-[400px] rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-blue-500/10 animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-2 border-blue-500 animate-spin animation-delay-200"></div>
            <div className="absolute inset-4 rounded-full border-b-2 border-pink-500 animate-spin animation-delay-500"></div>
          </div>
          <p className="mt-6 text-sm text-zinc-300 font-medium tracking-wide animate-pulse">
            Constructing pixels...
          </p>
          <p className="text-xs text-zinc-500 mt-2">This usually takes about 3-5 seconds</p>
        </div>
      </div>
    );
  }

  if (!imageSrc) {
    return (
      <div className="w-full h-full min-h-[400px] rounded-2xl bg-zinc-900 border border-dashed border-zinc-800 flex flex-col items-center justify-center p-8 group transition-all hover:border-zinc-700">
        <div className="bg-zinc-800 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-zinc-700">
          <svg className="w-8 h-8 text-zinc-600 group-hover:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-zinc-400 font-medium">Ready to create</p>
        <p className="text-zinc-600 text-sm text-center max-w-xs mt-2 leading-relaxed">
          Configure your settings on the left and hit generate to see the magic happen.
        </p>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `lumina-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-in fade-in zoom-in duration-500">
      <div className="group relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 bg-zinc-950 border border-zinc-800">
         {/* Main Image */}
        <img 
          src={imageSrc} 
          alt="Generated AI Art" 
          className="w-full h-auto object-contain max-h-[700px] mx-auto"
        />
        
        {/* Overlay Actions */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button 
                onClick={() => window.open(imageSrc, '_blank')}
                className="p-2.5 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white rounded-lg border border-white/10 transition-all"
                title="Open in new tab"
            >
                <ExternalLink className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div className="flex gap-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Generated successfully
            </span>
        </div>
        <div className="flex gap-3">
          {onRetry && (
            <button 
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-transparent text-zinc-400 border border-zinc-700 rounded-lg hover:text-zinc-200 hover:border-zinc-500 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          )}
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all shadow-lg shadow-violet-900/20 font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};