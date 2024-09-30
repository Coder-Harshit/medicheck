import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <>
      <Link href={'/ssiForm'} className='bg-green-300 text-black h-full w-full m-4 p-4 text-4xl'>Click to go to Form</Link>
    </>
  );
}
