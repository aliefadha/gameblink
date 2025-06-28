import type { Ketersediaan } from "@/types/Ketersediaan";
import type { KetersediaanFormData } from "../validations/ketersediaan.schema";
import type { ApiResponse } from "@/types/Api";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export type NewKetersediaanPayload = Omit<KetersediaanFormData, 'nama_cabang' | 'nama_unit'>;
export type UpdateKetersediaanPayload = {
    tanggal_selesai_blokir?: string;
    jam_selesai_blokir?: string;
    status_perbaikan: 'Selesai' | 'Pending';
};

export const getKetersediaans = async (): Promise<Ketersediaan[]> => {
    const fullUrl = `${API_BASE_URL}/ketersediaan`;

    const response = await fetch(fullUrl);

    const result: ApiResponse<Ketersediaan[]> = await response.json()

    return result.data;
};


export const createKetersediaan = async (payload: NewKetersediaanPayload) => {
    const fullUrl = `${API_BASE_URL}/ketersediaan`;

    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

export const deleteKetersediaan = async (id: string): Promise<void> => {
    const fullUrl = `${API_BASE_URL}/ketersediaan/${id}`;

    const response = await fetch(fullUrl, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus ketersediaan');
    }

    return response.json();
};

export const updateKetersediaan = async (id: string, payload: UpdateKetersediaanPayload) => {
    const fullUrl = `${API_BASE_URL}/ketersediaan/${id}`;

    const response = await fetch(fullUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengupdate ketersediaan');
    }

    return response.json();
};