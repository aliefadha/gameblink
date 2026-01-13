import type { Booking, CreateBookingRequest, CreateBookingResponse } from "@/types/Booking";
import { getToken } from "./auth";
import type { StepOneData, StepTwoData, StepThreeData } from "@/store/UseFormStore";
import type { ApiResponse, PaginatedApiResponse } from "@/types/Api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getBookings = async (startDate?: string, endDate?: string, type?: string, cabang?: string, search?: string, limit?: number): Promise<Booking[]> => {
    let fullUrl = `${API_BASE_URL}/booking`;
    const params = new URLSearchParams();

    if (startDate) {
        params.append('startDate', startDate);
    }
    if (endDate) {
        params.append('endDate', endDate);
    }
    if (type && type !== 'all') {
        params.append('type', type);
    }
    if (cabang && cabang !== 'all') {
        params.append('cabang', cabang);
    }
    if (search) {
        params.append('search', search);
    }
    if (limit) {
        params.append('limit', limit.toString());
    }

    if (params.toString()) {
        fullUrl += `?${params.toString()}`;
    }

    const response = await fetch(fullUrl);

    if (!response.ok) {
        if (response.status === 404) {
            return [];
        }
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const apiResponse: PaginatedApiResponse<Booking> = await response.json();

    return apiResponse.data?.data || [];
};

export const getBookingsWithMeta = async (startDate?: string, endDate?: string, type?: string): Promise<PaginatedApiResponse<Booking>> => {
    let fullUrl = `${API_BASE_URL}/booking`;
    const params = new URLSearchParams();

    if (startDate) {
        params.append('startDate', startDate);
    }
    if (endDate) {
        params.append('endDate', endDate);
    }
    if (type && type !== 'all') {
        params.append('type', type);
    }

    if (params.toString()) {
        fullUrl += `?${params.toString()}`;
    }

    const response = await fetch(fullUrl);

    if (!response.ok) {
        if (response.status === 404) {
            return {
                statusCode: 404,
                message: 'No data found',
                data: {
                    data: [],
                    meta: {
                        current_page: 1,
                        from: 0,
                        last_page: 1,
                        links: [],
                        path: '',
                        per_page: 0,
                        to: 0,
                        total: 0
                    }
                }
            };
        }
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const apiResponse: PaginatedApiResponse<Booking> = await response.json();

    if (!apiResponse.data) {
        apiResponse.data = {
            data: [],
            meta: {
                current_page: 1,
                from: 0,
                last_page: 1,
                links: [],
                path: '',
                per_page: 0,
                to: 0,
                total: 0
            }
        };
    }

    return apiResponse;
}

export const createBooking = async (bookingData: CreateBookingRequest): Promise<ApiResponse<CreateBookingResponse>> => {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/booking`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bookingData),
    });

    if (response.status !== 201) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Booking creation failed with status: ${response.status}`);
    }

    const result: ApiResponse<CreateBookingResponse> = await response.json();
    return result;
};

export const createWalkinBooking = async (bookingData: CreateBookingRequest): Promise<ApiResponse<CreateBookingResponse>> => {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/booking/walkin`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bookingData),
    });

    if (response.status !== 201) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Booking creation failed with status: ${response.status}`);
    }

    const result: ApiResponse<CreateBookingResponse> = await response.json();
    return result;
};

// Utility function to transform form data to API format
export const transformFormDataToBookingRequest = (
    stepOne: StepOneData,
    stepTwo: StepTwoData,
    stepThree: StepThreeData
): CreateBookingRequest => {
    const currentDate = new Date();
    const tanggalTransaksi = currentDate.toISOString();

    const bookingDetails = stepThree.booking_detail.map(detail => ({
        unit_id: detail.unit_id,
        jam_main: detail.jam_main,
        harga: detail.harga,
        tanggal: detail.tanggal
    }));

    return {
        nama: stepOne.nama,
        nomor_hp: stepOne.noHp,
        email: stepOne.email,
        cabang_id: stepTwo.id_cabang,
        tanggal_main: stepThree.tanggal_main,
        tanggal_transaksi: tanggalTransaksi,
        total_harga: stepThree.total_harga,
        status_booking: "TidakAktif",
        booking_details: bookingDetails,
        booking_type: stepThree.booking_type,
        metode_pembayaran: stepThree.metode_pembayaran,
    };
};

export const submitBookingFromFormData = async (
    stepOne: StepOneData,
    stepTwo: StepTwoData,
    stepThree: StepThreeData
): Promise<CreateBookingResponse> => {
    const bookingData = transformFormDataToBookingRequest(stepOne, stepTwo, stepThree);
    const result = await createBooking(bookingData);
    return result.data;
};

export const updateBooking = async (bookingId: string, status_booking: string): Promise<ApiResponse<Booking>> => {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/booking/${bookingId}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ status_booking }),
    });

    if (response.status !== 200) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Booking update failed with status: ${response.status}`);
    }

    const result: ApiResponse<Booking> = await response.json();
    return result;

}

export const exportBookings = async (startDate?: string, endDate?: string, type?: string, cabang?: string, search?: string, format: 'excel' | 'csv' = 'excel'): Promise<ArrayBuffer> => {
    const token = getToken();
    let fullUrl = `${API_BASE_URL}/booking/export`;
    const params = new URLSearchParams();

    if (startDate) {
        params.append('startDate', startDate);
    }
    if (endDate) {
        params.append('endDate', endDate);
    }
    if (type && type !== 'all') {
        params.append('type', type);
    }
    if (cabang && cabang !== 'all') {
        params.append('cabang', cabang);
    }
    if (search) {
        params.append('search', search);
    }
    
    // Add format parameter to API request
    params.append('format', format);

    if (params.toString()) {
        fullUrl += `?${params.toString()}`;
    }

    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('No data found to export');
        }
        throw new Error(`Export failed with status: ${response.status}`);
    }

    // Use arrayBuffer for both Excel and CSV formats
    const data = await response.arrayBuffer();
    return data;
};
