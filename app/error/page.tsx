import React from 'react';

const ErrorPage = () => {
    return (
        <div className='grid place-content-center '>
            <div className="rounded-lg w-[550px] h-24  bg-[#cf0011] text-[#ffffff]">
                <div className="flex flex-row w-full gap-5 justify-center items-center px-5 h-full">
                    <div className="my-auto text-2xl"></div>
                    <div>
                        <div className="font-bold text-2xl">Something Went Wrong</div>
                        <a href={'/'} className=''>Back to HomePage</a>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ErrorPage;
