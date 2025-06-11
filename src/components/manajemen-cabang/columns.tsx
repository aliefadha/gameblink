import type { Cabang } from "@/types/Cabang"
import { type ColumnDef } from "@tanstack/react-table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming Select components
import { useForm } from "react-hook-form" // You'll need to import and set up react-hook-form
import { zodResolver } from "@hookform/resolvers/zod"; // For Zod schema validation
import * as z from "zod"; // For Zod
import { Form, FormField, FormMessage } from "../ui/form";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";

const formSchema = z.object({
    id: z.string(),
    nama_cabang: z.string().min(1, "Nama cabang tidak boleh kosong"),
    alamat_cabang: z.string().min(1, "Alamat tidak boleh kosong"),
    jumlah_unit: z.coerce.number().min(0, "Jumlah unit tidak boleh negatif"),
    status: z.enum(["aktif", "nonaktif"]),
});

export const columns: ColumnDef<Cabang>[] = [
    {
        accessorKey: "nama_cabang",
        header: "Nama Cabang",
    },
    {
        accessorKey: "alamat_cabang",
        header: "Alamat",
    },
    {
        accessorKey: "jumlah_unit",
        header: "Jumlah Unit",
    },
    {
        accessorKey: "status",
        header: "Status",
        size: 100,
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <div>
                    <span className={`flex flex-1 justify-center py-1.5 rounded-full text-xs font-medium capitalize ${status === "aktif"
                        ? "bg-[#009B4F] text-white"
                        : status === "nonaktif"
                            ? "bg-[#D31A1D] text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                        {status === "nonaktif" ? "tidak aktif" : status}
                    </span>
                </div>
            )
        }
    },
    {
        id: "aksi",
        header: "Aksi",
        cell: ({ row }) => {
            const data = row.original as Cabang;
            const form = useForm<z.infer<typeof formSchema>>({
                resolver: zodResolver(formSchema),
                defaultValues: {
                    id: data.id,
                    nama_cabang: data.nama_cabang,
                    alamat_cabang: data.alamat_cabang,
                    jumlah_unit: data.jumlah_unit,
                    status: data.status,
                },
            });

            function onSubmit(values: z.infer<typeof formSchema>) {
                // Implement your update logic here
                console.log("Form submitted with values:", values);
                // Example: updateCabang(values).then(() => queryClient.invalidateQueries('cabangs'))
            }

            return (
                <div className="gap-x-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="link" className="text-[#009B4F]">
                                Lihat Detail
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-[#61368E] font-bold text-xl">Lihat Detail</DialogTitle>
                                <DialogDescription className="sr-only">
                                    Lihat Detail
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                    <div className="space-y-4 py-4"> {/* Placeholder for form structure */}
                                        {/* ID (usually not editable, shown for reference) */}

                                        {/* Nama Cabang Input */}
                                        <FormField
                                            control={form.control}
                                            name="nama_cabang"
                                            render={({ field }) => (
                                                <div className="grid grid-cols-6 items-center gap-2">
                                                    <p className="text-[#6C6C6C] col-span-2">Nama Cabang</p>
                                                    <div className="col-span-4 col-start-3 w-full">
                                                        <Input placeholder="Nama Cabang" defaultValue={data.nama_cabang} className="bg-[#F8F5F5] rounded-sm" {...field} />
                                                        <FormMessage />
                                                    </div>
                                                </div>
                                            )}
                                        />

                                        {/* Alamat Cabang Input */}
                                        <FormField
                                            control={form.control}
                                            name="alamat_cabang"
                                            render={({ field }) => (
                                                <div className="grid grid-cols-6 items-center gap-2">
                                                    <p className="text-[#6C6C6C] col-span-2">Alamat</p>
                                                    <div className="col-span-4 col-start-3 w-full">
                                                        <Input placeholder="Alamat" defaultValue={data.alamat_cabang} className="bg-[#F8F5F5] rounded-sm" {...field} />
                                                        <FormMessage />
                                                    </div>
                                                </div>
                                            )}
                                        />

                                        {/* Jumlah Unit Input */}
                                        <FormField
                                            control={form.control}
                                            name="jumlah_unit"
                                            render={({ field }) => (
                                                <div className="grid grid-cols-6 items-center gap-2">
                                                    <p className="text-[#6C6C6C] col-span-2">Jumlah Unit</p>
                                                    <div className="col-span-4 col-start-3 w-full">
                                                        <Input type="number" placeholder="Jumlah Unit" defaultValue={data.jumlah_unit} className="bg-[#F8F5F5] rounded-sm" {...field} />
                                                        <FormMessage />
                                                    </div>
                                                </div>
                                            )}
                                        />

                                        {/* Status Select */}
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <div className="grid grid-cols-6 items-center gap-2">
                                                    <p className="text-[#6C6C6C] col-span-2">Status</p>
                                                    <div className="col-span-4 col-start-3 w-full">
                                                        <Select defaultValue={data.status} onValueChange={field.onChange}  >
                                                            <SelectTrigger className="w-full bg-[#F8F5F5] rounded-sm">
                                                                <SelectValue placeholder="Pilih Status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="aktif">Aktif</SelectItem>
                                                                <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Batal</Button>
                                        </DialogClose>
                                        <Button type="submit" variant="purple">Simpan</Button> {/* Changed button text */}
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog >
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="link" className="text-[#D31A1D]">
                                Hapus
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-[#61368E] ">Hapus Cabang</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Yakin Ingin Menghapus Cabang
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="text-black border-black">Batal</AlertDialogCancel>
                                <AlertDialogAction className="bg-[#D31A1D] text-white hover:bg-[#B31518]">Hapus</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )
        }
    }
]
