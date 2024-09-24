import React from 'react';

interface TimePickerBoxProps {
  label?: string; // Option to display a label
  value?: string;
  className?: string; // Optional CSS class(es) for styling
  id: string; // Unique identifier for the time picker
  name: string; // Name for the form element
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Function for handling value changes
  isDisabled?: boolean; // Optional flag to disable the time picker
  upperLimitMins: number; // Upper limit in minutes for the time selection
}

const TimePickerBox: React.FC<TimePickerBoxProps> = ({
  label = "",
  value = "",
  className = "",
  id,
  name,
  onChange = () => {},
  isDisabled = false,
  upperLimitMins,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = event.target.value;
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes <= upperLimitMins) {
      onChange(event); // Call the parent's onChange handler directly
    } else {
      alert(`Please select a time within ${upperLimitMins} minutes.`);
    }
  };

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>  {/* Apply optional class(es) */}
      {label && <label htmlFor={id} className="text-white">{label}</label>}
      <input
        type="time"
        id={id}
        className={`bg-gray-300 text-black p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 ${isDisabled ? 'disabled cursor-not-allowed' : ''} ${className}`}
        disabled={isDisabled} // Set disabled state based on the prop
        value={value}          // Set selected value from the prop
        name={name}
        onChange={handleChange}
      />
    </div>
  );
};

export default TimePickerBox;
