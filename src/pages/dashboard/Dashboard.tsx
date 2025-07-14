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
import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { useQuery } from "@tanstack/react-query"
import { getCabangs } from "@/lib/api/cabangs"
import type { Cabang } from "@/types/Cabang"
import { getDashboard, getChartData, type Dashboard } from "@/lib/api/dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

function DashboardPage() {

    const [cabang, setCabang] = useState<Cabang | null>(null);
    const { data: cabangs, isLoading, error } = useQuery({
        queryKey: ['cabangs'],
        queryFn: getCabangs,
    });

    const isLoadingCabang = isLoading;
    const cabangsError = error;

    const { data: dashboard, isLoading: isLoadingDashboard, error: errorDashboard } = useQuery<Dashboard>({
        queryKey: ['dashboard'],
        queryFn: getDashboard,
    });

    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

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

    useEffect(() => {
        if (!cabang && cabangs && cabangs.length > 0) {
            setCabang(cabangs[0]);
        }
    }, [cabangs, cabang]);

    // Set default dateRange: from 6 days before today to today
    useEffect(() => {
        if (!dateRange) {
            const today = new Date();
            const from = new Date();
            from.setDate(today.getDate() - 6);
            setDateRange({ from, to: today });
        }
    }, [dateRange]);

    if (error) {
        console.log(error);
        toast.error("Gagal memuat data cabang");
    }

    if (errorDashboard) {
        console.log(errorDashboard);
        toast.error("Gagal memuat data dashboard");
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
                        {isLoadingDashboard ? (
                            <Skeleton className="h-8 w-24 bg-[#7e57c2]" />
                        ) : (
                            <h1 className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl text-white font-bold">
                                {dashboard?.countBookingToday|| 0}
                            </h1>
                        )}
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
                        {isLoadingDashboard ? (
                            <Skeleton className="h-8 w-24 bg-[#7e57c2]" />
                        ) : (
                            <h1 className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl text-white font-bold">
                                {dashboard?.available || 0}
                            </h1>
                        )}
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
                        {isLoadingDashboard ? (
                            <Skeleton className="h-7 w-32 bg-[#7e57c2]" />
                        ) : (
                            <h1 className="text-lg sm:text-xl lg:text-lg xl:text-xl text-white font-bold">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(parseFloat(dashboard?.revenueToday.toString() || "0"))}
                            </h1>
                        )}
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
                        {isLoadingDashboard ? (
                            <Skeleton className="h-7 w-32 bg-[#7e57c2]" />
                        ) : (
                            <h1 className="text-lg sm:text-xl lg:text-lg xl:text-xl text-white font-bold">
                                {dashboard?.bestCabang || "Tidak ada data"}
                            </h1>
                        )}
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
                                    <DropdownMenuTrigger asChild className="w-full sm:w-auto" disabled={isLoadingCabang || !!cabangsError || !cabangs || cabangs.length === 0}>
                                        <Button variant="purple" className="w-full sm:w-auto min-w-[140px]" disabled={isLoadingCabang || !!cabangsError || !cabangs || cabangs.length === 0}>
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-x-2">
                                                    <BiHomeAlt size={16} />
                                                    <span className="font-semibold truncate">
                                                        {isLoadingCabang ? "Memuat cabang..."
                                                            : cabangsError ? "Gagal memuat cabang"
                                                            : cabangs && cabangs.length > 0
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
                                        {isLoadingCabang && <DropdownMenuItem disabled>Memuat cabang...</DropdownMenuItem>}
                                        {cabangsError && <DropdownMenuItem disabled className="text-red-600">Gagal memuat cabang</DropdownMenuItem>}
                                        {!isLoadingCabang && !cabangsError && (!cabangs || cabangs.length === 0) && (
                                            <DropdownMenuItem disabled>Tidak ada cabang ditemukan</DropdownMenuItem>
                                        )}
                                        {cabangs && cabangs.length > 0 && !isLoadingCabang && !cabangsError && (
                                            cabangs.map((cabang) => (
                                                <DropdownMenuItem key={cabang.id} onClick={() => setCabang(cabang)}>
                                                    {cabang.nama_cabang}
                                                </DropdownMenuItem>
                                            ))
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