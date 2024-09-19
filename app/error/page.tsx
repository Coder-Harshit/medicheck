import React from 'react';

const ErrorPage = () => {
    return (
        <div className='grid place-content-center '>
            <div className="rounded-lg w-[550px] h-24  bg-[#cf0011] text-[#ffffff]">
                <div className="flex flex-row w-full gap-5 justify-center items-center px-5 h-full">
                    <div className="my-auto text-2xl">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x-circle"> */}
                            {/* <circle cx="12" cy="12" r="10"></circle> */}
                            {/* <path d="m15 9-6 6"></path> */}
                            {/* <path d="m9 9 6 6"></path> */}
                        {/* </svg> */}
                    </div>
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
