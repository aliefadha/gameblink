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

function Dashboard() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(2025, 5, 9),
        to: new Date(2025, 5, 26),
    })
    return (
        <div className="p-10 flex flex-col gap-y-4 overflow-y-scroll">
            <div>
                <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                    <PiSquaresFourBold size={24} />
                    <span>Dashboard</span>
                </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold">
                            24
                        </h1>
                    </CardContent>
                </Card>

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
                        <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold">
                            35
                        </h1>
                    </CardContent>
                </Card>

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
                        <h1 className="text-md sm:text-2xl md:text-3xl text-white font-bold">
                            Rp452.000
                        </h1>
                    </CardContent>
                </Card>

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
                        <h1 className="text-md sm:text-2xl md:text-3xl text-white font-bold">
                            Tarandam
                        </h1>
                    </CardContent>
                </Card>
            </div>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-col md:flex-row gap-y-2 justify-between w-full">
                            <h1 className="text-[#61368E] font-bold text-base md:text-xl">
                                Statistik Jumlah Booking
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-2 justify-end w-full sm:w-1/2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="w-full sm:w-1/2">
                                        <Button variant="purple" className="w-full">
                                            <div className="flex items-center justify-between w-full">
                                                <h1 className="flex items-center gap-x-2">
                                                    <BiHomeAlt size={16} />
                                                    <span className="font-semibold">Cabang</span>
                                                </h1>
                                                <MdKeyboardArrowDown size={24} />
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[calc(100vw-4rem)] sm:w-96" align="center">
                                        <DropdownMenuLabel>Cabang</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            Cabang 1
                                        </DropdownMenuItem>
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