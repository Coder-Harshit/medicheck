// import { createClient } from '@/utils/supabase/client';
import { supabase } from '@/utils/supabase/client';

const handleLogout = async () => {
    // const supabase = createClient();
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        // Redirect to login page or update UI state
    } catch (error) {
        alert((error as Error).message)
    }
}
