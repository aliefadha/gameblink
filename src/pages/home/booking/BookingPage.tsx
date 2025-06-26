import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import useFormStore, { type StepOneData } from "@/store/UseFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bookingSchema = z.object({
    nama: z.string().min(1, { message: 'Nama harus diisi' }),
    noHp: z.string().min(1, { message: 'Nomor HP harus diisi' }),
    email: z.string({ message: 'Email harus diisi' }).email({ message: 'Email tidak valid' })
});

function BookingPage() {
    const navigate = useNavigate();
    const { setData } = useFormStore();
    const form = useForm<z.infer<typeof bookingSchema>>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            nama: '',
            noHp: '',
            email: '',
        },
    });

    const onSubmit = (data: StepOneData) => {
        console.log(data);
        setData({ step: 1, data });
        navigate('/booking/cabang');
    };

    return (
        <div className="py-10 max-w-[350px] md:max-w-xl lg:max-w-3xl mx-auto gap-y-6 flex flex-col h-full">
            <h1 className="font-semibold md:text-xl lg:text-2xl">Isi data pemesanan berikut</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="justify-between flex flex-col flex-1" >
                    <div className="space-y-5">
                        <FormField
                            control={form.control}
                            name="nama"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Nama</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama Kamu" {...field} className="h-[40px] text-xs bg-[#F8F5F5]" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="noHp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">No HP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+62xxxxxxxxxx" {...field} className="h-[40px] text-xs bg-[#F8F5F5]" inputMode="tel" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email Kamu" {...field} className="h-[40px] text-xs bg-[#F8F5F5]" inputMode="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /></div>
                    <div>
                        <Button
                            type="submit"
                            className="w-full bg-green-600 text-white hover:bg-green-700"
                        >
                            LANJUT
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default BookingPage;