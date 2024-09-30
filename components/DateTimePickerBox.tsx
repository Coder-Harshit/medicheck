import React from 'react';

interface DateTimePickerBoxProps {
  label?: string;
  value?: string;
  className?: string;
  id: string;
  name: string;
  labelClass?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isDisabled?: boolean;
  type: 'date' | 'time' | 'datetime'; // Specify whether it's a date, time, or both
  upperLimitMins?: number; // Optional upper limit in minutes for the time selection
}

const DateTimePickerBox: React.FC<DateTimePickerBoxProps> = ({
  label = "",
  value = "",
  className = "",
  labelClass = "",
  id,
  name,
  onChange = () => {},
  isDisabled = false,
  type,
  upperLimitMins,
}) => {
  const generateTimeOptions = (limitMins: number) => {
    const options = [];
    for (let i = 0; i <= limitMins; i += 1) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60;
      const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      options.push(timeString);
    }
    return options;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(event); // Call the parent's onChange handler directly
  };

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && <label htmlFor={id} className={`text-white ${labelClass}`}>{label}</label>}
      {type === 'datetime' ? (
        <div className="flex space-x-2">
          <input
            type="date"
            id={`${id}-date`}
            className={`${className} bg-gray-300 text-black p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 ${isDisabled ? 'disabled cursor-not-allowed' : ''}`}
            disabled={isDisabled}
            value={value?.split('T')[0] || ''}
            name={`${name}-date`}
            onChange={handleChange}
          />
          <input
            type="time"
            id={`${id}-time`}
            className={`${className} bg-gray-300 text-black p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 ${isDisabled ? 'disabled cursor-not-allowed' : ''}`}
            disabled={isDisabled}
            value={value?.split('T')[1] || ''}
            name={`${name}-time`}
            onChange={handleChange}
          />
        </div>
      ) : type === 'time' && upperLimitMins !== undefined ? (
        <select
          id={id}
          className={`${className} bg-gray-300 text-black p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 ${isDisabled ? 'disabled cursor-not-allowed' : ''}`}
          disabled={isDisabled}
          value={value}
          name={name}
          onChange={handleChange}
        >
          {generateTimeOptions(upperLimitMins).map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          className={`${className} bg-gray-300 text-black p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 ${isDisabled ? 'disabled cursor-not-allowed' : ''}`}
          disabled={isDisabled}
          value={value}
          name={name}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default DateTimePickerBox;
