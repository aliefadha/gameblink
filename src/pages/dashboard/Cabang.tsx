import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Dialog, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { BiHomeAlt } from "react-icons/bi"
import { FiUpload } from "react-icons/fi"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogDescription } from "@radix-ui/react-dialog"
import { createCabang, getCabangs } from "@/lib/api/cabangs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/manajemen-cabang/data-table"
import { columns } from "@/components/manajemen-cabang/columns"
import { toast } from "sonner"
import { useState } from "react"
import { type CreateCabangData, createCabangSchema } from "@/lib/validations/cabang.schema"

function Cabang() {

    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data: cabangs, isLoading } = useQuery({
        queryKey: ['cabangs'],
        queryFn: async () => {
            try {
                return await getCabangs();
            } catch (error: unknown) {
                if (error instanceof Error) {
                    if (error.message.includes("Status: 404")) {
                        return [];
                    }
                }
                throw error;
            }
        },
    });
    const form = useForm<CreateCabangData>({
        resolver: zodResolver(createCabangSchema),
        defaultValues: {
            nama_cabang: "",
            alamat_cabang: "",
            file: undefined,
            status: "Aktif",
        },
    })

    const mutation = useMutation({
        mutationFn: createCabang,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cabangs'] });
            toast.success("Cabang berhasil ditambahkan");
            setIsDialogOpen(false);
            form.reset();
        },
        onError: (error) => {
            toast.error(`Gagal menambahkan cabang: ${error.message}`);
        }
    });

    function onSubmit(data: CreateCabangData) {
        const formData = new FormData();

        formData.append('nama_cabang', data.nama_cabang);
        formData.append('alamat_cabang', data.alamat_cabang);
        formData.append('status', data.status);

        if (data.file !== undefined && data.file.length > 0) {
            formData.append('file', data.file[0]);
        }


        mutation.mutate(formData);
    }

    return (
        <div className="p-10 flex flex-col gap-y-4 ">
            <div className="flex md:flex-row flex-col justify-between gap-y-4">
                <div>
                    <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                        <BiHomeAlt size={24} />
                        <span>Manajemen Cabang</span>
                    </h1>
                </div>
                <div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="purple" className="w-full">+ Cabang</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-[#61368E] font-bold text-xl">Tambah Cabang</DialogTitle>
                            </DialogHeader>
                            <DialogDescription className="sr-only">
                                Deskripsi
                            </DialogDescription>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={({ field: { onChange, onBlur, name, ref } }) => ( // Deconstructed field
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Foto Toko</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type="file"
                                                                className="bg-[#F8F5F5] rounded-sm pl-10 file:text-gray-600"
                                                                onBlur={onBlur}
                                                                name={name}
                                                                ref={ref}
                                                                onChange={(e) => {
                                                                    onChange(e.target.files);
                                                                }}
                                                            />
                                                            <FiUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Status</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Aktif">Aktif</SelectItem>
                                                                <SelectItem value="Tidak_Aktif">Tidak Aktif</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline">Batal</Button>
                                        </DialogClose>
                                        <Button type="submit" variant="purple" disabled={mutation.isPending}>
                                            {mutation.isPending ? "Menyimpan..." : "Simpan"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <DataTable columns={columns} data={cabangs || []} isLoading={isLoading} />
            </div>
        </div>
    )
}

export default Cabang