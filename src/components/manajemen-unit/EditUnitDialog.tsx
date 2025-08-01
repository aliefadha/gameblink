import { DialogContent, Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Unit } from "@/types/Unit";
import { updateUnit } from "@/lib/api/units";
import { unitFormSchema, type UnitFormData } from "@/lib/validations/unit.schema";
import { consoleOptions } from "@/lib/consoleOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditUnitDialogProps {
    unit: Unit;
}

export function EditUnitDialog({ unit }: EditUnitDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<UnitFormData>({
        resolver: zodResolver(unitFormSchema),
        defaultValues: {
            cabang_id: unit.cabang_id,
            nama_unit: unit.nama_unit,
            jenis_konsol: unit.jenis_konsol,
            harga: unit.harga,
        },
    });

    const mutation = useMutation({
        mutationFn: (data: UnitFormData) => updateUnit(unit.id, data),
        onSuccess: () => {
            toast.success("Unit berhasil diperbarui!");
            queryClient.invalidateQueries({ queryKey: ['units'] });
            setIsOpen(false);
        },
        onError: (error) => {
            toast.error(`Gagal mengubah data: ${error.message}`);
        }
    });



    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            form.reset({
                cabang_id: unit.cabang_id,
                nama_unit: unit.nama_unit,
                jenis_konsol: unit.jenis_konsol,
                harga: unit.harga,
            });
        }
    };



    const onSubmit = (data: UnitFormData) => {
        mutation.mutate(data);
    };


    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className="text-[#009B4F]">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-[#61368E] font-bold text-xl">Edit Unit</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Edit detail unit
                </DialogDescription>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                <Button variant="outline" onClick={() => { setIsOpen(false); form.reset(); }}>Batal</Button>
                            </DialogClose>
                            <Button type="submit" variant="purple">Simpan</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}