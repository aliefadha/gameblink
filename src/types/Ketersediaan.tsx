export interface Ketersediaan {
    id_ketersediaan: string;
    cabang_id?: string;
    unit_id?: string;
    nama_cabang: string;
    nama_unit: string;
    tanggal_mulai_blokir: string;
    jam_mulai_blokir: string;
    tanggal_selesai_blokir: string;
    jam_selesai_blokir: string;
    keterangan: string;
    status_perbaikan: "Pending" | "Selesai";
}
