import { z } from "zod";

export const ketersediaanFormSchema = z.object({
    cabang_id: z.string().min(1, {
        message: "Pilih cabang",
    }),
    nama_cabang: z.string().min(1, {
        message: "Pilih nama cabang",
    }),
    unit_id: z.string().min(1, {
        message: "Pilih unit",
    }),
    nama_unit: z.string().min(1, {
        message: "Pilih nama unit",
    }),
    tanggal_mulai_blokir: z.string(),
    tanggal_selesai_blokir: z.string().optional(),
    jam_mulai_blokir: z.string(),
    jam_selesai_blokir: z.string().optional(),
    keterangan: z.string().min(2, {
        message: "Keterangan harus lebih dari 2 karakter",
    }),
    status_perbaikan: z.enum(['Selesai', 'Pending']),
}).refine((data) => {
    if (data.tanggal_selesai_blokir) {
        const startDate = new Date(data.tanggal_mulai_blokir);
        const endDate = new Date(data.tanggal_selesai_blokir);
        return endDate >= startDate;
    }
    return true;
}, {
    message: "Tanggal selesai tidak boleh kurang dari tanggal mulai",
    path: ["tanggal_selesai_blokir"],
}).refine((data) => {
    if (data.tanggal_selesai_blokir && data.jam_selesai_blokir && data.jam_mulai_blokir) {
        const startDate = new Date(data.tanggal_mulai_blokir);
        const endDate = new Date(data.tanggal_selesai_blokir);

        // Check if dates are the same
        if (startDate.toDateString() === endDate.toDateString()) {
            const startTime = new Date(`2000-01-01T${data.jam_mulai_blokir}`);
            const endTime = new Date(`2000-01-01T${data.jam_selesai_blokir}`);
            return endTime >= startTime;
        }
    }
    return true;
}, {
    message: "Jam selesai tidak boleh kurang dari jam mulai jika tanggal sama",
    path: ["jam_selesai_blokir"],
})

export const editKetersediaanFormSchema = z.object({
    tanggal_mulai_blokir: z.string(),
    jam_mulai_blokir: z.string(),
    tanggal_selesai_blokir: z.string().optional(),
    jam_selesai_blokir: z.string().optional(),
    status_perbaikan: z.enum(['Selesai', 'Pending']),
}).refine((data) => {
    if (data.tanggal_selesai_blokir) {
        const startDate = new Date(data.tanggal_mulai_blokir);
        const endDate = new Date(data.tanggal_selesai_blokir);
        return endDate >= startDate;
    }
    return true;
}, {
    message: "Tanggal selesai tidak boleh kurang dari tanggal mulai",
    path: ["tanggal_selesai_blokir"],
}).refine((data) => {
    if (data.tanggal_selesai_blokir && data.jam_selesai_blokir && data.jam_mulai_blokir) {
        const startDate = new Date(data.tanggal_mulai_blokir);
        const endDate = new Date(data.tanggal_selesai_blokir);

        // Check if dates are the same
        if (startDate.toDateString() === endDate.toDateString()) {
            const startTime = new Date(`2000-01-01T${data.jam_mulai_blokir}`);
            const endTime = new Date(`2000-01-01T${data.jam_selesai_blokir}`);
            return endTime >= startTime;
        }
    }
    return true;
}, {
    message: "Jam selesai tidak boleh kurang dari jam mulai jika tanggal sama",
    path: ["jam_selesai_blokir"],
});

export type KetersediaanFormData = z.infer<typeof ketersediaanFormSchema>;
export type EditKetersediaanFormData = z.infer<typeof editKetersediaanFormSchema>;