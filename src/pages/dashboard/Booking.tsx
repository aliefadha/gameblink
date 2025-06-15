import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu"
import { LuCalendarDays, LuClipboardList } from "react-icons/lu"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { useQuery } from '@tanstack/react-query';
import { getBookings } from "@/lib/api/bookings"
import { DataTable } from "@/components/manajemen-booking/data-table"
import { columns } from "@/components/manajemen-booking/columns"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

function Booking() {
    const { data: bookings, isLoading, error } = useQuery({
        queryKey: ['bookings'],
        queryFn: getBookings,
    });


    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(2025, 5, 9),
        to: new Date(2025, 5, 26),
    })

    if (error) {
        return (
            toast.error(error.message)
        )
    }
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
            {isLoading ? (
                <div className="rounded-md">
                    <Table>
                        <TableHeader className="bg-[#61368E] p-4 rounded-t-2xl">
                            <TableRow>
                                <TableHead className="w-[50px]">No</TableHead>
                                <TableHead>ID Booking</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Nomor HP</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Cabang</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Tanggal Main</TableHead>
                                <TableHead>Jam Main</TableHead>
                                <TableHead>Tanggal Transaksi</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[50px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index} className="text-[#61368E] p-4 font-medium">
                                    <TableCell className="text-center">
                                        <Skeleton className="h-4 w-6 mx-auto" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-28" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <DataTable columns={columns} data={bookings || []} />
            )}
        </div>
    )
}

export default Booking