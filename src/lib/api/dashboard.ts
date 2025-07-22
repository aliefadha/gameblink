import type { ApiResponse } from "@/types/Api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type Dashboard = {
    countBookingToday: number;
    available: number;
    revenueToday: number;
    bestCabang: string;
}

export type Summary = {
    cabang: string;
    konsolSummary: {
        jenis_konsol: string,
        totalRevenue: number
    }[],
    totalRevenue: number;
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



export const getSummary = async (startDate: string, endDate: string, type: string, metode_pembayaran: string): Promise<Summary[]> => {
    const params = new URLSearchParams({
        startDate,
        endDate
    });

    if (type && type.trim() !== '') {
        params.append('type', type);
    }

    if (metode_pembayaran && metode_pembayaran.trim() !== '') {
        params.append('metode_pembayaran', metode_pembayaran);
    }

    const fullUrl = `${API_BASE_URL}/dashboard/booking-summary?${params.toString()}`;

    const response = await fetch(fullUrl, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const result: ApiResponse<Summary[]> = await response.json();

    return result.data;
}