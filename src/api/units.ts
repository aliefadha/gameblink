import type { Unit } from "@/types/Unit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUnits = async (): Promise<Unit[]> => {
    const fullUrl = `${API_BASE_URL}/units`;

    // Add this log to see the exact URL you are requesting
    console.log('Fetching from URL:', fullUrl);

    const response = await fetch(fullUrl);

    // The error happens on the next line if the response is HTML
    return response.json();
};