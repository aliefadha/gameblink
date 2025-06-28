import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu"
import { LuCalendarDays, LuClipboardList } from "react-icons/lu"
import { useState } from "react"
import { useQuery } from '@tanstack/react-query';
import { DataTable } from "@/components/manajemen-booking/data-table"
import { columns } from "@/components/manajemen-booking/columns"
import { getBookings } from "@/lib/api/bookings"
import { format } from 'date-fns';

function Booking() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const { data: bookings, isLoading } = useQuery({
        queryKey: ['bookings', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined],
        queryFn: () => getBookings(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined),
    });



    return (
        <div className="p-10 flex flex-col gap-y-4 mb-10 ">
            <div className="flex flex-col md:flex-row gap-y-4 gap-x-20">
                <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                    <LuClipboardList size={24} />
                    <span>Manajemen Booking</span>
                </h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="w-full sm:w-1/2 max-w-3xs">
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
            </div>
            <DataTable columns={columns} data={bookings || []} isLoading={isLoading} />
        </div>
    )
}

export default Booking