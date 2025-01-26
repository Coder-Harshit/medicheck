// utils/supabase/middleware.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';

export async function updateSession() {
    const { error } = await supabase.auth.getSession();
    if (error) {
        return NextResponse.redirect('/login');
    }
    return NextResponse.next();
}