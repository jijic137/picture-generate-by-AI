import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="bg-violet-600/20 p-2.5 rounded-xl border border-violet-500/20">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
              Lumina <span className="text-violet-500">Studio</span>
            </h1>
            <p className="text-xs text-zinc-500 font-medium tracking-wide">AI GENERATION ENGINE</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800">
            <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium text-zinc-400">Powered by SDXL 1.0</span>
          </div>
        </div>
      </div>
    </header>
  );
};