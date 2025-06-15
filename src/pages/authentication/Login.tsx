import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";


const loginSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        try {
            await login(values);
            toast.success('Login berhasil!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(String(error));
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[url('/images/bg-login.png')] bg-cover">
            <Card className="w-full max-w-[250px] md:max-w-xl lg:max-w-3xl py-20">
                <CardHeader className="items-center text-center">
                    <div className="flex items-center">
                        <img src="/images/logo-login.png" alt="logo" className="mx-auto w-[300px] h-[80px] object-cover" />
                    </div>
                </CardHeader>
                <CardContent className="max-w-[250px] md:max-w-lg lg:max-w-2xl w-full mx-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Example@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kata Sandi</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="At least 8 characters" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-green-600 text-white hover:bg-green-700"
                            >
                                Masuk
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login;