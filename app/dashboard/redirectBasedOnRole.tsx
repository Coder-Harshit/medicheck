// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/utils/supabase/client';
// import { useUser } from '@/hooks/useUser';


// const RedirectBasedOnRole = () => {
//     const router = useRouter();
//     const { userRole, loading } = useUser();
//     useEffect(() => {
//         const checkUser = async () => {
//             const { data: { user } } = await supabase.auth.getUser();

//             if (user) {
//                 if (userRole) {
//                     switch (userRole.role) {
//                         case 'doctor':
//                             router.push('/dashboard/doctor');
//                             break;
//                         case 'nurse':
//                             router.push('/dashboard/nurse');
//                             break;

//                         default:
//                             router.push('/dashboard'); // Default case: redirect to generic dashboard
//                     }
//                 } else {
//                     router.push('/login'); // If no role is found, redirect to login
//                 }
//             } else {
//                 router.push('/login'); // If user is not logged in, redirect to login
//             }
//         };

//         checkUser();
//     }, [router, userRole]);

//     return null; // Prevent rendering while navigation happens
// };

// export default RedirectBasedOnRole;
