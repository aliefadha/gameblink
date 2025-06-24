import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BiHomeAlt } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable } from "@/components/manajemen-unit/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUnit, getUnitsByCabang } from "@/lib/api/units";
import { columns } from "@/components/manajemen-unit/columns";
import { getCabangs } from "@/lib/api/cabangs";
import { useEffect, useState } from "react";
import type { Cabang } from "@/types/Cabang";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TableSkeleton } from "@/components/manajemen-unit/table-skeleton";
import { toast } from "sonner";
import { unitFormSchema, type UnitFormData } from "@/lib/validations/unit.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { consoleOptions } from "@/lib/consoleOptions";

function Unit() {

    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cabang, setCabang] = useState<Cabang | null>(null);

    const { data: units, isLoading, error: unitsError } = useQuery({
        queryKey: ['units', cabang?.id],
        queryFn: async () => {
            if (!cabang?.id) return [];
            try {
                return await getUnitsByCabang(cabang.id);
            } catch (error: unknown) {
                if (error instanceof Error && error.message.includes("Status: 404")) {
                    return [];
                }
                throw error;
            }
        },
        enabled: !!cabang
    });

    const { data: cabangs, isLoading: isLoadingCabang, error: cabangsError } = useQuery({
        queryKey: ['cabangs'],
        queryFn: async () => {
            try {
                return await getCabangs();
            } catch (error: unknown) {
                if (error instanceof Error && error.message.includes("Status: 404")) {
                    return [];
                }
                throw error;
            }
        },
    });

    const form = useForm<UnitFormData>({
        resolver: zodResolver(unitFormSchema),
        defaultValues: {
            cabang_id: "",
            nama_unit: "",
            jenis_konsol: "",
            harga: 0,
        },
    })

    useEffect(() => {
        if (cabang) {
            form.setValue('cabang_id', cabang.id);
        }
    }, [cabang, form]);

    const mutation = useMutation({
        mutationFn: createUnit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['units', cabang?.id] });
            toast.success("Unit berhasil ditambahkan");
            setIsDialogOpen(false);
            form.reset({
                cabang_id: cabang?.id || "",
                nama_unit: "",
                jenis_konsol: "",
                harga: 0,
            });
        },
        onError: (error) => {
            toast.error(`Gagal menambahkan unit: ${error.message}`);
        }
    })

    function onSubmit(data: UnitFormData) {
        mutation.mutate(data);
    }

    const renderTableContent = () => {
        if (!cabang) {
            return <div className="text-center p-10">Silakan pilih cabang untuk melihat unit.</div>;
        }
        if (isLoading) {
            return <TableSkeleton />;
        }
        if (unitsError) {
            return <div className="text-center p-10 text-red-600">Terjadi kesalahan: {unitsError.message}</div>;
        }
        if (!units || units.length === 0) {
            return <div className="text-center p-10">Tidak ada unit yang ditemukan untuk cabang ini.</div>;
        }
        return <DataTable columns={columns} data={units} />;
    };

    return (
        <div className="p-10 flex flex-col gap-y-4 ">
            <div className="flex flex-col md:flex-row gap-y-4 justify-between">
                <div>
                    <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                        <BiHomeAlt size={24} />
                        <span>Manajemen Unit</span>
                    </h1>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="w-full max-w-full md:max-w-3xs lg:max-w-xs">
                        <Button variant="purple" className="w-full" disabled={isLoadingCabang}>
                            <div className="flex items-center justify-between w-full">
                                <h1 className="flex items-center gap-x-2">
                                    <BiHomeAlt size={16} />
                                    <span className="font-semibold">
                                        {isLoadingCabang ? "Loading Cabang..." : cabang?.nama_cabang || "Pilih Cabang"}
                                    </span>
                                </h1>
                                <MdKeyboardArrowDown size={24} />
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[calc(100vw-4rem)] sm:w-[calc(100vw-20rem)] md:w-96" align="center">
                        <DropdownMenuLabel>Pilih Cabang</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {isLoadingCabang && <DropdownMenuItem disabled>Memuat cabang...</DropdownMenuItem>}
                        {cabangsError && <DropdownMenuItem disabled className="text-red-600">Gagal memuat cabang</DropdownMenuItem>}
                        {!isLoadingCabang && !cabangsError && (!cabangs || cabangs.length === 0) && (
                            <DropdownMenuItem disabled>Tidak ada cabang ditemukan</DropdownMenuItem>
                        )}
                        {cabangs?.map((cabang) => (
                            <DropdownMenuItem key={cabang.id} onClick={() => setCabang(cabang)}>
                                {cabang.nama_cabang}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Card>
                <CardHeader className="gap-y-4">
                    <CardTitle>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-y-2 justify-between w-full ">
                            <h1 className="text-[#61368E] font-bold text-base md:text-xl">
                                {cabang?.nama_cabang || "Pilih Cabang"}
                            </h1>
                            <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="inline-block">
                                                <DialogTrigger asChild>
                                                    <Button variant="purple" size="xl" disabled={!cabang} >
                                                        + Unit
                                                    </Button>
                                                </DialogTrigger>
                                            </div>
                                        </TooltipTrigger>
                                        {!cabang && (
                                            <TooltipContent>
                                                <p>Pilih cabang terlebih dahulu untuk menambah unit.</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </TooltipProvider>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle className="text-[#61368E] font-bold text-xl">Tambah Unit</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription className="sr-only">
                                        Deskripsi
                                    </DialogDescription>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="cabang_id"
                                                render={({ field }) => (
                                                    <FormItem className="grid grid-cols-6 items-center gap-2 sr-only">
                                                        <FormLabel className="text-[#6C6C6C] col-span-2">Nama Cabang</FormLabel>
                                                        <div className="col-span-4 col-start-3 w-full">
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Nama Cabang"
                                                                    className="bg-[#F8F5F5] rounded-sm"
                                                                    disabled
                                                                    {...field}
                                                                    value={cabang?.id || ''}
                                                                />
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
                                                        <FormLabel className="text-[#6C6C6C] col-span-2">Nama Unit</FormLabel>
                                                        <div className="col-span-4 col-start-3 w-full">
                                                            <FormControl>
                                                                <Input placeholder="Nama Unit" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="jenis_konsol"
                                                render={({ field }) => (
                                                    <FormItem className="grid grid-cols-6 items-center gap-2">
                                                        <FormLabel className="text-[#6C6C6C] col-span-2">Jenis Konsol</FormLabel>
                                                        <div className="col-span-4 col-start-3 w-full">
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="bg-[#F8F5F5] rounded-sm">
                                                                        <SelectValue placeholder="Pilih jenis konsol" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {consoleOptions.map((option) => (
                                                                        <SelectItem key={option} value={option}>
                                                                            {option}
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
                                                name="harga"
                                                render={({ field }) => (
                                                    <FormItem className="grid grid-cols-6 items-center gap-2">
                                                        <FormLabel className="text-[#6C6C6C] col-span-2">Harga</FormLabel>
                                                        <div className="col-span-4 col-start-3 w-full">
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Rp 0"
                                                                    className="bg-[#F8F5F5] rounded-sm"
                                                                    type="text"
                                                                    value={field.value ? `Rp ${Number(field.value).toLocaleString('id-ID')}` : ''}
                                                                    onChange={(e) => {
                                                                        const rawValue = e.target.value.replace(/[^\d]/g, '');
                                                                        const numberValue = rawValue ? parseInt(rawValue, 10) : 0;
                                                                        field.onChange(numberValue);
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline" onClick={() => { setIsDialogOpen(false); form.reset(); }}>Batal</Button>
                                                </DialogClose>
                                                <Button type="submit" variant="purple">Simpan</Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    {renderTableContent()}
                </CardContent>
            </Card>
        </div>
    )
}

export default Unit;