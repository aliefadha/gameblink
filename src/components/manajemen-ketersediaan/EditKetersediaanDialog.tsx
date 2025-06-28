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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKetersediaan, type UpdateKetersediaanPayload } from "@/lib/api/ketersediaans";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { editKetersediaanFormSchema, type EditKetersediaanFormData } from "@/lib/validations/ketersediaan.schema";
import { toast } from "sonner";
import type { Ketersediaan } from "@/types/Ketersediaan";

interface EditKetersediaanDialogProps {
    ketersediaan: Ketersediaan;
}

function EditKetersediaanDialog({ ketersediaan }: EditKetersediaanDialogProps) {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<EditKetersediaanFormData>({
        resolver: zodResolver(editKetersediaanFormSchema),
        defaultValues: {
            tanggal_mulai_blokir: ketersediaan.tanggal_mulai_blokir || "",
            jam_mulai_blokir: ketersediaan.jam_mulai_blokir || "",
            tanggal_selesai_blokir: ketersediaan.tanggal_selesai_blokir || "",
            jam_selesai_blokir: ketersediaan.jam_selesai_blokir || "",
            status_perbaikan: ketersediaan.status_perbaikan || "Pending",
        },
    });

    const mutation = useMutation({
        mutationFn: (payload: UpdateKetersediaanPayload) => 
            updateKetersediaan(ketersediaan.id_ketersediaan, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ketersediaans'] });
            toast.success("Data ketersediaan berhasil diupdate");
            setIsDialogOpen(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast.error(`Gagal mengupdate data: ${error.message}`);
        }
    });

    function onSubmit(data: EditKetersediaanFormData) {
        mutation.mutate(data);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className="text-[#61368E] flex items-center gap-2">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-[#61368E] font-bold text-xl">Edit Data Ketersediaan</DialogTitle>
                    <DialogDescription className="sr-only">Edit data ketersediaan</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="tanggal_mulai_blokir"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-6 items-center gap-2 sr-only">
                                    <FormLabel className="col-span-2 text-[#6C6C6C]">Tanggal Mulai</FormLabel>
                                    <div className="col-span-4 col-start-3 w-full">
                                        <FormControl>
                                            <Input 
                                                value={field.value ? new Date(field.value).toLocaleDateString() : ""} 
                                                className="bg-[#F8F5F5] rounded-sm" 
                                                readOnly 
                                                disabled
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="jam_mulai_blokir"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-6 items-center gap-2 sr-only">
                                    <FormLabel className="text-[#6C6C6C] col-span-2">Jam Mulai</FormLabel>
                                    <div className="col-span-4 col-start-3 w-full">
                                        <FormControl>
                                            <Input 
                                                value={field.value} 
                                                className="bg-[#F8F5F5] rounded-sm" 
                                                readOnly 
                                                disabled
                                            />
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
                            name="status_perbaikan"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-6 items-center gap-2">
                                    <FormLabel className="text-[#6C6C6C] col-span-2">Status Perbaikan</FormLabel>
                                    <div className="col-span-4 col-start-3 w-full">
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Selesai">Selesai</SelectItem>
                                            </SelectContent>
                                        </Select>
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
    );
}

export default EditKetersediaanDialog; 