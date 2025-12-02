import React from 'react';
import { AspectRatio } from '../types';
import { Square, Monitor, Smartphone, Layout, Tablet } from 'lucide-react';

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
  disabled?: boolean;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ value, onChange, disabled }) => {
  
  const options = [
    { val: AspectRatio.SQUARE, label: 'Square (1:1)', icon: Square },
    { val: AspectRatio.LANDSCAPE, label: 'Landscape (16:9)', icon: Monitor },
    { val: AspectRatio.PORTRAIT, label: 'Portrait (9:16)', icon: Smartphone },
    { val: AspectRatio.STANDARD_LANDSCAPE, label: 'Standard (4:3)', icon: Layout },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">Aspect Ratio</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map((opt) => (
          <button
            key={opt.val}
            onClick={() => onChange(opt.val)}
            disabled={disabled}
            className={`
              flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200
              ${value === opt.val 
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <opt.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};