// Enhanced DropdownBox Component
import React from 'react';

interface DropdownBoxProps {
  label?: string;
  value?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  labelClass?: string;
  className?: string;
  id: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isDisabled?: boolean;
  required?: boolean;
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
  required = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Only trigger onChange if a non-default option is selected
    if (event.target.value !== "") {
      onChange(event);
    }
  };

  // Add default option at the beginning
  const allOptions = [
    { value: "", label: "-- Select --" },
    ...options
  ];

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium text-gray-700 truncate ${labelClass}`}
          style={{
            width: '250px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={label}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        className={`
          block w-full px-3 py-2 bg-slate-200 
          rounded-md shadow-sm focus:outline-none focus:ring-2 
          focus:ring-primary-500 focus:border-primary-500
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${value === "" ? 'text-gray-500' : 'text-gray-900'}
          ${className}
        `}
        disabled={isDisabled}
        value={value}
        name={name}
        onChange={handleChange}
        required={required}
      >
        {allOptions.map((option, index) => (
          <option 
            key={index} 
            value={option.value}
            disabled={option.value === ""}
            className={option.value === "" ? 'text-gray-500' : 'text-gray-900'}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownBox;
