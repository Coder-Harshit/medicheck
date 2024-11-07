// Corrected and Enhanced DropdownBox Component

import React from 'react';

interface DropdownBoxProps {
  label?: string;           // Optional label for the dropdown
  value?: string;           // Initial selected value
  options: Array<{         // Array of objects for dropdown options
    value: string;           // Value of the option (used for selection)
    label: string;           // Text displayed for the option
  }>;
  labelClass?: string;      // Optional CSS class(es) for label styling
  className?: string;       // Optional CSS class(es) for styling
  id: string;                // Unique identifier for the dropdown
  name: string;              // Name for the form element
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Function for handling value changes
  isDisabled?: boolean;     // Optional flag to disable the dropdown
}

const DropdownBox: React.FC<DropdownBoxProps> = ({
  label = "",
  labelClass = "",
  value = "",
  options,
  className = "",
  id,
  name,
  onChange = () => {},
  isDisabled = false,
}) => {
  // No need for internal state as it's a controlled component
  // Use the provided value prop for selection

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event); // Call the parent's onChange handler directly
  };

  return (
    <div className="space-y-1">
            {label && (
                <label
                    htmlFor={id}
                    className={`block text-sm font-medium text-gray-700 truncate ${labelClass}`}
                    style={{
                        width: '150px', // Fixed width
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    title={label} // Tooltip with full label text
                >
                    {label}
                </label>
            )}
      <select
        id={id}
        className={`bg-slate-200 ${isDisabled ? 'disabled cursor-not-allowed' : ''} h-10 ${className}`}
        disabled={isDisabled} // Set disabled state based on the prop
        value={value}          // Set selected value from the prop
        name={name}
        onChange={handleChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default DropdownBox;
