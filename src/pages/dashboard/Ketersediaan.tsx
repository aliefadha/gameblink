import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/manajemen-ketersediaan/data-table";
import { columns } from "@/components/manajemen-ketersediaan/columns";
import { PiCalendarCheckBold } from "react-icons/pi";
import { createKetersediaan, getKetersediaans } from "@/lib/api/ketersediaans";
import { getCabangs } from "@/lib/api/cabangs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { getUnitByCabang } from "@/lib/api/units";
import { ketersediaanFormSchema, type KetersediaanFormData } from "@/lib/validations/ketersediaan.schema";
import { toast } from "sonner";
import type { Unit } from "@/types/Unit";
import { omit } from "@/lib/utils";


function Ketersediaan() {
    const queryClient = useQueryClient()
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: ketersediaans, isLoading, error: ketersediaansError } = useQuery({
        queryKey: ['ketersediaans'],
        queryFn: async () => {
            try {
                return await getKetersediaans();
            } catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes("Status: 404")) {
                        return [];
                    }
                }
                throw error;
            }
        }

    });

    const { data: cabangs, isLoading: isLoadingCabang, error: cabangError } = useQuery({
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

    const form = useForm<KetersediaanFormData>({
        resolver: zodResolver(ketersediaanFormSchema),
        defaultValues: {
            cabang_id: "",
            nama_cabang: "",
            unit_id: "",
            nama_unit: "",
            tanggal_mulai_blokir: "",
            jam_mulai_blokir: "",
            tanggal_selesai_blokir: "",
            jam_selesai_blokir: "",
            keterangan: "",
        },
    });

    const selectedCabangName = form.watch("nama_cabang");
    const selectedUnitName = form.watch("nama_unit");

    const selectedCabang = cabangs?.find(c => c.nama_cabang === selectedCabangName);

    const { data: units, isLoading: isLoadingUnits, isError: isUnitsError } = useQuery({
        queryKey: ['units', selectedCabang?.id],
        queryFn: () => getUnitByCabang(selectedCabang!.id),
        enabled: !!selectedCabang,
        retry: (failureCount, error) => {
            if (error) return false;
            return failureCount < 3;
        },
    });

    useEffect(() => {
        if (selectedCabang) {
            form.setValue('cabang_id', selectedCabang.id);
            form.setValue('nama_unit', '');
            form.setValue('unit_id', '');
        }
    }, [selectedCabang, form]);

    useEffect(() => {
        if (selectedUnitName && units) {
            const selectedUnit = units.find((unit: Unit) => unit.nama_unit === selectedUnitName);
            if (selectedUnit) {
                form.setValue('unit_id', selectedUnit.id);
            }
        }
    }, [selectedUnitName, units, form]);


    const mutation = useMutation({
        mutationFn: (payload: Omit<KetersediaanFormData, 'nama_cabang' | 'nama_unit'>) => createKetersediaan(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ketersediaans'] });
            toast.success("Data ketersediaan berhasil ditambahkan");
            setIsDialogOpen(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast.error(`Gagal menambahkan data: ${error.message}`);
        }
    });


    function onSubmit(data: KetersediaanFormData) {
        const payload = omit(data, ['nama_cabang', 'nama_unit']);
        mutation.mutate(payload);
    }

    const getUnitPlaceholder = () => {
        if (isLoadingUnits) return "Memuat unit...";
        if (isUnitsError) return "Unit tidak ditemukan";
        if (!selectedCabang) return "Pilih cabang dulu";
        if (!units || units.length === 0) return "Unit tidak ditemukan";
        return "Pilih unit";
    };

    if (isLoading || isLoadingCabang) {
        return <div>Loading...</div>;
    }

    if (ketersediaansError || cabangError) {
        return <div>Error loading data.</div>;
    }

    return (
        <div className="p-10 flex flex-col gap-y-4">
            <div className="flex md:flex-row flex-col justify-between gap-y-4">
                <div>
                    <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                        <PiCalendarCheckBold size={24} />
                        <span>Manajemen Ketersediaan</span>
                    </h1>
                </div>
                <div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="purple" className="w-full">+ Tambah Data</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-[#61368E] font-bold text-xl">Tambah Data</DialogTitle>
                                <DialogDescription className="sr-only">Deskripsi</DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="nama_cabang"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Cabang</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih cabang" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {cabangs?.map((cabang) => (
                                                                <SelectItem key={cabang.id} value={cabang.nama_cabang}>
                                                                    {cabang.nama_cabang}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="cabang_id"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2 sr-only">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Id Cabang</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <FormControl>
                                                        <Input placeholder="Id Cabang" {...field} readOnly />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nama_unit"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Unit</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        disabled={
                                                            !selectedCabang ||
                                                            isLoadingUnits ||
                                                            isUnitsError ||
                                                            (!isLoadingUnits && (!units || units.length === 0))
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={getUnitPlaceholder()} />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {units?.map((unit: Unit) => (
                                                                <SelectItem key={unit.id} value={unit.nama_unit}>
                                                                    {unit.nama_unit}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="unit_id"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2 sr-only">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Id Unit</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <FormControl>
                                                        <Input placeholder="Id Unit" {...field} readOnly />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tanggal_mulai_blokir"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="col-span-2 text-[#6C6C6C]">Tanggal Mulai</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className="w-full justify-between rounded-sm border-input text-muted-foreground"
                                                                >
                                                                    {field.value ? new Date(field.value).toLocaleDateString() : <span>Pilih tanggal</span>}
                                                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value ? new Date(field.value) : undefined}
                                                                onSelect={(date) => field.onChange(date?.toISOString())}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="jam_mulai_blokir"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Jam Mulai</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <FormControl>
                                                        <Input type="time" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tanggal_selesai_blokir"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="col-span-2 text-[#6C6C6C]">Tanggal Selesai</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className="w-full justify-between rounded-sm border-input text-muted-foreground"
                                                                >
                                                                    {field.value ? new Date(field.value).toLocaleDateString() : <span>Pilih tanggal</span>}
                                                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value ? new Date(field.value) : undefined}
                                                                onSelect={(date) => field.onChange(date?.toISOString())}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="jam_selesai_blokir"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Jam Selesai</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <FormControl>
                                                        <Input type="time" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="keterangan"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Keterangan</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <FormControl>
                                                        <Input placeholder="Keterangan" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline" onClick={() => { form.reset(); setIsDialogOpen(false); }}>Batal</Button>
                                        </DialogClose>
                                        <Button type="submit" variant="purple" disabled={mutation.isPending}>{mutation.isPending ? "Menyimpan..." : "Simpan"}</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <DataTable columns={columns} data={ketersediaans || []} />
            </div>
        </div>
    );
}

export default Ketersediaan;