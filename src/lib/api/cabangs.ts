import type { ApiResponse } from "@/types/Api";
import type { Cabang } from "@/types/Cabang";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createCabang = async (formData: FormData): Promise<Cabang> => {
    const fullUrl = `${API_BASE_URL}/cabang`;

    const response = await fetch(fullUrl, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat cabang baru');
    }

    return response.json();
};

export const getCabangs = async (): Promise<Cabang[]> => {
    // This is your environment variable for the API base URL
    const fullUrl = `${API_BASE_URL}/cabang`;
    console.log('Fetching from URL:', fullUrl);

    const response = await fetch(fullUrl);

    // 1. Add error handling for network issues (e.g., 404, 500 errors)
    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    // 2. Await the .json() call and apply your generic type here
    //    TypeScript now knows `result` must have statusCode, message, and data properties.
    const result: ApiResponse<Cabang[]> = await response.json();

    // 3. Now you can safely access result.data, and TypeScript knows it's a Cabang[]
    return result.data;
};

export const getCabangById = async (id: string): Promise<Cabang[]> => {
    // This is your environment variable for the API base URL
    const fullUrl = `${API_BASE_URL}/cabang/${id}`;
    console.log('Fetching from URL:', fullUrl);

    const response = await fetch(fullUrl);

    // 1. Add error handling for network issues (e.g., 404, 500 errors)
    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    // 2. Await the .json() call and apply your generic type here
    //    TypeScript now knows `result` must have statusCode, message, and data properties.
    const result: ApiResponse<Cabang[]> = await response.json();

    // 3. Now you can safely access result.data, and TypeScript knows it's a Cabang[]
    return result.data;
};




export const updateCabang = async (formData: FormData): Promise<Cabang> => {
    const id = formData.get('id');

    if (!id) {
        throw new Error('ID Cabang tidak ditemukan di dalam form data.');
    }

    const response = await fetch(`${API_BASE_URL}/cabang/${id}`, {
        method: 'PATCH',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui data cabang');
    }


    const result: ApiResponse<Cabang[]> = await response.json();
    // 3. Now you can safely access result.data, and TypeScript knows it's a Cabang[]
    return result.data;
};

export const deleteCabang = async (id: string): Promise<void> => {
    const fullUrl = `${API_BASE_URL}/cabang/${id}`;
    await fetch(fullUrl, {
        method: 'DELETE',
    });
};