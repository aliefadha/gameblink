import type { ApiResponse } from "@/types/Api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type Dashboard = {
    countBookingToday: number;
    available: number;
    revenueToday: number;
    bestCabang: string;
}

export type ChartData = {
    date: string;
    countBooking: number;
}

export const getDashboard = async (): Promise<Dashboard> => {
    const fullUrl = `${API_BASE_URL}/dashboard`;

    const response = await fetch(fullUrl, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const result: ApiResponse<Dashboard> = await response.json();

    return result.data;
}

export const getChartData = async (cabangId: string, startDate: string, endDate: string): Promise<ChartData[]> => {
    const fullUrl = `${API_BASE_URL}/dashboard/stats-booking?cabang_id=${cabangId}&startDate=${startDate}&endDate=${endDate}`;

    const response = await fetch(fullUrl, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const result: ApiResponse<ChartData[]> = await response.json();

    return result.data;
}