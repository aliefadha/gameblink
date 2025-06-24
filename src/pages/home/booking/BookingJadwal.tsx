import useFormStore from "@/store/UseFormStore";
import { useQuery } from "@tanstack/react-query";
import { getUnitsByCabang } from "@/lib/api/units";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { id as localeId } from "date-fns/locale";

function BookingJadwal() {
    const {stepTwo} = useFormStore();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const cabangId = stepTwo?.id_cabang;
    const { data: units, isLoading, error: unitsError } = useQuery({
        queryKey: ["units", cabangId],
        queryFn: async () => {
            if (!cabangId) return [];
            return await getUnitsByCabang(cabangId);
        },
        enabled: !!cabangId,
    });
    const timeSlots = Array.from({ length: 12 }, (_, i) => `${10 + i}.00`);
    const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
    const hari = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return(
        <div className="h-screen w-full bg-[url('/images/bg-login.png')] bg-cover">
            <div className="h-1/4 text-center flex flex-col items-center justify-center gap-y-6">
                <img src="/images/logo.svg" alt="logo" className="mx-auto w-[125px] h-auto " />
                <h1 className="text-4xl text-white font-bold font-nebula">{stepTwo?.nama_cabang}</h1>
            </div>
            <div className="w-full bg-white rounded-t-3xl h-3/4 overflow-y-auto">
                <div className="py-10 max-w-[350px] md:max-w-xl lg:max-w-3xl mx-auto gap-y-6 flex flex-col h-full">
                    {stepTwo && (
                        <>
                            <div className="flex flex-row gap-2 items-center mb-4 overflow-x-auto scrollbar-hide">
                                {days.map((date, idx) => {
                                    const isActive = isSameDay(date, selectedDate);
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedDate(date)}
                                            className={`flex flex-col items-center px-4 py-2 rounded-2xl min-w-[64px] ${isActive ? 'bg-green-600 text-white' : 'bg-[#F6F4F4] text-[#222]'} transition-colors duration-150`}
                                            style={{ fontWeight: isActive ? 700 : 600 }}
                                        >
                                            <span className="text-xs whitespace-pre" style={{ opacity: isActive ? 1 : 0.7 }}>{format(date, 'd MMM', { locale: localeId })}</span>
                                            <span className="text-lg font-bold" style={{ opacity: isActive ? 1 : 0.9 }}>{hari[date.getDay()]}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {(units ?? []).length > 0 && (
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="text-xs font-bold text-[#2F2F2F] text-left p-2 w-[85px]">Jam</th>
                                            {units?.map((unit) => (
                                                <th key={unit.id} className="text-center p-2 w-[85px]">
                                                    <div className="text-center text-xs">
                                                        <div className="bg-[#61368E] rounded-t-md w-full py-2 text-white font-bold">
                                                            <p>{unit.nama_unit}</p>
                                                        </div>
                                                        <div className="bg-[#F4E9FF] rounded-b-md py-2 w-full font-medium">
                                                            <p>{unit.jenis_konsol}</p>
                                                        </div>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSlots.map((time) => (
                                            <tr key={time}>
                                                <td className="text-xs font-bold text-[#2F2F2F] p-2">{time}</td>
                                                {units?.map((unit) => {
                                                    const buttonClass = "bg-[#F8F5F5] hover:bg-gray-200"; // Default: Tersedia
                                                    return (
                                                        <td key={`${time}-${unit.id}`} className="text-center p-2">
                                                            <Button className={`${buttonClass} w-full`} size="sm">
                                                            </Button>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            {unitsError && (
                                <div className="text-center p-10 text-red-600">
                                    Terjadi kesalahan: {unitsError.message}
                                </div>
                            )}
                            {isLoading && (
                                <div className="text-center p-10">
                                    Loading...
                                </div>
                            )}
                            {units?.length === 0 && !isLoading && (
                                <div className="text-center p-10">
                                    Tidak ada unit yang ditemukan untuk cabang ini.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookingJadwal;