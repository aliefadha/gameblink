import type { Cabang } from "@/types/Cabang";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCabangs = async (): Promise<Cabang[]> => {
    const fullUrl = `${API_BASE_URL}/cabangs`;

    // Add this log to see the exact URL you are requesting
    console.log('Fetching from URL:', fullUrl);

    const response = await fetch(fullUrl);

    // The error happens on the next line if the response is HTML
    return response.json();
};