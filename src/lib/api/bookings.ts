import type { Booking, CreateBookingRequest, CreateBookingResponse } from "@/types/Booking";
import { getToken } from "./auth";
import type { StepOneData, StepTwoData, StepThreeData } from "@/store/UseFormStore";
import type { ApiResponse } from "@/types/Api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getBookings = async (date?: string): Promise<Booking[]> => {
    let fullUrl = `${API_BASE_URL}/booking`;
    if (date) fullUrl += `?tanggal_main=${encodeURIComponent(date)}`;


    const response = await fetch(fullUrl);

    const data = await response.json();
    return data.data;
};

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
        status_booking: "Aktif",
        booking_details: bookingDetails
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
