import { useState, useEffect, type ReactNode } from 'react';

import { AuthContext, type AuthContextType } from '@/contexts/auth';
import { login as apiLogin } from '@/lib/api/auth';
import type { User } from '@/types/User';
import { useNavigate } from 'react-router';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                localStorage.clear();
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        const { access_token, user } = await apiLogin(credentials);
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        navigate('/dashboard', { replace: true });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login', { replace: true });
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