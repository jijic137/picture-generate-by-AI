import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Lumina Studio</h1>
        </div>
        <nav className="hidden sm:flex items-center gap-6">
          <span className="text-sm font-medium text-slate-500">v1.0.0</span>
          <a 
            href="#" 
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Documentation
          </a>
        </nav>
      </div>
    </header>
  );
};