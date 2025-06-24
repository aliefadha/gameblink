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
    tanggal_mulai_blokir: z.string({
        required_error: "Tanggal mulai blokir harus diisi.",
    }),
    tanggal_selesai_blokir: z.string({
        required_error: "Tanggal selesai blokir harus diisi.",
    }),
    jam_selesai_blokir: z.string(),
    jam_mulai_blokir: z.string(),
    keterangan: z.string().min(2, {
        message: "Keterangan harus lebih dari 2 karakter",
    }),
})
    .refine((data) => {
        if (!data.tanggal_mulai_blokir || !data.tanggal_selesai_blokir) {
            return false;
        }
        const startDateTime = new Date(data.tanggal_mulai_blokir);
        if (data.jam_mulai_blokir) {
            const [hours, minutes] = data.jam_mulai_blokir.split(':');
            startDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        }
        const endDateTime = new Date(data.tanggal_selesai_blokir);
        if (data.jam_selesai_blokir) {
            const [hours, minutes] = data.jam_selesai_blokir.split(':');
            endDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        }
        return endDateTime > startDateTime;
    }, {
        message: "Tanggal dan jam selesai blokir tidak valid",
        path: ["tanggal_selesai_blokir"],
    });

export type KetersediaanFormData = z.infer<typeof ketersediaanFormSchema>;