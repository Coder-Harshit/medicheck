import React from 'react';

interface DatePickerBoxProps {
  label?: string; // Option to display a label
  value?: string;
  className?: string; // Optional CSS class(es) for styling
  id: string; // Unique identifier for the date picker
  labelClass?: string; // Optional CSS class(es) for styling the label
  name: string; // Name for the form element
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Function for handling value changes
  isDisabled?: boolean; // Optional flag to disable the date picker
}

const DatePickerBox: React.FC<DatePickerBoxProps> = ({
  label = "",
  labelClass = "",
  value = "",
  className = "",
  id,
  name,
  onChange = () => {},
  isDisabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event); // Call the parent's onChange handler directly
  };

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>  {/* Apply optional class(es) */}
      {label && <label htmlFor={id} className={`text-white ${labelClass}`}>{label}</label>}
      <input
        type="date"
        id={id}
        className={`bg-gray-300 text-black p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 ${isDisabled ? 'disabled cursor-not-allowed' : ''}
        ${className}`}
        disabled={isDisabled} // Set disabled state based on the prop
        value={value}          // Set selected value from the prop
        name={name}
        onChange={handleChange}
      />
    </div>
  );
};

export default DatePickerBox;
