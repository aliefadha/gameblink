import type { Booking, CreateBookingRequest, CreateBookingResponse } from "@/types/Booking";
import { getToken } from "./auth";
import type { StepOneData, StepTwoData, StepThreeData } from "@/store/UseFormStore";
import type { ApiResponse, PaginatedApiResponse } from "@/types/Api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getBookings = async (date?: string, type?: string, cabang?: string, limit?: number, page?: number): Promise<Booking[]> => {
    let fullUrl = `${API_BASE_URL}/booking`;
    const params = new URLSearchParams();

    if (date) {
        params.append('tanggal_main', date);
    }
    if (type && type !== 'all') {
        params.append('type', type);
    }
    if (cabang && cabang !== 'all') {
        params.append('cabang', cabang);
    }
    if (limit) {
        params.append('limit', limit.toString());
    }
    if (page) {
        params.append('page', page.toString());
    }

    if (params.toString()) {
        fullUrl += `?${params.toString()}`;
    }


    const response = await fetch(fullUrl);

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const apiResponse: PaginatedApiResponse<Booking> = await response.json();
    console.log('API Response:', apiResponse); // Debug logging

    // Return the booking data array from the paginated response
    return apiResponse.data.data;
};

// New function to get bookings with pagination metadata
export const getBookingsWithMeta = async (date?: string, type?: string): Promise<PaginatedApiResponse<Booking>> => {
    let fullUrl = `${API_BASE_URL}/booking`;
    const params = new URLSearchParams();

    if (date) {
        params.append('tanggal_main', date);
    }
    if (type && type !== 'all') {
        params.append('type', type);
    }

    if (params.toString()) {
        fullUrl += `?${params.toString()}`;
    }

    const response = await fetch(fullUrl);

    if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const apiResponse: PaginatedApiResponse<Booking> = await response.json();
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
