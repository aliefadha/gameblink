import type { Booking } from "@/types/Booking";
import { getToken } from "./auth";
import type { StepOneData, StepTwoData, StepThreeData } from "@/store/UseFormStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getBookings = async (): Promise<Booking[]> => {
    const fullUrl = `${API_BASE_URL}/booking`;

    // Add this log to see the exact URL you are requesting
    console.log('Fetching from URL:', fullUrl);


    const response = await fetch(fullUrl);

    // The error happens on the next line if the response is HTML
    if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
};

// Types for the booking submission
export interface CreateBookingRequest {
    nama: string;
    nomor_hp: string;
    email: string;
    cabang_id: string;
    tanggal_main: string;
    tanggal_transaksi: string;
    metode_pembayaran: string;
    total_harga: number;
    status_pembayaran: string;
    status_booking: string;
    booking_details: {
        unit_id: string;
        jam_main: string;
        harga: number;
    }[];
}

export interface CreateBookingResponse {
    success: boolean;
    message: string;
    data?: Booking;
}

export const createBooking = async (bookingData: CreateBookingRequest): Promise<CreateBookingResponse> => {
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

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Booking creation failed with status: ${response.status}`);
    }

    const result: CreateBookingResponse = await response.json();
    return result;
};

// Utility function to transform form data to API format
export const transformFormDataToBookingRequest = (
    stepOne: StepOneData,
    stepTwo: StepTwoData,
    stepThree: StepThreeData
): CreateBookingRequest => {
    // Get current date for tanggal_transaksi
    const currentDate = new Date();
    const tanggalTransaksi = currentDate.toISOString();
    
    // Transform booking details to match API format
    const bookingDetails = stepThree.booking_detail.map(detail => ({
        unit_id: detail.unit_id,
        jam_main: detail.jam_main,
        harga: detail.harga
    }));

    return {
        nama: stepOne.nama,
        nomor_hp: stepOne.noHp,
        email: stepOne.email,
        cabang_id: stepTwo.id_cabang,
        tanggal_main: stepThree.tanggal_main,
        tanggal_transaksi: tanggalTransaksi,
        metode_pembayaran: "QRIS", // Default value, you might want to make this configurable
        total_harga: stepThree.total_harga,
        status_pembayaran: "Berhasil", // Default value, you might want to make this configurable
        status_booking: "Aktif", // Default value, you might want to make this configurable
        booking_details: bookingDetails
    };
};

// Convenience function to submit booking from form store data
export const submitBookingFromFormData = async (
    stepOne: StepOneData,
    stepTwo: StepTwoData,
    stepThree: StepThreeData
): Promise<CreateBookingResponse> => {
    const bookingData = transformFormDataToBookingRequest(stepOne, stepTwo, stepThree);
    return await createBooking(bookingData);
};