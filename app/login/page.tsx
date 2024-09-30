'use client';

import { useState } from 'react'
// import { createClient } from '@/utils/supabase/client'
import { supabase } from '@/utils/supabase/client'
import InputBox from '../../components/InputBox'
import { redirect } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const supabase = createClient();
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            // Redirect or update UI state here
        } catch (error) {
            alert((error as Error).message)
        }
    }

    return (
        // <form onSubmit={handleLogin} className="space-y-4">
        //     <input
        //         type="email"
        //         placeholder="Email"
        //         value={email}
        //         onChange={(e) => setEmail(e.target.value)}
        //         className="w-full p-2 border rounded"
        //     />
        //     <input
        //         type="password"
        //         placeholder="Password"
        //         value={password}
        //         onChange={(e) => setPassword(e.target.value)}
        //         className="w-full p-2 border rounded"
        //     />
        //     <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        //         Log In
        //     </button>
        // </form>
        <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
            <div className="flex flex-row gap-3 pb-4">
                {
                    /* <div>
                        <img src="/favicon.svg" width="56" alt="Logo" />
                    </div> */
                }
                <h1 className="text-4xl font-bold text-[#4B5563] my-auto">Jaypee Hospital</h1>

            </div>
            <form className="flex flex-col" onSubmit={handleLogin}>
                <div className="pb-2">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#111827]">Email</label>
                    <div className="relative text-gray-400">
                        <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                        </span>
                        <InputBox
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            id="email"
                            className='w-full text-right'
                            autoComplete="on"
                        />
                    </div>
                </div>
                <div className="pb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#111827]">Password</label>
                    <div className="relative text-gray-400">
                        <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-asterisk">
                                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                                <path d="M12 8v8"></path>
                                <path d="m8.5 14 7-4"></path>
                                <path d="m8.5 10 7 4"></path>
                            </svg>
                        </span>
                        <InputBox
                            type="password"
                            placeholder="••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            className="w-full text-right"
                            id="password"
                            autoComplete="new-password"
                        />
                    </div>
                </div>
                <button type="submit" className="w-full text-[#FFFFFF] bg-indigo-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6">Login</button>
            </form>
        </div>

    )
}
