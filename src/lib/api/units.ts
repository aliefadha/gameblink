import type { Unit } from "@/types/Unit";
import type { UnitFormData } from "../validations/unit.schema";
import type { SingleApiResponse } from "@/types/Api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUnits = async (): Promise<Unit[]> => {
    const fullUrl = `${API_BASE_URL}/unit`;

    const response = await fetch(fullUrl);

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const result: SingleApiResponse<Unit[]> = await response.json();

    return result.data;
};

export const getUnitsByCabang = async (id: string): Promise<Unit[]> => {
    const fullUrl = `${API_BASE_URL}/unit/cabang/${id}`;


    const response = await fetch(fullUrl);

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const result: SingleApiResponse<Unit[]> = await response.json();

    return result.data;
};

export const createUnit = async (unitData: UnitFormData): Promise<Unit> => {
    const fullUrl = `${API_BASE_URL}/unit`;

    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(unitData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat unit baru');
    }

    const result: SingleApiResponse<Unit> = await response.json();
    return result.data;
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

    return response.json();
};

export const getUnitByCabang = async (id: string): Promise<Unit[]> => {
    const fullUrl = `${API_BASE_URL}/unit/cabang/${id}`;


    const response = await fetch(fullUrl);

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const result: SingleApiResponse<Unit[]> = await response.json();

    return result.data;
};
