import { BiHomeAlt } from "react-icons/bi"
import { BsCheckCircle } from "react-icons/bs"
import { CiMoneyBill } from "react-icons/ci"
import { IoFlagOutline } from "react-icons/io5"
import { PiSquaresFourBold } from "react-icons/pi"
// import { Chart } from "@/components/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MdKeyboardArrowDown } from "react-icons/md"
import { Calendar } from "@/components/ui/calendar"
import { LuCalendarDays } from "react-icons/lu"
import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { useQuery } from "@tanstack/react-query"
// import { getCabangs } from "@/lib/api/cabangs"
// import type { Cabang } from "@/types/Cabang"
import { getDashboard, type Dashboard, type Summary, getSummary, } from "@/lib/api/dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { FaFilter } from "react-icons/fa"

function DashboardPage() {

    // const [cabang, setCabang] = useState<Cabang | null>(null);
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    // const { data: cabangs, isLoading, error } = useQuery({
    //     queryKey: ['cabangs'],
    //     queryFn: getCabangs,
    // });

    // const isLoadingCabang = isLoading;
    // const cabangsError = error;

    const { data: dashboard, isLoading: isLoadingDashboard, error: errorDashboard } = useQuery<Dashboard>({
        queryKey: ['dashboard'],
        queryFn: getDashboard,
    });

    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [summaryDateRange, setSummaryDateRange] = useState<DateRange | undefined>(undefined)

    // const { data: chartData, isLoading: isLoadingChart } = useQuery({
    //     queryKey: ['chartData', cabang?.id, dateRange?.from, dateRange?.to],
    //     queryFn: () => {
    //         if (!cabang?.id || !dateRange?.from || !dateRange?.to) {
    //             return Promise.resolve([]);
    //         }
    //         // Format dates properly to avoid timezone issues
    //         const formatDate = (date: Date) => {
    //             const year = date.getFullYear();
    //             const month = String(date.getMonth() + 1).padStart(2, '0');
    //             const day = String(date.getDate()).padStart(2, '0');
    //             return `${year}-${month}-${day}`;
    //         };
    //         const startDate = formatDate(dateRange.from);
    //         const endDate = formatDate(dateRange.to);
    //         return getChartData(cabang.id, startDate, endDate);
    //     },
    //     enabled: !!(cabang?.id && dateRange?.from && dateRange?.to),
    // });

    const { data: summaryData, isLoading: isLoadingSummary, error: errorSummary } = useQuery<Summary[]>({
        queryKey: ['summary', summaryDateRange?.from, summaryDateRange?.to, selectedType, selectedPaymentMethod],
        queryFn: () => {
            if (!summaryDateRange?.from || !summaryDateRange?.to) {
                return Promise.resolve([]);
            }
            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            const startDate = formatDate(summaryDateRange.from);
            const endDate = formatDate(summaryDateRange.to);
            return getSummary(startDate, endDate, selectedType, selectedPaymentMethod);
        },
        enabled: !!(summaryDateRange?.from && summaryDateRange?.to),
    });

    // useEffect(() => {
    //     if (!cabang && cabangs && cabangs.length > 0) {
    //         setCabang(cabangs[0]);
    //     }
    // }, [cabangs, cabang]);

    // Set default dateRange: from 6 days before today to today
    useEffect(() => {
        if (!dateRange) {
            const today = new Date();
            const from = new Date();
            from.setDate(today.getDate() - 6);
            setDateRange({ from, to: today });
        }
    }, [dateRange]);

    // Set default summaryDateRange: from 6 days before today to today
    useEffect(() => {
        if (!summaryDateRange) {
            const today = new Date();
            const from = new Date();
            from.setDate(today.getDate() - 6);
            setSummaryDateRange({ from, to: today });
        }
    }, [summaryDateRange]);

    // if (error) {
    //     console.log(error);
    //     toast.error("Gagal memuat data cabang");
    // }

    if (errorDashboard) {
        console.log(errorDashboard);
        toast.error("Gagal memuat data dashboard");
    }

    if (errorSummary) {
        console.log(errorSummary);
        toast.error("Gagal memuat data summary");
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
                                {dashboard?.countBookingToday || 0}
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
            {/* <Card className="w-full hidden">
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
                                            onSelect={(range) => {
                                                if (range?.from && !range?.to) {
                                                    setDateRange({ from: range.from, to: range.from });
                                                } else {
                                                    setDateRange(range);
                                                }
                                            }}
                                            className="rounded-lg border shadow-sm"
                                            disabled={(date) => {
                                                const today = new Date();
                                                today.setHours(23, 59, 59, 999);
                                                if (date > today) return true;

                                                if (dateRange?.from && dateRange?.to === undefined) {
                                                    const maxDate = new Date(dateRange.from);
                                                    maxDate.setDate(maxDate.getDate() + 7);
                                                    return date < dateRange.from || date > maxDate;
                                                }

                                                return false;
                                            }}
                                        />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <Chart data={chartData || []} isLoading={isLoadingChart} />
            </Card> */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 lg:gap-x-4 justify-between w-full">
                            <h1 className="text-[#61368E] font-bold text-base md:text-xl">
                                Summary
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-2 justify-end w-full lg:w-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="w-full sm:w-auto">
                                        <Button variant="purple" className="w-full sm:w-auto min-w-[140px]" >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-x-2">
                                                    <FaFilter size={16} />
                                                    <span className="font-semibold truncate">
                                                        {selectedType || 'Semua Tipe'}
                                                    </span>
                                                </div>
                                                <MdKeyboardArrowDown size={20} />
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-64" align="center">
                                        <DropdownMenuLabel>Tipe</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setSelectedType('')}>Semua Tipe</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedType('Walkin')}>Walkin</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedType('Online')}>Online</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="w-full sm:w-auto">
                                        <Button variant="outline" className="w-full sm:w-auto min-w-[140px]" >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-x-2">
                                                    <CiMoneyBill size={16} />
                                                    <span className="font-semibold truncate">
                                                        {selectedPaymentMethod === 'cash' ? 'Cash' :
                                                            selectedPaymentMethod === 'qris' ? 'QRIS' :
                                                                selectedPaymentMethod === 'transfer' ? 'Transfer' :
                                                                    selectedPaymentMethod === 'tunai' ? 'Tunai' :
                                                                        selectedPaymentMethod === 'nontunai' ? 'Non Tunai' :
                                                                            selectedPaymentMethod === 'gopay' ? 'GoPay' :
                                                                                selectedPaymentMethod === 'shopeepay' ? 'ShopeePay' :
                                                                                    selectedPaymentMethod === 'dana' ? 'DANA' :
                                                                                        'Semua Metode'}
                                                    </span>
                                                </div>
                                                <MdKeyboardArrowDown size={20} />
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-64" align="center">
                                        <DropdownMenuLabel>Metode Pembayaran</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod('')}>Semua Metode</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod('tunai')}>Tunai</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod('nontunai')}>Non Tunai</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod('qris')}>QRIS</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod('bank_transfer')}>Transfer</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod('gopay')}>GoPay</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod('shopeepay')}>ShopeePay</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod('dana')}>Dana</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="w-full sm:w-auto">
                                        <Button variant="outline" className="w-full sm:w-auto min-w-[120px]">
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
                                            min={1}
                                            max={6}
                                            defaultMonth={summaryDateRange?.from}
                                            selected={summaryDateRange}
                                            onSelect={(range) => {
                                                if (range?.from && !range?.to) {
                                                    setSummaryDateRange({ from: range.from, to: range.from });
                                                } else {
                                                    setSummaryDateRange(range);
                                                }
                                            }}
                                            className="rounded-lg border shadow-sm"
                                            disabled={(date) => {
                                                const today = new Date();
                                                today.setHours(23, 59, 59, 999);
                                                if (date > today) return true;

                                                return false;
                                            }}
                                        />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto rounded-md m-2 border border-gray-100">
                        <table className="w-full">
                            <thead className="bg-[#61368E]">
                                <tr className="text-center">
                                    <th className="text-white font-semibold p-3 text-left">Branch</th>
                                    <th className="text-white font-semibold p-3 text-center">PS4 Reguler</th>
                                    <th className="text-white font-semibold p-3 text-center">PS5 Reguler</th>
                                    <th className="text-white font-semibold p-3 text-center">VIP PS4</th>
                                    <th className="text-white font-semibold p-3 text-center">VIP PS5</th>
                                    <th className="text-white font-semibold p-3 text-center">Lounge Room</th>
                                    <th className="text-white font-semibold p-3 text-center">Super Lounge Room</th>
                                    <th className="text-white font-semibold p-3 text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadingSummary ? (
                                    Array.from({ length: 3 }).map((_, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-3"><Skeleton className="h-4 w-24" /></td>
                                            <td className="p-3 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                                            <td className="p-3 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                                            <td className="p-3 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                                            <td className="p-3 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                                            <td className="p-3 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                                            <td className="p-3 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                                            <td className="p-3 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                                        </tr>
                                    ))
                                ) : errorSummary ? (
                                    <tr>
                                        <td colSpan={8} className="text-center text-red-600 py-8">
                                            Gagal memuat data summary
                                        </td>
                                    </tr>
                                ) : !summaryData || summaryData.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center text-gray-500 py-8">
                                            Tidak ada data summary
                                        </td>
                                    </tr>
                                ) : (
                                    summaryData.map((summaryItem, index) => {
                                        const getConsoleCount = (jenisKonsol: string) => {
                                            const konsol = summaryItem.konsolSummary.find(k => k.jenis_konsol === jenisKonsol);
                                            return konsol ? konsol.totalRevenue : 0;
                                        };

                                        const ps4Regular = getConsoleCount('PS4 REGULER');
                                        const ps5Regular = getConsoleCount('PS5 REGULER');
                                        const vipPs4 = getConsoleCount('VIP PS4');
                                        const vipPs5 = getConsoleCount('VIP PS5');
                                        const loungeRoom = getConsoleCount('LOUNGE ROOM');
                                        const superLoungeRoom = getConsoleCount('SUPER LOUNGE ROOM');

                                        return (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="p-3 font-medium">{summaryItem.cabang}</td>
                                                <td className="p-3 text-center">{ps4Regular}</td>
                                                <td className="p-3 text-center">{ps5Regular}</td>
                                                <td className="p-3 text-center">{vipPs4}</td>
                                                <td className="p-3 text-center">{vipPs5}</td>
                                                <td className="p-3 text-center">{loungeRoom}</td>
                                                <td className="p-3 text-center">{superLoungeRoom}</td>
                                                <td className="p-3 text-center font-semibold">{summaryItem.totalRevenue}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}

export default DashboardPage