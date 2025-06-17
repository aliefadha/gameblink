import { z } from "zod";
export const unitFormSchema = z.object({
    cabang_id: z.string().nonempty({ message: "Cabang harus dipilih." }),
    nama_unit: z.string().min(2, {
        message: "Nama Unit harus lebih dari 2 karakter.",
    }),
    jenis_konsol: z.string().min(2, {
        message: "Jenis konsol harus lebih dari 2 karakter.",
    }),
    harga: z.coerce.number().min(1, {
        message: "Harga harus lebih dari 0.",
    }),
});

export type UnitFormData = z.infer<typeof unitFormSchema>;