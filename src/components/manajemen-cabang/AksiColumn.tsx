import type { Cabang } from "@/types/Cabang";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Row } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
    id: z.string(),
    nama_cabang: z.string().min(1, "Nama cabang tidak boleh kosong"),
    alamat_cabang: z.string().min(1, "Alamat tidak boleh kosong"),
    jumlah_unit: z.coerce.number().min(0, "Jumlah unit tidak boleh negatif"),
    status: z.enum(["aktif", "nonaktif"]),
});

interface AksiColumnProps {
    row: Row<Cabang>;
}

export function AksiColumn({ row }: AksiColumnProps) {
    const data = row.original;
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
                                {/* Nama Cabang Input */}
                                <FormField
                                    control={form.control}
                                    name="nama_cabang"
                                    render={({ field }) => (
                                        <div className="grid grid-cols-6 items-center gap-2">
                                            <p className="text-[#6C6C6C] col-span-2">Nama Cabang</p>
                                            <div className="col-span-4 col-start-3 w-full">
                                                <Input placeholder="Nama Cabang" className="bg-[#F8F5F5] rounded-sm" {...field} />
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
                                                <Input placeholder="Alamat" className="bg-[#F8F5F5] rounded-sm" {...field} />
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
                                                <Input type="number" placeholder="Jumlah Unit" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    )}
                                />

                                {/* Status Select */}
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => {
                                        const currentStatus = form.watch("status") || data.status; // Ensure initial value is considered
                                        return (
                                            <div className="grid grid-cols-6 items-center gap-2">
                                                <p className="text-[#6C6C6C] col-span-2">Status</p>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <Select onValueChange={field.onChange} value={field.value || data.status}>
                                                        <SelectTrigger className={cn(
                                                            "w-full rounded-sm bg-[#F8F5F5] flex justify-between items-center pl-3 pr-2 py-2" // Use justify-between
                                                        )}>
                                                            {currentStatus === "aktif" ? (
                                                                <Badge variant="default" className="bg-green-500 hover:bg-green-600">Aktif</Badge>
                                                            ) : currentStatus === "nonaktif" ? (
                                                                <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">Nonaktif</Badge>
                                                            ) : (
                                                                <SelectValue placeholder="Pilih Status" />
                                                            )}
                                                            {/* The arrow icon is part of SelectTrigger by default and will be pushed to the end by justify-between */}
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="aktif">Aktif</SelectItem>
                                                            <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" onClick={() => form.reset()}>Batal</Button>
                                </DialogClose>
                                <Button type="submit" variant="purple">Simpan</Button>
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
    );
}