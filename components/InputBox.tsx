"use client";
import React, { useState } from 'react';

interface InputBoxProps {
    label?: string; // Option to display a label
    type?: string;
    placeholder?: string;
    value?: string | number;
    className?: string;
    autoComplete?: string;
    labelClass?: string;
    id: string;
    disabled?: boolean
    name: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

export const InputBox: React.FC<InputBoxProps> = ({
    label = "",
    disabled = false,
    type = "text",
    placeholder = "",
    value = "",
    className = "",
    id,
    name,
    autoComplete = "on",
    labelClass = "",
    onChange = () => {}, // Provide a default no-op function
    error = "",
    ...props
}) => {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        onChange(event); // Call the parent's onChange handler (or default to no-op)
    };

    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={id} className={`block text-sm font-medium text-gray-700 ${labelClass}`}>
                    {label}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={inputValue}
                className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                id={id}
                autoComplete={autoComplete}
                name={name}
                onChange={handleChange}
                disabled={disabled}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default InputBox;
