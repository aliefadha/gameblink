export interface Booking {
    id: string;
    nama: string;
    nomorHp: string;
    email: string;
    cabang: string;
    unit: string,
    tanggalMain: string; // Use ISO string format, e.g., "2025-06-12T10:00:00Z"
    jamMain: string;
    tanggalTransaksi: string; // Use ISO string format, e.g., "2025-06-12T10:00:00Z"
    metodePembayaran: string;
    totalHarga: number;
    statusPembayaran: 'berhasil' | 'gagal' | 'pending'
    statusBooking: 'aktif' | 'dibatalkan' | 'selesai' | '-';
}