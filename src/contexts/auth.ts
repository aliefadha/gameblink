import type { User } from '@/types/User';
import { createContext } from 'react';

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);