import useFormStore from "@/store/UseFormStore";
import { useQuery } from "@tanstack/react-query";
import { getUnitsByCabang } from "@/lib/api/units";
import { getBookings } from "@/lib/api/bookings";
import { getKetersediaans } from "@/lib/api/ketersediaans";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerClose,
} from "@/components/ui/drawer";

import { useNavigate } from "react-router";
import type { Ketersediaan } from "@/types/Ketersediaan";

function BookingJadwal() {
    const { stepTwo, setData } = useFormStore();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedSlots, setSelectedSlots] = useState<{ unitId: string; nama_unit: string; jenis_konsol: string; jam: string, harga: number, tanggal: string }[]>([]);
    const cabangId = stepTwo?.id_cabang;
    const { data: units, isLoading, error: unitsError } = useQuery({
        queryKey: ["units", cabangId],
        queryFn: async () => {
            if (!cabangId) return [];
            return await getUnitsByCabang(cabangId);
        },
        enabled: !!cabangId,
    });

    const { data: bookings } = useQuery({
        queryKey: [
            'bookings',
            cabangId,
            selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined
        ],
        queryFn: async () => {
            if (!cabangId || !selectedDate) return [];
            const allBookings = await getBookings(
                format(selectedDate, 'yyyy-MM-dd'),
                undefined, // type
                cabangId // cabang parameter
            );
            return allBookings.filter((b: import("@/types/Booking").Booking) => (b.status_pembayaran === 'Berhasil' || b.status_pembayaran === 'Pending'));
        },
        enabled: !!cabangId && !!selectedDate
    });

    const { data: ketersediaans } = useQuery({
        queryKey: [
            'ketersediaans',
            selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined
        ],
        queryFn: async () => {
            try {
                return await getKetersediaans();
            } catch (error: unknown) {
                if (error instanceof Error && error.message.includes("Status: 404")) {
                    return [];
                }
                throw error;
            }
        },
    });

    const isUnitBlocked = (unitName: string, time: string, date: Date): boolean => {
        if (!ketersediaans) return false;
        const dateStr = format(date, 'yyyy-MM-dd');
        return ketersediaans.some((ketersediaan: Ketersediaan) => {
            if (ketersediaan.nama_unit !== unitName || ketersediaan.nama_cabang !== stepTwo?.nama_cabang) {
                return false;
            }

            const startDate = format(new Date(ketersediaan.tanggal_mulai_blokir), 'yyyy-MM-dd');
            const currentTime = parseInt(time.replace('.00', ''));
            const startTime = parseInt(ketersediaan.jam_mulai_blokir.replace('.00', ''));

            if (ketersediaan.status_perbaikan === "Selesai" || ketersediaan.status_perbaikan === "Pending") {
                if (!ketersediaan.tanggal_selesai_blokir || !ketersediaan.jam_selesai_blokir) {
                    return false;
                }

                const endDate = format(new Date(ketersediaan.tanggal_selesai_blokir), 'yyyy-MM-dd');
                const endTime = parseInt(ketersediaan.jam_selesai_blokir.replace('.00', ''));

                if (dateStr < startDate) return false;
                if (dateStr === startDate && currentTime < startTime) return false;

                if (dateStr > endDate) return false;
                if (dateStr === endDate && currentTime > endTime) return false;

                return true;
            }
            return false;
        });
    };

    const timeSlots = Array.from({ length: 15 }, (_, i) => `${10 + i}.00`);
    const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
    const hari = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const totalHarga = selectedSlots.reduce((sum, slot) => sum + (slot.harga || 0), 0);
    const formatRupiah = (value: number) =>
        "Rp" + value.toLocaleString("id-ID");



    return (
        <div className="p-5 max-w-[350px] md:max-w-xl lg:max-w-3xl mx-auto gap-y-6 flex flex-col overflow-y-auto pb-32">
            {stepTwo && (
                <>
                    <div className="flex flex-row gap-2 items-center mb-4 overflow-x-auto scrollbar-hide">
                        {days.map((date, idx) => {
                            const isActive = isSameDay(date, selectedDate);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setSelectedDate(date);
                                        setSelectedSlots([]);
                                    }}
                                    className={`flex flex-col items-center px-4 py-2 rounded-2xl min-w-[64px] ${isActive ? 'bg-green-600 text-white' : 'bg-[#F6F4F4] text-[#222]'} transition-colors duration-150`}
                                    style={{ fontWeight: isActive ? 700 : 600 }}
                                >
                                    <span className="text-xs whitespace-pre uppercase" style={{ opacity: isActive ? 1 : 0.7 }}>{format(date, 'd MMM', { locale: localeId })}</span>
                                    <span className="text-lg font-bold uppercase" style={{ opacity: isActive ? 1 : 0.9 }}>{hari[date.getDay()]}</span>
                                </button>
                            );
                        })}
                    </div>
                    {/* Status Legend */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
                        <h1 className="font-bold text-base md:text-2xl">Pilih Jam dan Unit</h1>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4">
                            <span className="flex items-center gap-1 text-sm text-[#888]">
                                <span className="inline-block w-3 h-3 rounded-full bg-[#F6F4F4] border border-[#E5E5E5]"></span> Tersedia
                            </span>
                            <span className="flex items-center gap-1 text-sm text-[#888]">
                                <span className="inline-block w-3 h-3 rounded-full bg-red-600"></span> Terisi
                            </span>
                            <span className="flex items-center gap-1 text-sm text-[#888]">
                                <span className="inline-block w-3 h-3 rounded-full bg-green-600"></span> Aktif
                            </span>
                            <span className="flex items-center gap-1 text-sm text-[#888]">
                                <span className="inline-block w-3 h-3 rounded-full bg-gray-600"></span> Diblokir
                            </span>
                        </div>
                    </div>



                    {(units ?? []).length > 0 && (
                        <div className="w-full overflow-x-auto">
                            <table className="min-w-max w-full border-collapse relative">
                                <thead>
                                    <tr>
                                        <th className="text-xs font-bold text-[#2F2F2F] text-left p-2 w-[85px] sticky left-0 bg-white z-10 ">Jam</th>
                                        {units?.map((unit) => (
                                            <th key={unit.id} className="text-center p-2 w-[100px] md:w-[150px] sticky ">
                                                <div className="text-center text-[10px] md:text-xs">
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
                                            <td className="text-xs font-bold text-[#2F2F2F] p-2 sticky left-0 bg-white z-10">{time}</td>
                                            {units?.map((unit) => {
                                                const slotData = {
                                                    unitId: unit.id,
                                                    jam: time,
                                                    nama_unit: unit.nama_unit,
                                                    jenis_konsol: unit.jenis_konsol,
                                                    harga: unit.harga,
                                                    tanggal: format(selectedDate, 'yyyy-MM-dd') + 'T00:00:00.000Z',
                                                };

                                                const isSelected = selectedSlots.some(
                                                    (slot) =>
                                                        slot.unitId === unit.id &&
                                                        slot.jam === time &&
                                                        slot.tanggal === format(selectedDate, 'yyyy-MM-dd') + 'T00:00:00.000Z'
                                                );

                                                const isBooked = (bookings ?? []).some((booking: import("@/types/Booking").Booking) =>
                                                    booking.booking_details?.some((detail: import("@/types/Booking").BookingDetail) =>
                                                        detail.unit_id === unit.id &&
                                                        detail.jam_main === time &&
                                                        new Date(detail.tanggal).toDateString() === selectedDate.toDateString()
                                                    )
                                                );

                                                const isBlocked = isUnitBlocked(unit.nama_unit, time, selectedDate);

                                                let buttonClass = "bg-[#F8F5F5] hover:bg-gray-200";
                                                let isDisabled = false;

                                                if (isBooked) {
                                                    buttonClass = "bg-[#D31A1D] text-white hover:bg-[#D31A1D] disable:bg-[#D31A1D] disabled:cursor-not-allowed";
                                                    isDisabled = true;
                                                } else if (isBlocked) {
                                                    buttonClass = "bg-gray-600 text-white hover:bg-gray-600 disable:bg-gray-600 disabled:cursor-not-allowed";
                                                    isDisabled = true;
                                                } else if (isSelected) {
                                                    buttonClass = "bg-green-500 text-white hover:bg-green-600";
                                                }

                                                return (
                                                    <td key={`${time}-${unit.id}`} className="text-center p-2">
                                                        <Button
                                                            className={`${buttonClass} w-full`}
                                                            size="sm"
                                                            disabled={isDisabled}
                                                            onClick={() => {
                                                                if (isDisabled) return;
                                                                setSelectedSlots((prev) => {
                                                                    let updated;
                                                                    if (isSelected) {
                                                                        updated = prev.filter(
                                                                            (slot) =>
                                                                                !(
                                                                                    slot.unitId === unit.id &&
                                                                                    slot.jam === time
                                                                                    && slot.tanggal === format(selectedDate, 'yyyy-MM-dd') + 'T00:00:00.000Z'
                                                                                )
                                                                        );
                                                                    } else {
                                                                        updated = [...prev, slotData];
                                                                    }
                                                                    return updated;
                                                                });
                                                            }}
                                                        >
                                                        </Button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
            <Drawer>
                <div className="fixed bottom-0 left-0 w-screen z-50">
                    <DrawerTrigger asChild>
                        <div className="bg-[#61368E] text-white text-center py-2 font-medium text-base w-full cursor-pointer select-none">
                            Total Harga <span className="font-bold">{formatRupiah(totalHarga)}</span>
                        </div>
                    </DrawerTrigger>
                    <button
                        className={`w-full text-white font-bold text-lg py-3 focus:outline-none ${selectedSlots.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00A651]'}`}
                        onClick={() => {
                            if (selectedSlots.length === 0) return;
                            setData({
                                step: 3,
                                data: {
                                    tanggal_main: format(selectedDate, 'yyyy-MM-dd') + 'T00:00:00.000Z',
                                    total_harga: totalHarga,
                                    booking_detail: selectedSlots.map(slot => ({
                                        unit_id: slot.unitId,
                                        jam_main: slot.jam,
                                        harga: slot.harga,
                                        nama_unit: slot.nama_unit,
                                        jenis_konsol: slot.jenis_konsol,
                                        tanggal: format(selectedDate, 'yyyy-MM-dd') + 'T00:00:00.000Z',
                                    })),
                                    booking_type: 'Online',
                                    metode_pembayaran: ''
                                }
                            });
                            navigate('/booking/details');
                        }}
                        disabled={selectedSlots.length === 0}
                    >
                        LANJUT
                    </button>
                </div>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className="text-center">Detail Pesanan</DrawerTitle>
                        <DrawerDescription className="text-center sr-only">Rincian slot yang kamu pilih.</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-4 max-h-100 overflow-y-auto">
                        {selectedSlots.length === 0 ? (
                            <div className="text-sm text-gray-500 text-center">Belum ada slot dipilih.</div>
                        ) : (
                            <div className="bg-[#FAF8F7] rounded-xl p-4 w-full">
                                <div className="font-bold text-[#222] mb-2">Detail Booking</div>
                                <div className="text-[#222] mb-1">Cabang {stepTwo?.nama_cabang || '-'}</div>
                                {selectedSlots.map((slot, idx) => (
                                    <div key={idx} className="mb-2 last:mb-0 flex justify-between items-center">
                                        <div>
                                            <div className="text-[#222]">{slot.nama_unit} | {slot.jenis_konsol}</div>
                                            <div className="text-[#222] text-sm">
                                                {format(selectedDate, 'd MMM yyyy', { locale: localeId })} |
                                                {` ${slot.jam} - ${parseInt(slot.jam) + 1}.00`}
                                            </div>
                                        </div>
                                        <div className="text-[#222] font-medium whitespace-nowrap">{formatRupiah(slot.harga)}</div>
                                    </div>
                                ))}
                                <div className="border-t border-[#E5E5E5] mt-3 pt-3 flex justify-between items-center">
                                    <span className="font-semibold text-[#222]">Total Harga</span>
                                    <span className="font-bold text-[#222]">{formatRupiah(totalHarga)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <DrawerClose asChild>
                        <button className="w-full bg-[#00A651] text-white font-bold text-lg py-3 mt-2 focus:outline-none" style={{ letterSpacing: 1 }}>
                            TUTUP
                        </button>
                    </DrawerClose>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default BookingJadwal;