import React from 'react';
import { Download, Share2, ZoomIn } from 'lucide-react';

interface ImageDisplayProps {
  imageSrc: string | null;
  loading: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageSrc, loading }) => {
  if (loading) {
    return (
      <div className="w-full aspect-square sm:aspect-video rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-slate-200 mb-4"></div>
        <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-48 bg-slate-200 rounded"></div>
        <p className="mt-6 text-sm text-slate-400 font-medium">Dreaming up your visual...</p>
      </div>
    );
  }

  if (!imageSrc) {
    return (
      <div className="w-full aspect-square sm:aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <p className="text-slate-500 font-medium">No image generated yet</p>
        <p className="text-slate-400 text-sm text-center max-w-xs mt-1">
          Enter a prompt and configure your settings to start creating using AI.
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
      <div className="group relative w-full rounded-2xl overflow-hidden shadow-lg bg-slate-900">
         {/* Main Image */}
        <img 
          src={imageSrc} 
          alt="Generated AI Art" 
          className="w-full h-auto object-contain max-h-[600px] mx-auto"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
            <button 
                onClick={() => window.open(imageSrc, '_blank')}
                className="p-3 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-slate-900 rounded-full transition-all transform hover:scale-105"
                title="View Full Size"
            >
                <ZoomIn className="w-6 h-6" />
            </button>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm font-medium text-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
};