import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LuCalendarDays, LuClipboardList, LuUsers } from "react-icons/lu"
import { useState } from "react"
import { useQuery } from '@tanstack/react-query';
import { DataTable } from "@/components/manajemen-booking/data-table"
import { columns } from "@/components/manajemen-booking/columns"
import { getBookings } from "@/lib/api/bookings"
import { format } from 'date-fns';

function Booking() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [bookingType, setBookingType] = useState<string>('all');

    const { data: bookings, isLoading, refetch } = useQuery({
        queryKey: ['bookings', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined, bookingType],
        queryFn: () => getBookings(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined, bookingType === 'all' ? undefined : bookingType),
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
                                onSelect={date => setSelectedDate(date || undefined)}
                                className="rounded-lg border shadow-sm"
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Select value={bookingType} onValueChange={setBookingType}>
                        <SelectTrigger className="w-full sm:w-48">
                            <div className="flex items-center gap-x-2">
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
            <DataTable columns={columns} data={bookings || []} isLoading={isLoading} onRefetch={refetch} />
        </div>
    )
}

export default Booking