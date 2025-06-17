import { BiHomeAlt } from "react-icons/bi"
import { BsCheckCircle } from "react-icons/bs"
import { CiMoneyBill } from "react-icons/ci"
import { IoFlagOutline } from "react-icons/io5"
import { PiSquaresFourBold } from "react-icons/pi"
import { Chart } from "@/components/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MdKeyboardArrowDown } from "react-icons/md"
import { Calendar } from "@/components/ui/calendar"
import { LuCalendarDays } from "react-icons/lu"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { useQuery } from "@tanstack/react-query"
import { getCabangs } from "@/lib/api/cabangs"
import type { Cabang } from "@/types/Cabang"

function Dashboard() {

    const [cabang, setCabang] = useState<Cabang | null>(null)
        ;
    const { data: cabangs, isLoading, error } = useQuery({
        queryKey: ['cabangs'],
        queryFn: getCabangs,
    });
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(2025, 5, 9),
        to: new Date(2025, 5, 26),
    })

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error</div>;
    }



    return (
        <div className="p-4 sm:p-6 md:p-10 flex flex-col gap-y-3 sm:gap-y-4 overflow-y-scroll">
            <div>
                <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                    <PiSquaresFourBold size={24} />
                    <span>Dashboard</span>
                </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Booking Hari Ini */}
                <Card className="w-full bg-[#61368E]">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="flex text-white gap-x-4 items-center font-normal text-sm sm:text-base">
                                <IoFlagOutline size={24} />
                                Booking Hari Ini
                            </h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Adjusted: Starts large, grows, then scales down for 4-col layout */}
                        <h1 className="text-3xl sm:text-4xl lg:text-3xl text-white font-bold">
                            24
                        </h1>
                    </CardContent>
                </Card>

                {/* Card 2: Tersedia */}
                <Card className="w-full bg-[#61368E]">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="flex text-white gap-x-4 items-center font-normal text-sm sm:text-base">
                                <BsCheckCircle size={20} />
                                Tersedia
                            </h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Adjusted: Starts large, grows, then scales down for 4-col layout */}
                        <h1 className="text-3xl sm:text-4xl lg:text-3xl text-white font-bold">
                            35
                        </h1>
                    </CardContent>
                </Card>

                {/* Card 3: Pendapatan Hari Ini */}
                <Card className="w-full bg-[#61368E]">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="flex text-white gap-x-4 items-center font-normal text-sm sm:text-base">
                                <CiMoneyBill size={20} />
                                Pendapatan Hari Ini
                            </h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Adjusted: Corrected 'text-md', added responsive scaling */}
                        <h1 className="text-2xl sm:text-3xl lg:text-2xl text-white font-bold">
                            Rp452.000
                        </h1>
                    </CardContent>
                </Card>

                {/* Card 4: Cabang Paling Laris */}
                <Card className="w-full bg-[#61368E]">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="flex text-white gap-x-4 items-center font-normal text-sm sm:text-base">
                                <BiHomeAlt size={20} />
                                Cabang Paling Laris
                            </h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Adjusted: Corrected 'text-md', added responsive scaling */}
                        <h1 className="text-2xl sm:text-3xl lg:text-2xl text-white font-bold">
                            Tarandam
                        </h1>
                    </CardContent>
                </Card>
            </div>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-col lg:flex-row gap-y-2 justify-between w-full">
                            <h1 className="text-[#61368E] font-bold text-base md:text-xl">
                                Statistik Jumlah Booking
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-2 justify-end w-full lg:w-1/2">
                                <DropdownMenu>
                                    {/* The `disabled` prop is added to the trigger */}
                                    <DropdownMenuTrigger asChild className="w-full sm:w-1/2" disabled={!cabangs || cabangs.length === 0}>
                                        <Button variant="purple" className="w-full">
                                            <div className="flex items-center justify-between w-full">
                                                <h1 className="flex items-center gap-x-2">
                                                    <BiHomeAlt size={16} />
                                                    {/* The text now changes dynamically based on whether branches exist */}
                                                    <span className="font-semibold">
                                                        {cabangs && cabangs.length > 0
                                                            ? cabang?.nama_cabang || "Pilih Cabang"
                                                            : "Tidak Ada Cabang"
                                                        }
                                                    </span>
                                                </h1>
                                                <MdKeyboardArrowDown size={24} />
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[calc(100vw-4rem)] sm:w-96" align="center">
                                        <DropdownMenuLabel>Cabang</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {/* A check is added to show a message if the cabangs array is empty */}
                                        {cabangs && cabangs.length > 0 ? (
                                            cabangs.map((cabang) => (
                                                <DropdownMenuItem key={cabang.id} onClick={() => setCabang(cabang)}>
                                                    {cabang.nama_cabang}
                                                </DropdownMenuItem>
                                            ))
                                        ) : (
                                            <DropdownMenuItem disabled>
                                                Tidak ada cabang tersedia
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="w-full sm:w-1/2">
                                        <Button variant="outline" className="w-full">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-x-2">
                                                    <LuCalendarDays size={16} />
                                                    <span className="font-semibold">Tanggal</span>
                                                </div>
                                                <MdKeyboardArrowDown size={24} />
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="center" className="w-fit">
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
                        </div>
                    </CardTitle>
                </CardHeader>
                <Chart />
            </Card>
        </div>
    )
}

export default Dashboard