import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LuCalendarDays, LuClipboardList, LuUsers } from "react-icons/lu"
import { useState } from "react"
import { useQuery } from '@tanstack/react-query';
import { DataTable } from "@/components/manajemen-booking/data-table"
import { columns } from "@/components/manajemen-booking/columns"
import { getBookings } from "@/lib/api/bookings"
import { getCabangs } from "@/lib/api/cabangs"
import { format } from 'date-fns';
import { BiHomeAlt } from "react-icons/bi"
import { MdKeyboardArrowDown } from "react-icons/md"
import type { Cabang } from "@/types/Cabang"

function Booking() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [bookingType, setBookingType] = useState<string>('all');
    const [cabang, setCabang] = useState<Cabang | null>(null);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const { data: bookings, isLoading, refetch } = useQuery({
        queryKey: ['bookings', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined, bookingType, cabang, pageSize, pageNumber],
        queryFn: () => getBookings(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined, bookingType === 'all' ? undefined : bookingType, cabang?.id, pageSize, pageNumber),
    });

    const { data: cabangs, isLoading: isLoadingCabangs } = useQuery({
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

    return (
        <div className="p-10 flex flex-col gap-y-4 mb-10 ">
            <div className="flex flex-col md:flex-row gap-y-4 gap-x-20">
                <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                    <LuClipboardList size={24} />
                    <span>Manajemen Booking</span>
                </h1>
                <div className="flex flex-col sm:flex-row gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-full sm:w-48">
                            <Button variant="purple" className="w-full">
                                <div className="flex items-center justify-between w-full">
                                    <h1 className="flex items-center gap-x-2">
                                        <BiHomeAlt size={16} />
                                        <span className="font-semibold">{cabang?.nama_cabang || "Semua Cabang"}</span>
                                    </h1>
                                    <MdKeyboardArrowDown size={24} />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[calc(100vw-4rem)] sm:w-[calc(100vw-20rem)] md:w-96" align="center">
                            <DropdownMenuLabel>Pilih Cabang</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setCabang(null);
                                setPageNumber(1);
                            }}>
                                Semua Cabang
                            </DropdownMenuItem>
                            {isLoadingCabangs && <DropdownMenuItem disabled>Memuat cabang...</DropdownMenuItem>}
                            {!isLoadingCabangs && (!cabangs || cabangs.length === 0) && (
                                <DropdownMenuItem disabled>Tidak ada cabang ditemukan</DropdownMenuItem>
                            )}
                            {cabangs?.map((cabangItem) => (
                                <DropdownMenuItem key={cabangItem.id} onClick={() => {
                                    setCabang(cabangItem);
                                    setPageNumber(1);
                                }}>
                                    {cabangItem.nama_cabang}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full bg-transparent">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-x-2">
                                        <LuCalendarDays size={16} />
                                        <span className="font-semibold">{selectedDate ? format(selectedDate, 'dd MMM yyyy') : 'Pilih Tanggal'}</span>
                                    </div>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-fit z-10">
                            <Calendar
                                mode="single"
                                defaultMonth={selectedDate}
                                selected={selectedDate}
                                onSelect={date => {
                                    setSelectedDate(date || undefined);
                                    setPageNumber(1);
                                }}
                                className="rounded-lg border shadow-sm"
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Select value={bookingType} onValueChange={(value) => {
                        setBookingType(value);
                        setPageNumber(1);
                    }}>
                        <SelectTrigger className="w-full sm:w-48 border border-[#61368E] text-[#61368E] ">
                            <div className="flex items-center gap-x-2 text-[#61368E]">
                                <LuUsers size={16} />
                                <SelectValue placeholder="Pilih Tipe Booking" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tipe</SelectItem>
                            <SelectItem value="Walkin">Walk-in</SelectItem>
                            <SelectItem value="Online">Online</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DataTable 
                columns={columns} 
                data={bookings || []} 
                isLoading={isLoading} 
                onRefetch={refetch} 
                onPageSizeChange={(newPageSize) => {
                    setPageSize(newPageSize);
                    setPageNumber(1); // Reset to first page when page size changes
                }}
                onPageChange={(pageIndex) => setPageNumber(pageIndex + 1)} // Convert 0-based index to 1-based page number
            />
        </div>
    )
}

export default Booking