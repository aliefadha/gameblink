import { getCabangs } from "@/lib/api/cabangs"
import { getBookings } from "@/lib/api/bookings"
import { getKetersediaans } from "@/lib/api/ketersediaans"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Cabang } from "@/types/Cabang"
import type { Ketersediaan } from "@/types/Ketersediaan"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { BiHomeAlt } from "react-icons/bi"
import { IoFlagOutline } from "react-icons/io5"
import { LuCalendarDays } from "react-icons/lu"
import { MdKeyboardArrowDown } from "react-icons/md"
import { getUnitsByCabang } from "@/lib/api/units"

function DaftarBooking() {

    const [cabang, setCabang] = useState<Cabang | null>(null);

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

    const timeSlots = Array.from({ length: 12 }, (_, i) => `${10 + i}.00`);

    const { data: bookings } = useQuery({
        queryKey: [
            'bookings',
            cabang?.id,
            selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined
        ],
        queryFn: async () => {
            if (!cabang?.id || !selectedDate) return [];
            const allBookings = await getBookings(format(selectedDate, 'yyyy-MM-dd'));
            return allBookings.filter((b: import("@/types/Booking").Booking) => b.cabang_id === cabang.id);
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
            
            if (ketersediaan.status_perbaikan !== "Selesai" && ketersediaan.status_perbaikan !== "Pending") {
                return false;
            }
            
            const startDate = format(new Date(ketersediaan.tanggal_mulai_blokir), 'yyyy-MM-dd');
            const endDate = ketersediaan.tanggal_selesai_blokir ? format(new Date(ketersediaan.tanggal_selesai_blokir), 'yyyy-MM-dd') : null;
            
            if (dateStr < startDate) {
                return false;
            }
            
            const currentTime = parseInt(time.replace('.00', ''));
            const startTime = parseInt(ketersediaan.jam_mulai_blokir.replace('.00', ''));
            
            // If we're on the start date, check if current time is after jam_mulai_blokir
            if (dateStr === startDate && currentTime < startTime) {
                return false;
            }
            
            // For Pending status: block from start date and time onwards (no end time)
            if (ketersediaan.status_perbaikan === "Pending") {
                return true;
            }
            
            // For Selesai status: check end date and time constraints
            if (ketersediaan.status_perbaikan === "Selesai") {
                if (endDate && dateStr > endDate) {
                    return false;
                }
                
                const endTime = ketersediaan.jam_selesai_blokir ? parseInt(ketersediaan.jam_selesai_blokir.replace('.00', '')) : null;
                
                // If we're on the end date, check if current time is before jam_selesai_blokir
                if (endDate && dateStr === endDate && endTime && currentTime > endTime) {
                    return false;
                }
                
                // For dates in between, block all times
                if (dateStr > startDate && (!endDate || dateStr < endDate)) {
                    return true;
                }
                
                // For start and end dates, check if time is within the blocking range
                if (dateStr === startDate || (endDate && dateStr === endDate)) {
                    if (endTime) {
                        return currentTime >= startTime && currentTime <= endTime;
                    } else {
                        return currentTime >= startTime;
                    }
                }
            }
            
            return false;
        });
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
                        <DropdownMenuContent align="center" className="w-fit z-10">
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
                                <p>Dipesan</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <div className="h-[15px] w-[15px] bg-[#009B4F] rounded-full"></div>
                                <p>Aktif</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <div className="h-[15px] w-[15px] bg-gray-600 rounded-full"></div>
                                <p>Diblokir</p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {(units ?? []).length > 0 && (
                        <div key={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'no-date'} className="w-full overflow-x-auto">
                            <table className="min-w-max w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-xs font-bold text-[#2F2F2F] text-left p-2 w-[85px]">Jam</th>
                                        {units?.map((unit) => (
                                            <th key={unit.id} className="text-center p-2 w-[150px]">
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
                                            <td className="text-xs font-bold text-[#2F2F2F] p-2">{time}</td>
                                            {units?.map((unit) => {
                                                const isBooked = (bookings ?? []).some((booking: import("@/types/Booking").Booking) =>
                                                    booking.booking_details?.some((detail: import("@/types/Booking").BookingDetail) =>
                                                        detail.unit_id === unit.id &&
                                                        detail.jam_main === time &&
                                                        format(new Date(detail.tanggal), 'yyyy-MM-dd') === (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '')
                                                    )
                                                );
                                                
                                                const isBlocked = selectedDate ? isUnitBlocked(unit.nama_unit, time, selectedDate) : false;
                                                
                                                return (
                                                    <td key={`${time}-${unit.id}`} className="text-center p-2 w-[150px]">
                                                        <Button
                                                            className={`w-full ${
                                                                isBooked 
                                                                    ? "bg-[#D31A1D] text-white hover:bg-[#D31A1D] cursor-not-allowed booked"
                                                                    : isBlocked 
                                                                    ? "bg-gray-600 text-white hover:bg-gray-600 cursor-not-allowed blocked" 
                                                                    : "bg-[#F8F5F5] hover:bg-gray-200"
                                                            }`}
                                                            size="sm"
                                                        >
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
        </div>
    )
}

export default DaftarBooking