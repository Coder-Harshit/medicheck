// FILE: components/ToggleSwitch.tsx

import React from 'react';

interface ToggleSwitchProps {
  id: string;
  name: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  name,
  checked,
  disabled = false,
  onChange = () => {},
}) => {
  return (
    <label htmlFor={id} className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`w-10 h-6 flex items-center flex-shrink-0 p-1 rounded-full duration-300 ease-in-out ${
          checked ? 'bg-green-400' : 'bg-gray-300'
        }
        ${disabled ? 'disabled cursor-not-allowed' : ''}`}
      >
        <span
          className={`h-4 w-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
            checked ? 'translate-x-4' : ''
          }
          ${disabled ? 'disabled cursor-not-allowed' : ''}`}
        ></span>
      </span>
    </label>
  );
};

export default ToggleSwitch;