import type { SingleApiResponse } from "@/types/Api";
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

    const result: SingleApiResponse<Cabang> = await response.json();

    return result.data;
};

export const getCabangs = async (): Promise<Cabang[]> => {
    const fullUrl = `${API_BASE_URL}/cabang`;

    const response = await fetch(fullUrl);

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const result: SingleApiResponse<Cabang[]> = await response.json();

    return result.data;
};

export const getCabangById = async (id: string): Promise<Cabang[]> => {
    const fullUrl = `${API_BASE_URL}/cabang/${id}`;

    const response = await fetch(fullUrl);

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const result: SingleApiResponse<Cabang[]> = await response.json();

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
        throw new Error('Gagal memperbarui data cabang');
    }

    const result: SingleApiResponse<Cabang> = await response.json();
    return result.data;
};

export const deleteCabang = async (id: string): Promise<void> => {
    const fullUrl = `${API_BASE_URL}/cabang/${id}`;
    await fetch(fullUrl, {
        method: 'DELETE',
    });
};