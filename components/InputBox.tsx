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
}

const InputBox: React.FC<InputBoxProps> = ({
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
}) => {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        onChange(event); // Call the parent's onChange handler (or default to no-op)
    };

    return (
        <div className={`flex flex-col space-y-1 ${className}`}>
            {/* Optional label display */}
            {label && <label htmlFor={id} className={`text-white ${labelClass}`}>{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                value={inputValue}
                className={`bg-slate-100 text-black p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 ${className}`}
                id={id}
                autoComplete={autoComplete}
                name={name}
                onChange={handleChange}
                disabled={disabled}
            />
        </div>
    );
};

export default InputBox;
