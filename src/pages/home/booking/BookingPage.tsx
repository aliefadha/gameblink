import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import useFormStore, { type StepOneData } from "@/store/UseFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

const bookingSchema = z.object({
    nama: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
    noHp: z.string().min(10, { message: 'Nomor HP minimal 10 karakter' }),
    email: z.string({ message: 'Email harus diisi' }).email({ message: 'Email tidak valid' })
});

function BookingPage() {
    const navigate = useNavigate();
    const { setData } = useFormStore();
    const [phoneDisplay, setPhoneDisplay] = useState('');

    const form = useForm<z.infer<typeof bookingSchema>>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            nama: '',
            noHp: '',
            email: '',
        },
    });

    const formatPhoneNumber = (value: string) => {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');

        if (digits.length === 0) {
            return '';
        }

        // Remove leading 0 if present (convert 08xxx to 8xxx)
        let cleanDigits = digits.startsWith('0') ? digits.slice(1) : digits;

        // Limit to 12 digits (Indonesian mobile numbers are typically 10-12 digits after country code)
        cleanDigits = cleanDigits.slice(0, 12);

        // Format as 8xxx-xxxx-xxxx
        let formatted = cleanDigits;
        if (cleanDigits.length > 4) {
            formatted = cleanDigits.slice(0, 4) + '-' + cleanDigits.slice(4, 8);
            if (cleanDigits.length > 8) {
                formatted += '-' + cleanDigits.slice(8);
            }
        }

        return formatted;
    };

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhoneNumber(value);
        setPhoneDisplay(formatted);

        // Store the clean digits for form validation
        const digits = value.replace(/\D/g, '');

        // If no digits, clear the form value
        if (digits.length === 0) {
            form.setValue('noHp', '');
            return;
        }

        // Remove leading 0 if present and add 62 prefix for storage
        let cleanNumber = digits.startsWith('0') ? digits.slice(1) : digits;
        cleanNumber = '62' + cleanNumber;

        form.setValue('noHp', cleanNumber);
    };

    const onSubmit = (data: StepOneData) => {
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
                            control={form.control} name="noHp"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-xs">No HP</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 pointer-events-none z-10">
                                                +62
                                            </div>
                                            <Input
                                                placeholder="8xxx-xxxx-xxxx"
                                                value={phoneDisplay}
                                                onChange={(e) => handlePhoneChange(e.target.value)}
                                                className="h-[40px] text-xs bg-[#F8F5F5] pl-12"
                                                inputMode="tel"
                                            />
                                        </div>
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