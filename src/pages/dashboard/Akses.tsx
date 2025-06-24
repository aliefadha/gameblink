import { columns } from "@/components/akses/columns";
import { DataTable } from "@/components/akses/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUser, getUsers } from "@/lib/api/akses";
import { omit } from "@/lib/utils";
import { userFormSchema, type UserFormData } from "@/lib/validations/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SlKey } from "react-icons/sl";
import { toast } from "sonner";

function Akses() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            try {
                return await getUsers();
            } catch (error: unknown) {
                if (error instanceof Error && error.message.includes("Status: 404")) {
                    return [];
                }
                throw error;
            }
        }
    })

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
            role: "ADMIN"
        },
    })

    const mutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success("User berhasil ditambahkan");
            setIsDialogOpen(false);
            form.reset({
                email: "",
                name: "",
                password: "",
                confirmPassword: "",
                role: "ADMIN"
            });
        },
        onError: (error) => {
            toast.error(`Gagal menambahkan user: ${error.message}`);
        }
    })

    function onSubmit(data: UserFormData) {
        const payload = omit(data, ['confirmPassword']);
        mutation.mutate(payload);
    }

    return (
        <div className="p-10 flex flex-col gap-y-4">
            <div className="flex md:flex-row flex-col justify-between gap-y-4">
                <div>
                    <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                        <SlKey size={24} />
                        <span>Akses</span>
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
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Email</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <FormControl>
                                                        <Input placeholder="Email" className="bg-[#F8F5F5] rounded-sm" {...field} type="email" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Nama</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <FormControl>
                                                        <Input placeholder="Nama" className="bg-[#F8F5F5] rounded-sm" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Password</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <FormControl>
                                                        <Input placeholder="password" className="bg-[#F8F5F5] rounded-sm" {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Konfirmasi Password</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <FormControl>
                                                        <Input placeholder="Konfirmasi Password" className="bg-[#F8F5F5] rounded-sm" {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem className="grid grid-cols-6 items-center gap-2">
                                                <FormLabel className="text-[#6C6C6C] col-span-2">Level</FormLabel>
                                                <div className="col-span-4 col-start-3 w-full">
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
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
                                            <Button variant="outline" onClick={() => { setIsDialogOpen(false); form.reset(); }}>Batal</Button>
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
            <DataTable columns={columns} data={users || []} isLoading={isLoading} />
        </div >
    )
}

export default Akses;