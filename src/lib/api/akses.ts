import type { ApiResponse } from "@/types/Api";
import type { User } from "@/types/User";
import { getToken } from "./auth";
import type { UserFormData, EditUserFormData } from "../validations/user.schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUsers = async (): Promise<User[]> => {
    const fullUrl = `${API_BASE_URL}/user`;
    const token = getToken();


    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            console.error('Authentication error: Invalid or expired token.');
        }
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const result: ApiResponse<User[]> = await response.json();

    return result.data;
}

export const editUser = async (id: string, userData: EditUserFormData): Promise<User> => {
    const fullUrl = `${API_BASE_URL}/user/${id}`;
    const token = getToken();

    const response = await fetch(fullUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengedit user');
    }

    const result: ApiResponse<User> = await response.json();
    return result.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    const fullUrl = `${API_BASE_URL}/user/${id}`;
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            console.error('Authentication error: Invalid or expired token.');
        }
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }
}

export const createUser = async (userData: UserFormData): Promise<User> => {
    const fullUrl = `${API_BASE_URL}/user`;

    const token = getToken();



    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat user baru');
    }

    const result: ApiResponse<User> = await response.json();
    return result.data;
};

