import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSliderProps {
  title: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  title,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '%'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-sm text-slate-400">
          {value}{unit === 'ratio' ? ':1' : unit}
        </span>
      </div>
      <div 
        className="relative w-full h-12 flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Track Background */}
        <div className="absolute w-full h-1 bg-slate-700 rounded"></div>
        
        {/* Active Track */}
        <div 
          className="absolute h-1 bg-gradient-to-r from-green-500 to-green-500 rounded"
          style={{ width: `${percentage}%` }}
        ></div>
        
        {/* Selection Indicator */}
        <div 
          className="absolute -mt-4 transition-all duration-150"
          style={{ left: `calc(${percentage}% - 6px)` }}
        >
          <ChevronDown 
            className="w-3 h-3 text-green-500" 
            style={{ transform: 'translateY(2px)' }}
          />
        </div>
        
        {/* Value Tooltip */}
        {isHovered && (
          <div 
            className="absolute -mt-8 bg-slate-900 px-2 py-1 rounded text-xs transform -translate-x-1/2"
            style={{ left: `${percentage}%` }}
          >
            {value}{unit === 'ratio' ? ':1' : unit}
          </div>
        )}
        
        {/* Labels */}
        <div className="absolute w-full flex justify-between text-xs text-slate-400 mt-6">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
        
        {/* Hidden Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default CustomSlider;