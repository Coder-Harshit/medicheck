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
    console.log("ERROR Encountered: ", error.message);
    {
      console.log("Auth Error");
      redirect('/error');
    }

  } else {
    redirect('/')
  }
}
