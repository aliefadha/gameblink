import { z } from "zod";
export const userFormSchema = z.object({
    email: z.string().email({
        message: "Format harus email"
    }),
    name: z.string().min(2, {
        message: "Nama user harus lebih dari 2 karakter.",
    }),
    role: z.enum(["ADMIN", "SUPERADMIN"]),
    password: z.string().min(6, {
        message: "Password harus lebih dari 6 karakter"
    }),
    confirmPassword: z.string().min(6, {
        message: "Password harus lebih dari 6 karakter"
    }),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "Password berbeda",
            path: ['confirmPassword']
        });
    };
})

export type UserFormData = z.infer<typeof userFormSchema>;