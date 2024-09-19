'use server';

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  // { console.log("Data: ", data); }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // console.log("ERROR Encountered: ", error.message);
    // if (error.status == 400) {
    {
      console.log("Auth Error");
      redirect('/error');
    }
    // <Link href={'./error'}>console.error();
    // </Link>
    // }
  } else {
    // await fetch('/', { method: 'GET' })
    redirect('/')
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  // { console.log("Data: ", data); }
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log("ERROR Encountered: ", error);
    redirect('/error')
  } else {
    redirect('/')
  }
}
