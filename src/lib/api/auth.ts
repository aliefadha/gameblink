import type { ApiResponse } from "@/types/Api";
import type { User } from "@/types/User";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    const result: ApiResponse<User> = await response.json()

    return result.data;
};

export const getToken = (): string | null => {
    return localStorage.getItem("access_token");
};

export const logout = async (): Promise<void> => {
    const token = localStorage.getItem('access_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server-side logout failed');
    }
};