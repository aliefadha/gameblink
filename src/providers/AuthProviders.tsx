import { useState, useEffect, type ReactNode } from 'react';

import { AuthContext, type AuthContextType } from '@/contexts/auth';
import { login as apiLogin, logout as apiLogout, getProfile } from '@/lib/api/auth';
import type { User } from '@/types/User';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            getProfile(token)
                .then((profile: User) => setUser(profile))
                .catch(() => {
                    setUser(null);
                    localStorage.removeItem('access_token');
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        const { access_token } = await apiLogin(credentials);
        localStorage.setItem('access_token', access_token);
        const profile: User = await getProfile(access_token);
        setUser(profile);

        // Redirect based on role
        if (profile.role === 'SUPERADMIN') {
            navigate('/dashboard', { replace: true });
        } else if (profile.role === 'ADMIN') {
            navigate('/dashboard/booking', { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
            toast.success("Logout Sukses.");
        } catch {
            toast.warning("Logout gagal.");
        } finally {
            localStorage.removeItem('access_token');
            setUser(null);
            navigate('/login', { replace: true });
        }
    };

    const value: AuthContextType = {
        isAuthenticated: !!user,
        user,
        login,
        logout,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}