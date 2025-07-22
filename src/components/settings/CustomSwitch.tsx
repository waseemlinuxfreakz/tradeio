import React from 'react';

interface CustomSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ 
  checked, 
  onCheckedChange,
  disabled = false 
}) => {
  return (
    <button
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${
        checked ? 'bg-pink-500' : 'bg-slate-700'
      }`}
      disabled={disabled}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform`}
      />
    </button>
  );
};

export default CustomSwitch;