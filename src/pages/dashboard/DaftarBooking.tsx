import { getCabangs } from "@/lib/api/cabangs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Cabang } from "@/types/Cabang"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { BiHomeAlt } from "react-icons/bi"
import { IoFlagOutline } from "react-icons/io5"
import { LuCalendarDays } from "react-icons/lu"
import { MdKeyboardArrowDown } from "react-icons/md"

function DaftarBooking() {

    const [cabang, setCabang] = useState<Cabang | null>(null);

    const { data: cabangs, isLoading: isLoadingCabang, error: errorCabang } = useQuery({
        queryKey: ['cabangs'],
        queryFn: getCabangs,
    });


    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(2025, 5, 9),
        to: new Date(2025, 5, 26),
    })

    if (isLoadingCabang) {
        return <div>Loading units...</div>;
    }

    if (errorCabang) {
        return <div>Error</div>;
    }

    return (
        <div className="p-10 flex flex-col gap-y-4 mb-10 ">
            <div className="flex flex-col md:flex-row gap-y-4 gap-x-20">
                <h1 className="flex text-xl font-bold gap-x-4 items-center text-[#61368E]">
                    <IoFlagOutline size={24} />
                    <span>Manajemen Booking</span>
                </h1>
                <div className="flex flex-col lg:flex-row gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-full lg:w-1/2 max-w-3xs">
                            <Button variant="purple" className="w-full">
                                <div className="flex items-center justify-between w-full">
                                    <h1 className="flex items-center gap-x-2">
                                        <BiHomeAlt size={16} />
                                        <span className="font-semibold">{cabang?.nama_cabang || "Pilih Cabang"}</span>
                                    </h1>
                                    <MdKeyboardArrowDown size={24} />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[calc(100vw-4rem)] sm:w-[calc(100vw-20rem)] md:w-96" align="center">
                            <DropdownMenuLabel>Cabang</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {cabangs?.map((cabang) => (
                                <DropdownMenuItem key={cabang.id} onClick={() => setCabang(cabang)}>
                                    {cabang.nama_cabang}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-full lg:w-1/2 max-w-3xs">
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
            </div>
            <Card>
                <CardHeader className="gap-y-4">
                    <div className="flex  items-center gap-y-2 justify-between w-full ">
                        <h1 className="text-[#61368E] font-bold text-base md:text-xl">
                            {cabang?.nama_cabang || "Pilih Cabang"}
                        </h1>
                        <div className="flex gap-x-4 text-sm">
                            <div className="flex gap-x-2 items-center">
                                <div className="h-[15px] w-[15px] bg-[#F8F5F5] rounded-full"></div>
                                <p>Tersedia</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <div className="h-[15px] w-[15px] bg-[#D31A1D] rounded-full"></div>
                                <p>Dipesan</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <div className="h-[15px] w-[15px] bg-[#009B4F] rounded-full"></div>
                                <p>Aktif</p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* <div>
                        <div className="flex gap-x-4 items-center">
                            <p className="text-xs font-bold text-[#2F2F2F]">Jam</p>
                            <div className="text-center text-xs w-[85px]">
                                <div className="bg-[#61368E] rounded-t-md w-full py-2 text-white font-bold">
                                    <p>TV 01</p>
                                </div>
                                <div className="bg-[#F4E9FF] rounded-b-md py-2 w-full font-medium">
                                    <p>REG PS4</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-x-4 items-center">
                            <p className="text-xs font-bold text-[#2F2F2F]">10.00</p>
                            <div className="text-center">
                                <Button className="bg-[#009B4F] w-[85px]" size="sm">
                                </Button>
                            </div>
                        </div>
                    </div> */}
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="text-xs font-bold text-[#2F2F2F] text-left p-2 w-[85px]">Jam</th>
                                <th className="text-center p-2 w-[85px]">
                                    <div className="text-center text-xs">
                                        <div className="bg-[#61368E] rounded-t-md w-full py-2 text-white font-bold">
                                            <p>TV 01</p>
                                        </div>
                                        <div className="bg-[#F4E9FF] rounded-b-md py-2 w-full font-medium">
                                            <p>REG PS4</p>
                                        </div>
                                    </div>
                                </th>
                                <th className="text-center p-2 w-[85px]">
                                    <div className="text-center text-xs">
                                        <div className="bg-[#61368E] rounded-t-md w-full py-2 text-white font-bold">
                                            <p>TV 01</p>
                                        </div>
                                        <div className="bg-[#F4E9FF] rounded-b-md py-2 w-full font-medium">
                                            <p>REG PS4</p>
                                        </div>
                                    </div>
                                </th>
                                <th className="text-center p-2 w-[85px]">
                                    <div className="text-center text-xs">
                                        <div className="bg-[#61368E] rounded-t-md w-full py-2 text-white font-bold">
                                            <p>TV 01</p>
                                        </div>
                                        <div className="bg-[#F4E9FF] rounded-b-md py-2 w-full font-medium">
                                            <p>REG PS4</p>
                                        </div>
                                    </div>
                                </th>
                                <th className="text-center p-2 w-[85px]">
                                    <div className="text-center text-xs">
                                        <div className="bg-[#61368E] rounded-t-md w-full py-2 text-white font-bold">
                                            <p>TV 01</p>
                                        </div>
                                        <div className="bg-[#F4E9FF] rounded-b-md py-2 w-full font-medium">
                                            <p>REG PS4</p>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="text-xs font-bold text-[#2F2F2F] p-2">10.00</td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-xs font-bold text-[#2F2F2F] p-2">11.00</td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-xs font-bold text-[#2F2F2F] p-2">12.00</td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#D31A1D] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-xs font-bold text-[#2F2F2F] p-2">13.00</td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-xs font-bold text-[#2F2F2F] p-2">14.00</td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-xs font-bold text-[#2F2F2F] p-2">15.00</td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-xs font-bold text-[#2F2F2F] p-2">16.00</td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#D31A1D] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-xs font-bold text-[#2F2F2F] p-2">17.00</td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-xs font-bold text-[#2F2F2F] p-2">18.00</td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-xs font-bold text-[#2F2F2F] p-2">19.00</td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-xs font-bold text-[#2F2F2F] p-2">20.00</td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#D31A1D] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-xs font-bold text-[#2F2F2F] p-2">21.00</td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#009B4F] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                                <td className="text-center p-2">
                                    <Button className="bg-[#F8F5F5] w-full" size="sm">
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}

export default DaftarBooking