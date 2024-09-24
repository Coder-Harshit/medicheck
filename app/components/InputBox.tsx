"use client";
import React, { useState } from 'react';

interface InputBoxProps {
    label?: string; // Option to display a label
    type?: string;
    placeholder?: string;
    value?: string;
    className?: string;
    autoComplete?: string;
    id: string;
    name: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({
    label = "",
    type = "text",
    placeholder = "",
    value = "",
    className = "",
    id,
    name,
    autoComplete = "on",
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
            {label && <label htmlFor={id} className="text-white">{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                value={inputValue}
                className={`bg-gray-300 text-black p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 ${className}`}
                id={id}
                autoComplete={autoComplete}
                name={name}
                onChange={handleChange}
            />
        </div>
    );
};

export default InputBox;
