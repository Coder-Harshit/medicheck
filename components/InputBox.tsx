'use client';

import React, { useState, useEffect } from 'react';

interface InputBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  error?: string;
  labelClass?: string;
  nonnegative?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  className = '',
  id,
  name,
  autoComplete = 'on',
  labelClass = '',
  disabled = false,
  error,
  nonnegative = false,
  onChange,
  required,
  min,
  max,
  pattern,
  ...props
}) => {
  // Controlled input state with explicit type
  const [inputValue, setInputValue] = useState<string>(value.toString());

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    // Handle number type validation
    if (type === 'number') {
      const numValue = parseFloat(newValue);
      
      // Return if invalid number
      if (newValue !== '' && isNaN(numValue)) {
        return;
      }

      // Handle nonnegative constraint
      if (nonnegative && numValue < 0) {
        const minValue = '0';
        setInputValue(minValue);
        onChange?.({
          ...event,
          target: {
            ...event.target,
            value: minValue
          }
        });
        return;
      }

    //   // Handle min/max constraints
    //   if (min !== undefined && numValue < parseFloat(min)) {
    //     setInputValue(min);
    //     onChange?.({
    //       ...event,
    //       target: {
    //         ...event.target,
    //         value: min
    //       }
    //     });
    //     return;
    //   }

    //   if (max !== undefined && numValue > parseFloat(max)) {
    //     setInputValue(max);
    //     onChange?.({
    //       ...event,
    //       target: {
    //         ...event.target,
    //         value: max
    //       }
    //     });
    //     return;
    //   }
    }

    // Update local state
    setInputValue(newValue);
    
    // Call parent onChange
    onChange?.(event);
  };

  // Generate unique ID if not provided
  const inputId = id || `input-${name}-${Math.random().toString(36).substr(2, 9)}`;

  // Build input className
  const inputClassName = `
    block
    w-full
    px-3
    py-2
    bg-slate-200
    rounded-md
    shadow-sm
    focus:outline-none
    focus:ring-2
    focus:ring-primary-500
    focus:border-primary-500
    disabled:bg-slate-100
    disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className={`
            block 
            text-sm 
            font-medium 
            text-gray-700
            max-w-[250px]
            truncate
            ${labelClass}
          `.trim()}
          title={label}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        type={type}
        name={name}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClassName}
        autoComplete={autoComplete}
        disabled={disabled}
        required={required}
        min={type === 'number' ? (nonnegative ? '0' : min) : undefined}
        max={type === 'number' ? max : undefined}
        pattern={pattern}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />

      {error && (
        <p 
          id={`${inputId}-error`}
          className="text-sm text-red-600 mt-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default InputBox;