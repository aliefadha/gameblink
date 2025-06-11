import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Dialog, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { BiHomeAlt } from "react-icons/bi"
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
import { getCabangs } from "@/api/cabangs"
import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/manajemen-cabang/data-table"
import { columns } from "@/components/manajemen-cabang/columns"

const FormSchema = z.object({
    nama_cabang: z.string().min(2, {
        message: "Nama harus lebih dari 2 karakter",
    }),
    alamat_cabang: z.string().min(2, {
        message: "Alamat harus lebih dari 2 karakter",
    }),
    status: z.enum(["Aktif", "Tidak Aktif"]),
})

function Cabang() {

    const { data: cabangs, isLoading, error } = useQuery({
        queryKey: ['cabangs'],
        queryFn: getCabangs,
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nama_cabang: "",
            alamat_cabang: "",
            status: "Aktif",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
    }

    if (isLoading) {
        return <div>Loading bookings...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="p-10 flex flex-col gap-y-4 ">
            <div className="flex justify-between">
                <div>
                    <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                        <BiHomeAlt size={24} />
                        <span>Manajemen Cabang</span>
                    </h1>
                </div>
                <div>
                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <Button variant="purple">+ Cabang</Button>
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
                <DataTable columns={columns} data={cabangs || []} />
            </div>
        </div>
    )
}

export default Cabang