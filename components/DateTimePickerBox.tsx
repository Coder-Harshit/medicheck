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
  required?: boolean;
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
  required=false,
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
    <div className={``}>
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
          {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )}
      {type === 'datetime' ? (
        // <div className="flex space-x-2">
        <div className="space-y-1">
          <input
            type="date"
            id={`${id}-date`}
            className={`${className} bg-slate-200 ${isDisabled ? 'disabled cursor-not-allowed' : ''}`}
            disabled={isDisabled}
            value={value?.split('T')[0] || ''}
            name={`${name}-date`}
            onChange={handleChange}
            required={required}
          />
          <input
            type="time"
            id={`${id}-time`}
            className={`${className} bg-slate-200 ${isDisabled ? 'disabled cursor-not-allowed' : ''}`}
            disabled={isDisabled}
            value={value?.split('T')[1] || ''}
            name={`${name}-time`}
            onChange={handleChange}
            required={required}
          />
        </div>
      ) : type === 'time' && upperLimitMins !== undefined ? (
        <select
          id={id}
          className={`${className} bg-slate-200 h-10 ${isDisabled ? 'disabled cursor-not-allowed' : ''}`}
          disabled={isDisabled}
          value={value}
          name={name}
          required={required}
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
          className={`${className} bg-slate-200 ${isDisabled ? 'disabled cursor-not-allowed' : ''}`}
          disabled={isDisabled}
          value={value}
          name={name}
          required={required}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default DateTimePickerBox;
