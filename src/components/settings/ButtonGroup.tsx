import React from 'react';

interface ButtonGroupProps {
  title: string;
  options: string[];
  selected: string;
  onChange: (option: string) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ title, options, selected, onChange }) => (
  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
    <div className="font-medium mb-3">{title}</div>
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`py-2 rounded-lg text-sm font-medium transition-all ${
            selected === option
              ? 'bg-gradient-to-r from-pink-500 to-purple-600'
              : 'bg-slate-700/50 hover:bg-slate-700'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

export default ButtonGroup;