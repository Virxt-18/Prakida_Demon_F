import { useAuth } from '../context/AuthContext';

/**
 * Hook to check if the current user is an Admin
 * Centralizes the admin email check logic.
 */
export const useAdmin = () => {
    const { user, loading } = useAuth();

    // In a real app, this should come from a database role or environment variable
    // For now, we centralize the hardcoded email here.
    const ADMIN_EMAILS = [
        'prakrida@bitmesra.ac.in'
    ];

    const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

    return {
        isAdmin: !!isAdmin,
        loading,
        user
    };
};
