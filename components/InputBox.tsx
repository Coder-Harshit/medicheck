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
    nonnegative?: boolean; // New prop to enforce non-negative numbers
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
    nonnegative = true, // Default to false
    ...props
}) => {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let val = event.target.value;

        // If type is number and nonnegative is true, prevent negative values
        if (type === "number" && nonnegative) {
            if (Number(val) < 0) {
            val = "0";
            }
        }

        setInputValue(val);
        onChange({
            ...event,
            target: {
                ...event.target,
                value: val,
            },
        }); // Call the parent's onChange handler
    };

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={id}
                    className={`block text-sm font-medium text-gray-700 ${labelClass}`}
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
            <input
                type={type}
                placeholder={placeholder}
                value={inputValue}
                className={`bg-slate-200 ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                id={id}
                autoComplete={autoComplete}
                name={name}
                onChange={handleChange}
                disabled={disabled}
                {...(type === "number" && nonnegative ? { min: "0" } : {})}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default InputBox;
