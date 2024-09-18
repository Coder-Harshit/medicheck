import React from 'react';
import { login, signup } from './actions';
import InputBox from '../components/InputBox';

const LogInPage = () => {


    return (

        <div className="p-4 m-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h1 className="text-4xl font-bold mb-4 text-blue-600 text-center">Log In & SignUp</h1>
            <form>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-black">Email-ID</label>
                    <InputBox
                        placeholder="Enter Your EmailID"
                        id="email"
                        name="email"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-black ">Password</label>
                    <InputBox
                        type="password"
                        placeholder="Enter Your Password"
                        id="password"
                        name="password"
                    />
                </div>
                <div className='flex flex-row gap-10 justify-center'>
                    <button
                        type="submit"
                        formAction={login}
                        className=" w-1/2 mx-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Log In
                    </button>
                    <button
                        type="submit"
                        formAction={signup}
                        className=" w-1/2 mx-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        SignUp
                    </button>
                </div>

            </form>
        </div>
    );
};

export default LogInPage;
