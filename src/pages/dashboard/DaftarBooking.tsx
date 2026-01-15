import { getCabangs } from "@/lib/api/cabangs"
import { createWalkinBooking, getBookings } from "@/lib/api/bookings"
import { getKetersediaans } from "@/lib/api/ketersediaans"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Cabang } from "@/types/Cabang"
import type { Ketersediaan } from "@/types/Ketersediaan"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { BiHomeAlt } from "react-icons/bi"
import { IoFlagOutline } from "react-icons/io5"
import { LuCalendarDays } from "react-icons/lu"
import { MdKeyboardArrowDown } from "react-icons/md"
import { getUnitsByCabang } from "@/lib/api/units"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { BookingDetail } from "@/types/Booking";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaGamepad } from "react-icons/fa";
import { toast } from "sonner"

function DaftarBooking() {

    const [cabang, setCabang] = useState<Cabang | null>(null);
    const queryClient = useQueryClient();
    const [phoneDisplay, setPhoneDisplay] = useState('');

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

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

    const { data: units, isLoading, error: unitsError } = useQuery({
        queryKey: ['units', cabang?.id, selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined],
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

    const timeSlots = Array.from({ length: 15 }, (_, i) => `${10 + i}.00`);

    const { data: bookings } = useQuery({
        queryKey: [
            'bookings',
            cabang?.id,
            selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined
        ],
        queryFn: async () => {
            if (!cabang?.id || !selectedDate) return [];
            return await getBookings(
                format(selectedDate, 'yyyy-MM-dd'),
                format(selectedDate, 'yyyy-MM-dd'),
                undefined, // type
                cabang.id // cabang parameter
            );
        },
        enabled: !!cabang && !!selectedDate
    });

    const { data: ketersediaans } = useQuery({
        queryKey: [
            'ketersediaans',
            selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined
        ],
        queryFn: async () => {
            try {
                return await getKetersediaans();
            } catch (error: unknown) {
                if (error instanceof Error && error.message.includes("Status: 404")) {
                    return [];
                }
                throw error;
            }
        },
    });

    const isUnitBlocked = (unitName: string, time: string, date: Date): boolean => {
        if (!ketersediaans) return false;
        const dateStr = format(date, 'yyyy-MM-dd');
        return ketersediaans.some((ketersediaan: Ketersediaan) => {
            if (ketersediaan.nama_unit !== unitName || ketersediaan.nama_cabang !== cabang?.nama_cabang) {
                return false;
            }

            const startDate = format(new Date(ketersediaan.tanggal_mulai_blokir), 'yyyy-MM-dd');
            const currentTime = parseInt(time.replace('.00', ''));
            const startTime = parseInt(ketersediaan.jam_mulai_blokir.replace('.00', ''));

            if (ketersediaan.status_perbaikan === "Selesai") {
                if (!ketersediaan.tanggal_selesai_blokir || !ketersediaan.jam_selesai_blokir) {
                    return false;
                }

                const endDate = format(new Date(ketersediaan.tanggal_selesai_blokir), 'yyyy-MM-dd');
                const endTime = parseInt(ketersediaan.jam_selesai_blokir.replace('.00', ''));

                if (dateStr < startDate) return false;
                if (dateStr === startDate && currentTime < startTime) return false;

                if (dateStr > endDate) return false;
                if (dateStr === endDate && currentTime > endTime) return false;

                return true;
            }
            return false;
        });
    };

    const [selectedCells, setSelectedCells] = useState<{ unitId: string; time: string }[]>([]);
    const [pricingTypes, setPricingTypes] = useState<{ [key: string]: 'booking' | 'promo' }>({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [bookingDetailsData, setBookingDetailsData] = useState<BookingDetail[]>([]);

    useEffect(() => {
        setSelectedCells([]);
        setPricingTypes({});
        setBookingDetailsData([]);
    }, [selectedDate]);

    const bookingSchema = z.object({
        nama: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
        noHp: z.string().min(1, { message: 'Nomor HP harus diisi' }),
        email: z.string({ message: 'Email harus diisi' }).email({ message: 'Email tidak valid' }),
        metodePembayaran: z.enum(['nontunai', 'tunai'], { required_error: 'Metode pembayaran harus dipilih' }),
    });
    const form = useForm<z.infer<typeof bookingSchema>>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            nama: '',
            noHp: '',
            email: '',
            metodePembayaran: 'tunai',
        },
    });

    const handleBookingSubmit = async (values: z.infer<typeof bookingSchema>) => {
        if (!cabang || !selectedDate || selectedCells.length === 0) return;
        setSubmitStatus('idle');
        setSubmitError(null);
        try {
            const tanggal_main = format(selectedDate, 'yyyy-MM-dd') + 'T00:00:00.000Z';
            const tanggal_transaksi = format(new Date(), 'yyyy-MM-dd') + 'T00:00:00.000Z';
            const booking_details = bookingDetailsData.length > 0 ? bookingDetailsData : selectedCells.map(cell => {
                const unit = units?.find(u => u.id === cell.unitId);
                const cellKey = `${cell.unitId}-${cell.time}`;
                const pricingType = pricingTypes[cellKey] || 'booking';
                const price = pricingType === 'promo' ? 0 : (unit?.harga || 0);
                return {
                    unit_id: cell.unitId,
                    jam_main: cell.time,
                    harga: price,
                    tanggal: format(selectedDate, 'yyyy-MM-dd') + 'T00:00:00.000Z',
                };
            });
            const total_harga = booking_details.reduce((sum, d) => sum + d.harga, 0);
            const payload = {
                nama: values.nama,
                nomor_hp: values.noHp,
                email: values.email,
                cabang_id: cabang.id,
                tanggal_main,
                tanggal_transaksi,
                total_harga,
                status_booking: "Aktif",
                booking_type: "Walkin",
                booking_details,
                metode_pembayaran: values.metodePembayaran,
            };
            await createWalkinBooking(payload);
            await queryClient.invalidateQueries({
                queryKey: [
                    'bookings',
                    cabang?.id,
                    selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined
                ]
            });
            toast.success('Booking berhasil dibuat!');
            setSubmitStatus('success');
            setSelectedCells([]);
            setPricingTypes({});
            setBookingDetailsData([]);
            form.reset();
            setPhoneDisplay('');
            setDialogOpen(false);
        } catch (err: unknown) {
            setSubmitStatus('error');
            if (err instanceof Error) {
                setSubmitError(err.message);
            } else {
                setSubmitError('Gagal membuat booking');
            }
        }
    };

    return (
        <div className="p-10 flex flex-col gap-y-4 mb-10 ">
            <div className="flex flex-col md:flex-row gap-y-4 gap-x-20">
                <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                    <IoFlagOutline size={24} />
                    <span>Manajemen Booking</span>
                </h1>
                <div className="flex flex-col lg:flex-row gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-full lg:w-1/2 max-w-3xs">
                            <Button variant="purple" className="w-full">
                                <div className="flex items-center justify-between w-full">
                                    <h1 className="flex items-center gap-x-2">
                                        <BiHomeAlt size={16} />
                                        <span className="font-semibold">{cabang?.nama_cabang || "Pilih Cabang"}</span>
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-full lg:w-1/2 max-w-3xs">
                            <Button variant="outline" className="w-full bg-transparent" disabled={!cabang}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-x-2">
                                        <LuCalendarDays size={16} />
                                        <span className="font-semibold">{selectedDate ? format(selectedDate, 'dd MMMM yyyy') : "Pilih Tanggal"}</span>
                                    </div>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-full z-10">
                            <Calendar
                                mode="single"
                                defaultMonth={selectedDate}
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-lg border shadow-sm"
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <Card>
                <CardHeader className="gap-y-4">
                    <div className="flex  items-center gap-y-2 justify-between w-full ">
                        <h1 className="text-[#61368E] font-bold text-base md:text-xl">
                            {cabang?.nama_cabang || "Pilih Cabang"}
                        </h1>
                        <div className="flex gap-x-4 text-sm">
                            <div className="flex gap-x-2 items-center">
                                <div className="h-[15px] w-[15px] bg-[#F8F5F5] rounded-full"></div>
                                <p>Tersedia</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <div className="h-[15px] w-[15px] bg-[#D31A1D] rounded-full"></div>
                                <p>Terisi</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <div className="h-[15px] w-[15px] bg-[#009B4F] rounded-full"></div>
                                <p>Aktif</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <div className="h-[15px] w-[15px] bg-gray-600 rounded-full"></div>
                                <p>Diblokir</p>
                            </div>
                            {selectedCells.length > 0 && (
                                <div>
                                    <Button variant="purple" onClick={() => {
                                        if (selectedCells.length > 0) {
                                            setDialogOpen(true);
                                        } else {
                                            toast.error('Pilih minimal satu slot waktu untuk booking');
                                        }
                                    }}>
                                        <FaGamepad size={16} />  ({selectedCells.length})
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {(units ?? []).length > 0 && (
                        <div key={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'no-date'} className="w-full overflow-x-auto">
                            <table className="min-w-max w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-xs font-bold text-[#2F2F2F] text-left p-1 w-[85px] sticky left-0 bg-white z-10">Jam</th>
                                        {units?.map((unit) => (
                                            <th key={unit.id} className="text-center p-1 w-[100px]">
                                                <div className="text-center text-xs">
                                                    <div className="bg-[#61368E] rounded-t-md w-full py-2 text-white font-bold">
                                                        <p>{unit.nama_unit}</p>
                                                    </div>
                                                    <div className="bg-[#F4E9FF] rounded-b-md py-2 w-full font-medium">
                                                        <p>{unit.jenis_konsol}</p>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map((time) => (
                                        <tr key={time}>
                                            <td className="text-xs font-bold text-[#2F2F2F] p-1 sticky left-0 bg-white z-10">{time}</td>
                                            {units?.map((unit) => {
                                                const isBooked = (bookings ?? []).some((booking: import("@/types/Booking").Booking) =>
                                                    (booking.status_pembayaran === "Berhasil" || booking.status_pembayaran === "Pending") &&
                                                    booking.booking_details?.some((detail: import("@/types/Booking").BookingDetail) =>
                                                        detail.unit_id === unit.id &&
                                                        detail.jam_main === time &&
                                                        new Date(detail.tanggal).toDateString() === selectedDate?.toDateString()
                                                    )
                                                );

                                                const isBlocked = selectedDate ? isUnitBlocked(unit.nama_unit, time, selectedDate) : false;

                                                const isSelected = selectedCells.some(
                                                    (cell) => cell.unitId === unit.id && cell.time === time
                                                );

                                                return (
                                                    <td key={`${time}-${unit.id}`} className="text-center p-1 w-[150px]">
                                                        <Button
                                                            className={`w-full ${isBooked
                                                                ? "bg-[#D31A1D] text-white hover:bg-[#D31A1D] cursor-not-allowed booked"
                                                                : isBlocked
                                                                    ? "bg-gray-600 text-white hover:bg-gray-600 cursor-not-allowed blocked"
                                                                    : isSelected
                                                                        ? "bg-[#009B4F] hover:bg-green-700 text-white"
                                                                        : "bg-[#F8F5F5] hover:bg-gray-200"
                                                                }`}
                                                            size="sm"
                                                            disabled={isBooked || isBlocked}
                                                            onClick={() => {
                                                                if (isBooked || isBlocked) return;
                                                                setSelectedCells((prev) => {
                                                                    const exists = prev.some(
                                                                        (cell) => cell.unitId === unit.id && cell.time === time
                                                                    );
                                                                    if (exists) {
                                                                        // Remove from pricing types when deselecting
                                                                        const cellKey = `${unit.id}-${time}`;
                                                                        setPricingTypes(prevPricing => {
                                                                            const newPricing = { ...prevPricing };
                                                                            delete newPricing[cellKey];
                                                                            return newPricing;
                                                                        });
                                                                        return prev.filter(
                                                                            (cell) => !(cell.unitId === unit.id && cell.time === time)
                                                                        );
                                                                    } else {
                                                                        return [...prev, { unitId: unit.id, time }];
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            {isSelected ? "✓" : ""}
                                                        </Button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {unitsError && (
                        <div className="text-center p-10 text-red-600">
                            Terjadi kesalahan: {unitsError.message}
                        </div>
                    )}
                    {isLoading && (
                        <div className="text-center p-10">
                            Loading...
                        </div>
                    )}
                    {units?.length === 0 && (
                        <div className="text-center p-10">
                            Tidak ada unit yang ditemukan untuk cabang ini.
                        </div>
                    )}
                </CardContent>
            </Card>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="w-full overflow-x-auto p-4 sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Booking Unit</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="sr-only">
                        Silakan isi form di bawah ini untuk membuat booking.
                    </DialogDescription>
                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleBookingSubmit)} className="space-y-4 mt-4 w-full">
                                <FormField
                                    control={form.control}
                                    name="nama"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nama Kamu" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control} name="noHp"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>No HP</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10 text-xs text-gray-600 ">
                                                        +62
                                                    </div>
                                                    <Input
                                                        placeholder="8xxx-xxxx-xxxx"
                                                        value={phoneDisplay}
                                                        onChange={(e) => handlePhoneChange(e.target.value)}
                                                        className="pl-12"
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
                                        <FormItem >
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} inputMode="email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Metode Pembayaran */}
                                <FormField
                                    control={form.control}
                                    name="metodePembayaran"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Metode Pembayaran</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih metode pembayaran" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="nontunai">Non Tunai</SelectItem>
                                                        <SelectItem value="tunai">Tunai</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Selected Booking Details */}
                                {selectedCells.length > 0 && (
                                    <div>
                                        <div className="rounded-md">
                                            <Table>
                                                <TableHeader className="bg-[#61368E]">
                                                    <TableRow>
                                                        <TableHead className="text-white text-center">No</TableHead>
                                                        <TableHead className="text-white text-center">Unit</TableHead>
                                                        <TableHead className="text-white text-center">Konsol</TableHead>
                                                        <TableHead className="text-white text-center">Tanggal</TableHead>
                                                        <TableHead className="text-white text-center">Waktu</TableHead>
                                                        <TableHead className="text-white text-center">Tipe</TableHead>
                                                        <TableHead className="text-white text-center">Harga</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="bg-white">
                                                    {selectedCells.map((cell, index) => {
                                                        const unit = units?.find(u => u.id === cell.unitId);
                                                        const cellKey = `${cell.unitId}-${cell.time}`;
                                                        const pricingType = pricingTypes[cellKey] || 'booking';
                                                        const displayPrice = pricingType === 'promo' ? 0 : (unit?.harga || 0);
                                                        return (
                                                            <TableRow key={cellKey} className="text-[#61368E] font-medium">
                                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                                <TableCell className="text-center">{unit?.nama_unit}</TableCell>
                                                                <TableCell className="text-center">
                                                                    <span className="text-[#61368E]">
                                                                        {unit?.jenis_konsol}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    {selectedDate ? format(selectedDate, 'dd MMM yyyy') : ''}
                                                                </TableCell>
                                                                <TableCell className="text-center">{cell.time}</TableCell>
                                                                <TableCell className="text-center">
                                                                    <Select
                                                                        value={pricingType}
                                                                        onValueChange={(value: 'booking' | 'promo') => {
                                                                            setPricingTypes(prev => ({
                                                                                ...prev,
                                                                                [cellKey]: value
                                                                            }));
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="w-24 h-8 text-xs">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="booking">Booking</SelectItem>
                                                                            <SelectItem value="promo">Promo</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </TableCell>
                                                                <TableCell className="text-center font-semibold">
                                                                    Rp {displayPrice.toLocaleString('id-ID')}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                    <TableRow className="bg-[#F8F5F5] font-bold">
                                                        <TableCell colSpan={6} className="text-center text-[#61368E]">
                                                            Total Harga
                                                        </TableCell>
                                                        <TableCell className="text-center text-[#61368E] font-bold text-lg">
                                                            Rp {selectedCells.reduce((total, cell) => {
                                                                const unit = units?.find(u => u.id === cell.unitId);
                                                                const cellKey = `${cell.unitId}-${cell.time}`;
                                                                const pricingType = pricingTypes[cellKey] || 'booking';
                                                                const price = pricingType === 'promo' ? 0 : (unit?.harga || 0);
                                                                return total + price;
                                                            }, 0).toLocaleString('id-ID')}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                )}
                                {submitStatus === 'error' && (
                                    <div className="text-red-600 text-sm">{submitError}</div>
                                )}
                                <div className="flex gap-2 pt-4 justify-end">
                                    <Button type="submit" variant="purple" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Menyimpan...' : 'Buat Booking'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                        Tutup
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DaftarBooking
