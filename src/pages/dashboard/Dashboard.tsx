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
import { getDashboard, getChartData, type Dashboard } from "@/lib/api/dashboard"

function DashboardPage() {

    const [cabang, setCabang] = useState<Cabang | null>(null);
    const { data: cabangs, isLoading, error } = useQuery({
        queryKey: ['cabangs'],
        queryFn: getCabangs,
    });

    const { data: dashboard, isLoading: isLoadingDashboard, error: errorDashboard } = useQuery<Dashboard>({
        queryKey: ['dashboard'],
        queryFn: getDashboard,
    });

    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

    // Chart data query
    const { data: chartData, isLoading: isLoadingChart } = useQuery({
        queryKey: ['chartData', cabang?.id, dateRange?.from, dateRange?.to],
        queryFn: () => {
            if (!cabang?.id || !dateRange?.from || !dateRange?.to) {
                return Promise.resolve([]);
            }
            const startDate = dateRange.from.toISOString().split('T')[0];
            const endDate = dateRange.to.toISOString().split('T')[0];
            return getChartData(cabang.id, startDate, endDate);
        },
        enabled: !!(cabang?.id && dateRange?.from && dateRange?.to),
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error</div>;
    }

    if (isLoadingDashboard) {
        return <div>Loading...</div>;
    }

    if (errorDashboard) {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Card 1: Booking Hari Ini */}
                <Card className="w-full bg-[#61368E]">
                    <CardHeader className="pb-2">
                        <CardTitle>
                            <h1 className="flex text-white gap-x-2 items-center font-normal text-sm sm:text-base">
                                <IoFlagOutline size={20} />
                                <span className="truncate">Booking Hari Ini</span>
                            </h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <h1 className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl text-white font-bold">
                            {dashboard?.countBookingToday|| 0}
                        </h1>
                    </CardContent>
                </Card>

                {/* Card 2: Tersedia */}
                <Card className="w-full bg-[#61368E]">
                    <CardHeader className="pb-2">
                        <CardTitle>
                            <h1 className="flex text-white gap-x-2 items-center font-normal text-sm sm:text-base">
                                <BsCheckCircle size={20} />
                                <span className="truncate">Tersedia</span>
                            </h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <h1 className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl text-white font-bold">
                            {dashboard?.available || 0}
                        </h1>
                    </CardContent>
                </Card>

                {/* Card 3: Pendapatan Hari Ini */}
                <Card className="w-full bg-[#61368E]">
                    <CardHeader className="pb-2">
                        <CardTitle>
                            <h1 className="flex text-white gap-x-2 items-center font-normal text-sm sm:text-base">
                                <CiMoneyBill size={20} />
                                <span className="truncate">Pendapatan Hari Ini</span>
                            </h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <h1 className="text-lg sm:text-xl lg:text-lg xl:text-xl text-white font-bold">
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(parseFloat(dashboard?.revenueToday.toString() || "0"))}
                        </h1>
                    </CardContent>
                </Card>

                {/* Card 4: Cabang Paling Laris */}
                <Card className="w-full bg-[#61368E]">
                    <CardHeader className="pb-2">
                        <CardTitle>
                            <h1 className="flex text-white gap-x-2 items-center font-normal text-sm sm:text-base">
                                <BiHomeAlt size={20} />
                                <span className="truncate">Cabang Paling Laris</span>
                            </h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <h1 className="text-lg sm:text-xl lg:text-lg xl:text-xl text-white font-bold">
                            {dashboard?.bestCabang || "Tidak ada data"}
                        </h1>
                    </CardContent>
                </Card>
            </div>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 lg:gap-x-4 justify-between w-full">
                            <h1 className="text-[#61368E] font-bold text-base md:text-xl">
                                Statistik Jumlah Booking
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-2 justify-end w-full lg:w-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="w-full sm:w-auto" disabled={!cabangs || cabangs.length === 0}>
                                        <Button variant="purple" className="w-full sm:w-auto min-w-[140px]">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-x-2">
                                                    <BiHomeAlt size={16} />
                                                    <span className="font-semibold truncate">
                                                        {cabangs && cabangs.length > 0
                                                            ? cabang?.nama_cabang || "Pilih Cabang"
                                                            : "Tidak Ada Cabang"
                                                        }
                                                    </span>
                                                </div>
                                                <MdKeyboardArrowDown size={20} />
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-64" align="center">
                                        <DropdownMenuLabel>Cabang</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
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
                                    <DropdownMenuTrigger asChild className="w-full sm:w-auto">
                                        <Button variant="outline" className="w-full sm:w-auto min-w-[120px]" disabled={!cabang}>
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-x-2">
                                                    <LuCalendarDays size={16} />
                                                    <span className="font-semibold">Tanggal</span>
                                                </div>
                                                <MdKeyboardArrowDown size={20} />
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
                                            disabled={(date) => {
                                                if (!dateRange?.from) return false;
                                                const maxDate = new Date(dateRange.from);
                                                maxDate.setDate(maxDate.getDate() + 7);
                                                return date > maxDate;
                                            }}
                                        />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <Chart data={chartData || []} isLoading={isLoadingChart} />
            </Card>
        </div>
    )
}

export default DashboardPage