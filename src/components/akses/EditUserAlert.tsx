import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { editUserFormSchema, type EditUserFormData } from "@/lib/validations/user.schema";
import { editUser } from "@/lib/api/akses";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/types/User";

interface EditUserAlertProps {
    user: User;
}

export function EditUserAlert({ user }: EditUserAlertProps) {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<EditUserFormData>({
        resolver: zodResolver(editUserFormSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            role: user.role,
            password: "",
            confirmPassword: "",
        },
    });

    const mutation = useMutation({
        mutationFn: (userData: EditUserFormData) => editUser(user.id, userData),
        onSuccess: (data) => {
            toast.success(`User "${data.name}" berhasil diubah.`);
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsOpen(false);
        },
        onError: (error) => {
            toast.error(`Gagal mengubah user: ${error.message}`);
        },
    });

    const onSubmit = (values: EditUserFormData) => {
        // Only include password if it's provided
        const submitData = { ...values };
        if (!values.password || values.password.trim() === '') {
            delete submitData.password;
            delete submitData.confirmPassword;
        }
        mutation.mutate(submitData);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-[#009B4F]">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-[#61368E] font-bold text-xl">Edit User</DialogTitle>
                    <DialogDescription className="text-gray-600 sr-only">
                        Ubah informasi user. Pastikan data yang dimasukkan sudah benar.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        {/* Name Input */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-6 items-center gap-2">
                                    <FormLabel className="text-[#6C6C6C] col-span-2">Nama</FormLabel>
                                    <div className="col-span-4 col-start-3 w-full">
                                        <FormControl>
                                            <Input placeholder="Nama User" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Email Input */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-6 items-center gap-2">
                                    <FormLabel className="text-[#6C6C6C] col-span-2">Email</FormLabel>
                                    <div className="col-span-4 col-start-3 w-full">
                                        <FormControl>
                                            <Input placeholder="Email" type="email" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Role Select */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-6 items-center gap-2">
                                    <FormLabel className="text-[#6C6C6C] col-span-2">Role</FormLabel>
                                    <div className="col-span-4 col-start-3 w-full">
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-[#F8F5F5] rounded-sm">
                                                    <SelectValue placeholder="Pilih Role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Password Input */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-6 items-center gap-2">
                                    <FormLabel className="text-[#6C6C6C] col-span-2">Password Baru</FormLabel>
                                    <div className="col-span-4 col-start-3 w-full">
                                        <FormControl>
                                            <Input placeholder="Password Baru (opsional)" type="password" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password Input */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-6 items-center gap-2">
                                    <FormLabel className="text-[#6C6C6C] col-span-2">Konfirmasi Password</FormLabel>
                                    <div className="col-span-4 col-start-3 w-full">
                                        <FormControl>
                                            <Input placeholder="Konfirmasi Password (opsional)" type="password" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                                Batal
                            </Button>
                            <Button type="submit" variant="purple" disabled={mutation.isPending}>
                                {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}