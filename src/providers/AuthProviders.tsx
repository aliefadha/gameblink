import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type AuthContextType } from '@/contexts/auth';
import { login as apiLogin } from '@/lib/api/auth';
import type { User } from '@/types/User';

export function AuthProvider({ children }: { children: ReactNode }) {
    // ✅ The state now holds a User object or null
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This function now runs on initial app load
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                // ✅ Parse the user object from the string stored in localStorage
                const parsedUser: User = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                // If parsing fails, clear out the bad data
                localStorage.clear();
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        // ✅ Your API now returns both the token and the user object
        const { access_token, user } = await apiLogin(credentials);

        localStorage.setItem('access_token', access_token);
        // ✅ Store the entire user object as a JSON string
        localStorage.setItem('user', JSON.stringify(user));

        // ✅ Set the full user object in our state
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        // ✅ Make sure to remove the user object on logout too
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
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