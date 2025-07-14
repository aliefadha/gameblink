export interface BookingDetail {
    id: string;
    booking_id: string;
    unit_id: string;
    jam_main: string;
    harga: number;
    tanggal: string;
    nama_unit: string;
    status_booking_detail: string;
}

export interface Booking {
    id: string;
    booking_code?: string;
    nama: string;
    nomor_hp: string;
    email: string;
    cabang_id: string;
    tanggal_main: string;
    tanggal_transaksi: string;
    metode_pembayaran?: string | null;
    total_harga: number;
    status_pembayaran: string;
    status_booking: string;
    booking_details: BookingDetail[];
    nama_cabang?: string;
    cabang?: string;
    booking_type: string;
}

export interface CreateBookingRequest {
    nama: string;
    nomor_hp: string;
    email: string;
    cabang_id: string;
    tanggal_main: string;
    tanggal_transaksi: string;
    total_harga: number;
    status_booking: string;
    booking_type: string;
    booking_details: {
        unit_id: string;
        jam_main: string;
        harga: number;
        tanggal: string;
    }[];
}

export interface CreateBookingResponse {
    token: string;
    redirect_url: string;
}