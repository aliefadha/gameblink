import { type Row } from "@tanstack/react-table";
import { DialogContent, Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import type { Booking } from "@/types/Booking";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { updateBooking } from "@/lib/api/bookings";
import { BookingDetailsTable } from "./booking-details-table";
import { bookingDetailsColumns } from "./booking-details-columns";

interface EditBookingProps {
    row: Row<Booking>;
    onRefetch?: () => void;
}

export function EditBooking({ row, onRefetch }: EditBookingProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [statusBooking, setStatusBooking] = useState(row.original.status_booking);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    };

    const handleStatusChange = (value: string) => {
        setStatusBooking(value);
        setSuccess(false);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await updateBooking(row.original.id, statusBooking);
            setSuccess(true);
            if (onRefetch) onRefetch();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Gagal memperbarui status');
            } else {
                setError('Gagal memperbarui status');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="link" className="text-[#009B4F]">Lihat Detail</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl overflow-x-scroll">
                <DialogHeader className="flex flex-row items-center ">
                    <DialogTitle className="text-[#61368E] font-bold text-xl">Detail Booking</DialogTitle>
                    <div className="flex items-center gap-2 ml-4">
                        <Select value={statusBooking} onValueChange={handleStatusChange} disabled={loading}>
                            <SelectTrigger
                                className={`rounded-full px-4 py-1 text-sm font-semibold flex items-center gap-2 w-auto 
                                    ${statusBooking === 'Aktif' ? 'bg-[#009B4F] text-white' :
                                        statusBooking === 'Dibatalkan' ? 'bg-[#D31A1D] text-white' :
                                            statusBooking === 'Selesai' ? 'bg-[#E9B03C] text-white' :
                                                statusBooking === 'TidakAktif' ? 'bg-[#6B7280] text-white' :
                                                    'bg-gray-300 text-gray-700'}`}
                            >
                                <SelectValue />
                                {loading && <span className="ml-2 animate-spin">...</span>}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Aktif">Aktif</SelectItem>
                                <SelectItem value="TidakAktif">Tidak Aktif</SelectItem>
                                <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                            </SelectContent>
                        </Select>
                        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
                        {success && <div className="text-xs text-green-600 mt-1">Status berhasil diperbarui</div>}
                    </div>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Lihat atau ubah detail Booking
                </DialogDescription>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Left column */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <div className="text-xs sm:text-sm font-medium mb-1">ID Booking</div>
                                    <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{row.original.booking_code || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-medium mb-1">Nama</div>
                                    <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{row.original.nama || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-medium mb-1">No HP</div>
                                    <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{row.original.nomor_hp || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-medium mb-1">Email</div>
                                    <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{row.original.email || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-medium mb-1">Cabang</div>
                                    <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{row.original.nama_cabang || '-'}</div>
                                </div>
                            </div>
                            {/* Right column */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <div className="text-xs sm:text-sm font-medium mb-1">Tanggal Main</div>
                                    <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{row.original.tanggal_main?.split('T')[0] || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-medium mb-1">Tanggal Transaksi</div>
                                    <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{row.original.tanggal_transaksi?.split('T')[0] || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-medium mb-1">Metode Pembayaran</div>
                                    <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">
                                        {row.original.metode_pembayaran === "qris"
                                            ? "QRIS"
                                            : row.original.metode_pembayaran === "bank_transfer"
                                                ? "Transfer"
                                                : row.original.metode_pembayaran === "tunai"
                                                    ? "Tunai"
                                                    : row.original.metode_pembayaran === "nontunai"
                                                        ? "Non Tunai"
                                                        : row.original.metode_pembayaran === "gopay"
                                                            ? "GoPay"
                                                            : row.original.metode_pembayaran === "shopeepay"
                                                                ? "ShopeePay"
                                                                : row.original.metode_pembayaran === "dana"
                                                                    ? "DANA"
                                                                    : row.original.metode_pembayaran}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-medium mb-1">Total Pembayaran</div>
                                    <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{row.original.total_harga ? `Rp ${Number(row.original.total_harga).toLocaleString('id-ID')}` : '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-medium mb-1">Status Pembayaran</div>
                                    <div className="flex items-center h-full">
                                        {row.original.status_pembayaran === 'Berhasil' ? (
                                            <span className="bg-green-600 text-white rounded-full px-4 py-1 text-xs font-semibold">Berhasil</span>
                                        ) : (
                                            <span className="bg-gray-300 text-gray-700 rounded-full px-4 py-1 text-xs font-semibold">{row.original.status_pembayaran || '-'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Booking Details Table */}
                        <div className="mt-6">
                            <div className="text-sm font-medium mb-3 text-[#61368E]">Detail Unit yang Dipesan</div>
                            <BookingDetailsTable
                                columns={bookingDetailsColumns}
                                data={row.original.booking_details || []}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full mt-8 bg-[#61368E] hover:bg-[#4b2770] text-white text-lg font-semibold rounded-xl py-3" disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}