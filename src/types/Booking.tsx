export interface Booking {
    id: string;
    nama: string;
    nomor_hp: string;
    email: string;
    cabang: string;
    unit: string,
    tanggal_main: string; // Use ISO string format, e.g., "2025-06-12T10:00:00Z"
    jam_main: string;
    tanggal_transaksi: string; // Use ISO string format, e.g., "2025-06-12T10:00:00Z"
    metode_pembayaran: string;
    total_harga: number;
    status_pembayaran: 'berhasil' | 'gagal' | 'pending'
    status_booking: 'aktif' | 'dibatalkan' | 'selesai' | '-';
}