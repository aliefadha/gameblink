import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BiHomeAlt } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DataTable } from "@/components/manajemen-unit/data-table";
import { useQuery } from "@tanstack/react-query";
import { getUnits } from "@/api/units";
import { columns } from "@/components/manajemen-unit/columns";

const FormSchema = z.object({
    nama_unit: z.string().min(2, {
        message: "Nama Unit harus lebih dari 2 karakter",
    }),
    jenis_konsol: z.string().min(2, {
        message: "Jenis konsol harus lebih dari 2 karakter",
    }),
    harga: z.coerce.number().min(1, {
        message: "Harga harus lebih dari 0",
    }),
})

function Unit() {

    const { data: units, isLoading, error } = useQuery({
        queryKey: ['units'],
        queryFn: getUnits,
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nama_unit: "",
            jenis_konsol: "",
            harga: 0,
        },
    })

    if (isLoading) {
        return <div>Loading units...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
    }

    return (
        <div className="p-10 flex flex-col gap-y-4 ">
            <div className="flex items-center gap-x-8">
                <div>
                    <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                        <BiHomeAlt size={24} />
                        <span>Manajemen Unit</span>
                    </h1>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="max-w-xs">
                        <Button variant="purple" className="w-full">
                            <div className="flex items-center justify-between w-full">
                                <h1 className="flex items-center gap-x-2">
                                    <BiHomeAlt size={16} />
                                    <span className="font-semibold">Cabang</span>
                                </h1>
                                <MdKeyboardArrowDown size={24} />
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[calc(100vw-4rem)] sm:w-96" align="center">
                        <DropdownMenuLabel>Cabang</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Cabang 1
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-col md:flex-row items-center gap-y-2 justify-between w-full">
                            <h1 className="text-[#61368E] font-bold text-base md:text-xl">
                                Tarandam
                            </h1>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="purple" size="xl">+ Unit</Button>
                                </DialogTrigger>
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
                                                            <FormControl>
                                                                <Input placeholder="Jenis Konsol" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="harga"
                                                render={({ field }) => {
                                                    const displayValue = field.value ? `Rp ${Number(field.value).toLocaleString('id-ID')}` : '';
                                                    return (
                                                        <FormItem className="grid grid-cols-6 items-center gap-2">
                                                            <FormLabel className="text-[#6C6C6C] col-span-2">Harga</FormLabel>
                                                            <div className="col-span-4 col-start-3 w-full">
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Rp 0"
                                                                        className="bg-[#F8F5F5] rounded-sm"
                                                                        type="text"
                                                                        value={displayValue}
                                                                        onChange={(e) => {
                                                                            const value = e.target.value.replace(/[^\d]/g, '');
                                                                            field.onChange(value === '' ? 0 : parseInt(value, 10));
                                                                        }}
                                                                        onBlur={() => {
                                                                            field.onBlur();
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </div>
                                                        </FormItem>
                                                    );
                                                }}
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
                            </Dialog>
                        </div>
                    </CardTitle>
                    <DataTable columns={columns} data={units || []} />
                </CardHeader>
            </Card>
        </div>
    )
}

export default Unit;