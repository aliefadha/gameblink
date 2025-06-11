import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu"
import { LuCalendarDays, LuClipboardList } from "react-icons/lu"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { useQuery } from '@tanstack/react-query';
import { getBookings } from "@/api/bookings"
import { DataTable } from "@/components/manajemen-booking/data-table"
import { columns } from "@/components/manajemen-booking/columns"

function Booking() {
    const { data: bookings, isLoading, error } = useQuery({
        queryKey: ['bookings'],
        queryFn: getBookings,
    });


    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(2025, 5, 9),
        to: new Date(2025, 5, 26),
    })

    if (isLoading) {
        return <div>Loading bookings...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    return (
        <div className="p-10 flex flex-col gap-y-4 mb-10 ">
            <div className="flex gap-x-20">
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
                                    <span className="font-semibold">Pilih Tanggal</span>
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-fit z-10">
                        <Calendar
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            className="rounded-lg border shadow-sm"
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <DataTable columns={columns} data={bookings || []} />
        </div>
    )
}

export default Booking