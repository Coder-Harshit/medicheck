"use client";
import React, { useState } from 'react';

interface Props {
    type?: string;
    placeholder?: string;
    value?: string;
    className?: string;
    id: string;
    name: string;
    // onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBox = ({ type = "text", placeholder = "Enter Your Input Here", value = "", className = "", id, name}: Props) => {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        // onChange(event);
    };

    return (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                value={inputValue}
                className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 text-slate-900 ${className}`}
                id={id}
                name={name}
                onChange={handleChange}
            />
        </div>
    );
};

export default InputBox;
