import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LuCalendarDays, LuClipboardList, LuUsers, LuDownload } from "react-icons/lu"
import { Search } from "lucide-react"
import { useState } from "react"
import { useQuery } from '@tanstack/react-query';
import { DataTable } from "@/components/manajemen-booking/data-table"
import { columns } from "@/components/manajemen-booking/columns"
import { getBookings, exportBookings } from "@/lib/api/bookings"
import { getCabangs } from "@/lib/api/cabangs"
import { format } from 'date-fns';
import { BiHomeAlt } from "react-icons/bi"
import { MdKeyboardArrowDown } from "react-icons/md"
import type { Cabang } from "@/types/Cabang"
import { useDebounce } from "@/hooks/use-debounce"
import { formatDateRange } from "@/lib/utils"

function Booking() {
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date }>({
        from: new Date(),
        to: new Date()
    });
    const [bookingType, setBookingType] = useState<string>('all');
    const [cabang, setCabang] = useState<Cabang | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const [isExporting, setIsExporting] = useState<boolean>(false);

    const debouncedSearchValue = useDebounce(searchValue, 300);

    const { data: bookings, isLoading, refetch } = useQuery({
        queryKey: ['bookings', dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined, dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined, bookingType, cabang, debouncedSearchValue],
        queryFn: () => getBookings(dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined, dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined, bookingType === 'all' ? undefined : bookingType, cabang?.id, debouncedSearchValue || undefined),
        staleTime: 30000, // 30 seconds
        gcTime: 300000, // 5 minutes
        refetchOnWindowFocus: false,
        enabled: true
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

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const excelData = await exportBookings(
                dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
                dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
                bookingType === 'all' ? undefined : bookingType,
                cabang?.id,
                debouncedSearchValue || undefined,
                'csv'
            );

            const blob = new Blob([excelData]);

            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `Laporan booking-${format(new Date(), 'dd-MM-yyyy-HHmm')}.xlsx`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('            Export failed:', error);
            alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="p-10 flex flex-col gap-y-4 mb-10 ">
            <div className="flex flex-col md:flex-row gap-y-4 gap-x-20 justify-between items-start md:items-center">
                <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                    <LuClipboardList size={24} />
                    <span>Manajemen Booking</span>
                </h1>
            </div>
            <div className="flex flex-col gap-y-4">

                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Cari ID Booking atau Nama..."
                            value={searchValue}
                            onChange={(event) => {
                                setSearchValue(event.target.value);
                            }}
                            className="pl-10 w-full border-[#61368E]"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="purple" className="w-full justify-between">
                                <div className="flex items-center gap-x-2">
                                    <BiHomeAlt size={16} />
                                    <span className="font-semibold truncate">{cabang?.nama_cabang || "Semua Cabang"}</span>
                                </div>
                                <MdKeyboardArrowDown size={20} className="flex-shrink-0" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[280px] sm:w-[320px]" align="start">
                            <DropdownMenuLabel>Pilih Cabang</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setCabang(null)}>
                                Semua Cabang
                            </DropdownMenuItem>
                            {isLoadingCabangs && <DropdownMenuItem disabled>Memuat cabang...</DropdownMenuItem>}
                            {!isLoadingCabangs && (!cabangs || cabangs.length === 0) && (
                                <DropdownMenuItem disabled>Tidak ada cabang ditemukan</DropdownMenuItem>
                            )}
                            {cabangs?.map((cabangItem) => (
                                <DropdownMenuItem key={cabangItem.id} onClick={() => setCabang(cabangItem)}>
                                    {cabangItem.nama_cabang}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between bg-transparent">
                                <div className="flex items-center gap-x-2">
                                    <LuCalendarDays size={16} />
                                    <span className="font-semibold text-sm">
                                        {formatDateRange(dateRange)}
                                    </span>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-fit z-10">
                            <Calendar
                                mode="range"
                                defaultMonth={dateRange.from}
                                selected={dateRange}
                                onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                                numberOfMonths={2}
                                className="rounded-lg border shadow-sm"
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Select value={bookingType} onValueChange={setBookingType}>
                        <SelectTrigger className="w-full border border-[#61368E] text-[#61368E]">
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

                    <Button
                        onClick={handleExport}
                        disabled={isExporting || !bookings || (Array.isArray(bookings) && bookings.length === 0)}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-x-2 border-[#61368E] text-[#61368E] hover:bg-[#61368E] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LuDownload size={16} />
                        <span>{isExporting ? 'Mengekspor...' : 'Export'}</span>
                    </Button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={Array.isArray(bookings) ? bookings : []}
                isLoading={isLoading}
                onRefetch={refetch}
            />
        </div >
    )
}

export default Booking                                                
