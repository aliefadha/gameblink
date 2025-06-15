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
    const fullUrl = `${API_BASE_URL}/cabang`;

    console.log('Fetching from URL:', fullUrl);

    const response = await fetch(fullUrl);

    return response.json();
};

export const updateCabang = async (formData: FormData): Promise<Cabang> => {
    const id = formData.get('id');

    if (!id) {
        throw new Error('ID Cabang tidak ditemukan di dalam form data.');
    }

    const response = await fetch(`${API_BASE_URL}/cabang/${id}`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui data cabang');
    }

    return response.json();
};

export const deleteCabang = async (id: string): Promise<void> => {
    const fullUrl = `${API_BASE_URL}/cabang/${id}`;
    await fetch(fullUrl, {
        method: 'DELETE',
    });
};