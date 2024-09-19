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
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Optional onChange
}

const InputBox: React.FC<InputBoxProps> = ({
    label = "", // Default label is an empty string (optional)
    type = "text",
    placeholder = "Enter Your Input Here",
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
        <div className="mb-4">
            {/* Optional label display */}
            {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                value={inputValue}
                className={`
                    pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4 mt-1 text-sm shadow-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500
                    ${className}`}
                id={id}
                autoComplete={autoComplete}
                name={name}
                onChange={handleChange}
            />
        </div>
    );
};

export default InputBox;
