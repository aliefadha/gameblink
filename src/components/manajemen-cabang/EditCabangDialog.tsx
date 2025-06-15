import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCabangSchema, type UpdateCabangData } from "@/lib/validations/cabang.schema";
import { updateCabang } from "@/lib/api/cabangs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiUpload } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import type { Cabang } from "@/types/Cabang";
import { DialogDescription } from "@radix-ui/react-dialog";

interface EditCabangDialogProps {
    cabang: Cabang;
}

export function EditCabangDialog({ cabang }: EditCabangDialogProps) {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm<UpdateCabangData>({
        resolver: zodResolver(updateCabangSchema),
        defaultValues: {
            id: cabang.id,
            nama_cabang: cabang.nama_cabang,
            alamat_cabang: cabang.alamat_cabang,
            status: cabang.status,
            file: undefined,
        },
    });

    const mutation = useMutation({
        mutationFn: updateCabang,
        onSuccess: (data) => {
            toast.success(`Data cabang "${data.nama_cabang}" berhasil diubah.`);
            queryClient.invalidateQueries({ queryKey: ['cabangs'] });
            setIsOpen(false);
        },
        onError: (error) => {
            toast.error(`Gagal mengubah data: ${error.message}`);
        }
    });

    const onSubmit = (values: UpdateCabangData) => {
        const formData = new FormData();
        formData.append('id', values.id);
        formData.append('nama_cabang', values.nama_cabang);
        formData.append('alamat_cabang', values.alamat_cabang);
        formData.append('status', values.status);
        if (values.file && values.file.length > 0) {
            formData.append('file', values.file[0]);
        }
        mutation.mutate(formData);
    };

    useEffect(() => {
        return () => { if (preview) URL.revokeObjectURL(preview); };
    }, [preview]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            form.reset();
            setPreview(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-[#009B4F]">Lihat Detail</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-[#61368E] font-bold text-xl">Detail Cabang</DialogTitle>
                </DialogHeader>

                <DialogDescription className="sr-only">
                    Lihat atau ubah detail cabang
                </DialogDescription>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div>
                            <FormLabel className="text-[#6C6C6C]">Foto Toko</FormLabel>
                            <div className="mt-2 w-full h-40 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                                <img
                                    src={preview || `${import.meta.env.VITE_API_BASE_URL}${cabang.imageCabang}`}
                                    alt={cabang.nama_cabang}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">Upload Foto Baru</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="file"
                                                className="bg-[#F8F5F5] rounded-sm pl-10 file:text-gray-600"
                                                accept="image/png, image/jpeg, image/jpg"
                                                onChange={(e) => {
                                                    field.onChange(e.target.files);
                                                    const file = e.target.files?.[0];
                                                    if (preview) URL.revokeObjectURL(preview);
                                                    if (file) {
                                                        setPreview(URL.createObjectURL(file));
                                                    } else {
                                                        setPreview(null);
                                                    }
                                                }}
                                            />
                                            <FiUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Nama Cabang Input */}
                        <FormField
                            control={form.control}
                            name="nama_cabang"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-6 items-center gap-2">
                                    <FormLabel className="text-[#6C6C6C] col-span-2">Nama Cabang</FormLabel>
                                    <div className="col-span-4 col-start-3 w-full">
                                        <FormControl>
                                            <Input placeholder="Nama Cabang" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Alamat Cabang Input */}
                        <FormField
                            control={form.control}
                            name="alamat_cabang"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-6 items-center gap-2">
                                    <FormLabel className="text-[#6C6C6C] col-span-2">Alamat</FormLabel>
                                    <div className="col-span-4 col-start-3 w-full">
                                        <FormControl>
                                            <Input placeholder="Alamat" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Status Select */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-6 items-center gap-2">
                                    <FormLabel className="text-[#6C6C6C] col-span-2">Status</FormLabel>
                                    <div className="col-span-4 col-start-3 w-full">
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-[#F8F5F5] rounded-sm">
                                                    <SelectValue placeholder="Pilih Status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Aktif">
                                                    <Badge className="bg-green-500 hover:bg-green-500 text-white">Aktif</Badge>
                                                </SelectItem>
                                                <SelectItem value="Tidak_Aktif">
                                                    <Badge variant="destructive" className="bg-red-500 hover:bg-red-500 text-white">Tidak Aktif</Badge>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Batal</Button>
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