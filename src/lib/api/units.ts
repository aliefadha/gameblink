import type { Unit } from "@/types/Unit";
import type { UnitFormData } from "../validations/unit.schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUnits = async (): Promise<Unit[]> => {
    const fullUrl = `${API_BASE_URL}/unit`;

    // Add this log to see the exact URL you are requesting
    console.log('Fetching from URL:', fullUrl);

    const response = await fetch(fullUrl);

    // The error happens on the next line if the response is HTML
    return response.json();
};

export const getUnitsByCabang = async (id: string): Promise<Unit[]> => {
    const fullUrl = `${API_BASE_URL}/unit/cabang/${id}`;

    // Add this log to see the exact URL you are requesting
    console.log('Fetching from URL:', fullUrl);

    const response = await fetch(fullUrl);

    // The error happens on the next line if the response is HTML
    return response.json();
};

export const createUnit = async (unitData: UnitFormData): Promise<Unit> => {
    const fullUrl = `${API_BASE_URL}/unit`;

    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            // Set the content type to indicate a JSON payload
            'Content-Type': 'application/json',
        },
        // Convert the JavaScript object to a JSON string
        body: JSON.stringify(unitData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat unit baru');
    }

    return response.json();
};

export const deleteUnit = async (id: string): Promise<void> => {
    const fullUrl = `${API_BASE_URL}/unit/${id}`;

    const response = await fetch(fullUrl, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus unit');
    }
};