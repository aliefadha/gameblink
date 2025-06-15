import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Dialog, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/manajemen-ketersediaan/data-table"
import { columns } from "@/components/manajemen-ketersediaan/columns"
import { PiCalendarCheckBold } from "react-icons/pi"
import { getKetersediaans } from "@/lib/api/ketersediaans"
import { getCabangs } from "@/lib/api/cabangs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react"

const FormSchema = z.object({
    nama_cabang: z.string().min(2, {
        message: "Pilih nama cabang",
    }),
    nama_unit: z.string().min(2, {
        message: "Alamat harus lebih dari 2 karakter",
    }),
    tanggal_mulai_blokir: z.string({
        required_error: "Tanggal mulai blokir harus diisi.",
        invalid_type_error: "Format tanggal tidak valid",
    }).datetime({ message: "Format tanggal tidak valid" }),
    tanggal_selesai_blokir: z.string({
        required_error: "Tanggal selesai blokir harus diisi.",
        invalid_type_error: "Format tanggal tidak valid",
    }).datetime({ message: "Format tanggal tidak valid" }),
    jam_selesai_blokir: z.string(),
    jam_mulai_blokir: z.string(),
    keterangan: z.string().min(2, {
        message: "Keterangan harus lebih dari 2 karakter",
    }),
    status: z.enum(["Aktif", "Tidak Aktif"]),
})
    .refine((data) => {
        // Combine date and time for start datetime
        const startDateTime = new Date(data.tanggal_mulai_blokir);
        if (data.jam_mulai_blokir) {
            const [hours, minutes] = data.jam_mulai_blokir.split(':');
            startDateTime.setHours(parseInt(hours), parseInt(minutes));
        }

        // Combine date and time for end datetime
        const endDateTime = new Date(data.tanggal_selesai_blokir);
        if (data.jam_selesai_blokir) {
            const [hours, minutes] = data.jam_selesai_blokir.split(':');
            endDateTime.setHours(parseInt(hours), parseInt(minutes));
        }

        return endDateTime > startDateTime;
    }, {
        message: "Tanggal dan jam selesai blokir tidak valid",
        path: ["tanggal_selesai_blokir"],
    });

function Ketersediaan() {

    const { data: ketersediaans, isLoading, error } = useQuery({
        queryKey: ['ketersediaans'],
        queryFn: getKetersediaans,
    });

    const { data: cabangs, isLoading: isLoadingCabang, error: errorCabang } = useQuery({
        queryKey: ['cabangs'],
        queryFn: getCabangs
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nama_cabang: "",
            nama_unit: "",
            tanggal_mulai_blokir: "",
            jam_mulai_blokir: "",
            tanggal_selesai_blokir: "",
            jam_selesai_blokir: "",
            keterangan: "",
            status: "Aktif",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
    }

    if (isLoading || isLoadingCabang) {
        return <div>Loading bookings...</div>;
    }

    if (error || errorCabang) {
        return <div>Error</div>;
    }

    return (
        <div className="p-10 flex flex-col gap-y-4 ">
            <div className="flex md:flex-row flex-col justify-between gap-y-4">
                <div>
                    <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                        <PiCalendarCheckBold size={24} />
                        <span>Manajemen Ketersediaan</span>
                    </h1>
                </div>
                <div>
                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <Button variant="purple" className="w-full">+ Tambah Data</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="text-[#61368E] font-bold text-xl">Tambah Data</DialogTitle>
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
                                                    <FormLabel className="text-[#6C6C6C] col-span-2">Cabang</FormLabel>
                                                    <div className="col-span-4 col-start-3 w-full">
                                                        <FormControl>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full">
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
                                                        <FormControl>
                                                            <Input placeholder="Unit" className="bg-[#F8F5F5] rounded-sm" {...field} />
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
                                                    <FormLabel className="col-span-2 text-[#6C6C6C]">
                                                        Tanggal Mulai Blokir
                                                    </FormLabel>
                                                    <div className="col-span-4 col-start-3 w-full">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className="w-full justify-between rounded-sm border-input text-muted-foreground"
                                                                    >
                                                                        {/* field.value is now a string, so create a Date from it for display */}
                                                                        {field.value ? (
                                                                            new Date(field.value).toLocaleDateString()
                                                                        ) : (
                                                                            <span>Pilih tanggal</span> // "Select date" in Indonesian
                                                                        )}
                                                                        <ChevronDownIcon />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    captionLayout="dropdown"
                                                                    selected={field.value ? new Date(field.value) : undefined}
                                                                    onSelect={(date) => {
                                                                        if (date) {
                                                                            field.onChange(date.toISOString());
                                                                        }
                                                                    }}
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
                                                    <FormLabel className="text-[#6C6C6C] col-span-2">Jam Mulai Blokir</FormLabel>
                                                    <div className="col-span-4 col-start-3 w-full">
                                                        <FormControl>
                                                            <Input placeholder="Jam mulai blokir" className="bg-[#F8F5F5] rounded-sm" type="time" {...field} />
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
                                                    <FormLabel className="col-span-2 text-[#6C6C6C]">
                                                        Tanggal Selesai Blokir
                                                    </FormLabel>
                                                    <div className="col-span-4 col-start-3 w-full">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className="w-full justify-between rounded-sm border-input text-muted-foreground"
                                                                    >
                                                                        {field.value ? (
                                                                            new Date(field.value).toLocaleDateString()
                                                                        ) : (
                                                                            <span>Pilih tanggal</span> // "Select date" in Indonesian
                                                                        )}
                                                                        <ChevronDownIcon />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    captionLayout="dropdown"
                                                                    selected={field.value ? new Date(field.value) : undefined}
                                                                    onSelect={(date) => {
                                                                        if (date) {
                                                                            field.onChange(date.toISOString());
                                                                        }
                                                                    }}
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
                                                    <FormLabel className="text-[#6C6C6C] col-span-2">Jam Selesai Blokir</FormLabel>
                                                    <div className="col-span-4 col-start-3 w-full">
                                                        <FormControl>
                                                            <Input placeholder="Jam selesai blokir" className="bg-[#F8F5F5] rounded-sm" type="time" {...field} />
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
                                                            <Input placeholder="Alamat" className="bg-[#F8F5F5] rounded-sm" {...field} />
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
                                                                    <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
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
                                                <Button variant="outline">Batal</Button>
                                            </DialogClose>
                                            <Button type="submit" variant="purple">Simpan</Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </form>
                    </Dialog>
                </div>
            </div>
            <div>
                <DataTable columns={columns} data={ketersediaans || []} />
            </div>
        </div>
    )
}

export default Ketersediaan