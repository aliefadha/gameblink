export interface Cabang {
    id: string;
    nama_cabang: string;
    alamat_cabang: string;
    jumlah_unit: number;
    imageCabang?: string;
    status: "Aktif" | "Tidak_Aktif"
}
