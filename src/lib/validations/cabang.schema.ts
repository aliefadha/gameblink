import { z } from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg"];

const fileSchema = z
    .instanceof(FileList, { message: "Foto tidak boleh kosong." })
    .refine((files) => files?.length > 0, "Foto tidak boleh kosong.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Ukuran file maksimal 5MB.`)
    .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        "Format foto harus .jpg, .png., .webp, atau .svg"
    );

const baseCabangSchema = z.object({
    nama_cabang: z.string().min(3, {
        message: "Nama harus lebih dari 3 karakter.",
    }),
    alamat_cabang: z.string().min(10, {
        message: "Alamat harus lebih dari 10 karakter.",
    }),
    status: z.enum(["Aktif", "Tidak_Aktif"]),
});

export const createCabangSchema = baseCabangSchema.extend({
    file: fileSchema,
});

export const updateCabangSchema = baseCabangSchema.extend({
    id: z.string(),
    file: fileSchema.optional(),
});

export type UpdateCabangData = z.infer<typeof updateCabangSchema>;
export type CreateCabangData = z.infer<typeof createCabangSchema>;
