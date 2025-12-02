import React from 'react';
import { AspectRatio } from '../types';
import { Square, Monitor, Smartphone, RectangleHorizontal } from 'lucide-react';

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
  disabled?: boolean;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ value, onChange, disabled }) => {
  
  const options = [
    { val: AspectRatio.SQUARE, label: '1:1 Square', icon: Square },
    { val: AspectRatio.LANDSCAPE, label: '16:9 Landscape', icon: Monitor },
    { val: AspectRatio.PORTRAIT, label: '9:16 Portrait', icon: Smartphone },
    { val: AspectRatio.WIDE, label: '2:1 Wide', icon: RectangleHorizontal },
  ];

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Dimensions</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => (
          <button
            key={opt.val}
            onClick={() => onChange(opt.val)}
            disabled={disabled}
            className={`
              flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200
              group
              ${value === opt.val 
                ? 'bg-violet-600/10 border-violet-500/50 text-violet-400 shadow-[0_0_15px_-3px_rgba(139,92,246,0.2)]' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-zinc-300'}
              ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <opt.icon className={`w-5 h-5 ${value === opt.val ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};