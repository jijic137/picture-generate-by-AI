import React from 'react';
import { ImageStyle } from '../types';
import { Palette, Camera, Film, Brush, Box, MonitorPlay, Zap, X } from 'lucide-react';

interface StyleSelectorProps {
  value: ImageStyle;
  onChange: (value: ImageStyle) => void;
  disabled?: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ value, onChange, disabled }) => {
  
  const styles = [
    { val: ImageStyle.NONE, label: 'No Style', icon: X },
    { val: ImageStyle.PHOTOREALISTIC, label: 'Realistic', icon: Camera },
    { val: ImageStyle.CINEMATIC, label: 'Cinematic', icon: Film },
    { val: ImageStyle.ANIME, label: 'Anime', icon: MonitorPlay },
    { val: ImageStyle.CYBERPUNK, label: 'Cyberpunk', icon: Zap },
    { val: ImageStyle.d3_RENDER, label: '3D Render', icon: Box },
    { val: ImageStyle.OIL_PAINTING, label: 'Painting', icon: Brush },
    { val: ImageStyle.MINIMALIST, label: 'Minimal', icon: Palette },
  ];

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Art Style</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {styles.map((style) => (
          <button
            key={style.val}
            onClick={() => onChange(style.val)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all duration-200
              ${value === style.val 
                ? 'bg-zinc-800 border-violet-500 text-violet-300' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800'}
              ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <style.icon className={`w-3.5 h-3.5 ${value === style.val ? 'text-violet-400' : 'text-zinc-600'}`} />
            <span className="text-xs font-medium truncate">{style.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};