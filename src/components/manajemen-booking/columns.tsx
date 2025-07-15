import type { Booking } from "@/types/Booking"
import { type ColumnDef } from "@tanstack/react-table"
import { EditBooking } from "./EditBooking"
import { format, parseISO } from "date-fns"

export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: "booking_code",
        header: "ID Booking",
    },
    {
        accessorKey: "nama",
        header: "Nama",
    },
    {
        accessorKey: "nomor_hp",
        header: "Nomor HP",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "nama_cabang",
        header: "Cabang",
    },
    {
        accessorKey: "tanggal_main",
        header: "Tanggal Main",
        cell: ({ row }) => {
            const dateStr = row.getValue("tanggal_main") as string
            try {
                // Handle both 'yyyy-MM-dd' and ISO date formats
                const date = dateStr.includes('T') ? parseISO(dateStr) : parseISO(dateStr + 'T00:00:00')
                return format(date, 'dd-MM-yyyy')
            } catch {
                return dateStr
            }
        }
    },
    {
        accessorKey: "tanggal_transaksi",
        header: "Tanggal Transaksi",
        cell: ({ row }) => {
            const dateStr = row.getValue("tanggal_transaksi") as string
            try {
                // Handle both 'yyyy-MM-dd' and ISO date formats
                const date = dateStr.includes('T') ? parseISO(dateStr) : parseISO(dateStr + 'T00:00:00')
                return format(date, 'dd-MM-yyyy')
            } catch {
                return dateStr
            }
        }
    },
    {
        accessorKey: "metode_pembayaran",
        header: "Metode Pembayaran",
        cell: ({ row }) => {
            const metode = row.getValue("metode_pembayaran") as string
            return (
                <div>
                    <span className="flex flex-1 justify-center py-1.5 rounded-full text-xs font-medium capitalize">
                        {metode === "qris"
                            ? "QRIS"
                            : metode === "bank_transfer"
                                ? "Transfer"
                                : metode === "tunai"
                                    ? "Tunai"
                                    : metode === "nontunai"
                                        ? "Non Tunai"
                                        : metode}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "total_harga",
        header: "Total Harga",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("total_harga"))
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount)
            return formatted.replace(/\s+/g, ' ')
        },
    },
    {
        accessorKey: "status_pembayaran",
        header: "Status Pembayaran",
        size: 150,
        cell: ({ row }) => {
            const status = row.getValue("status_pembayaran") as string
            return (
                <div>
                    <span className={`flex flex-1 justify-center py-1.5 rounded-full text-xs font-medium capitalize ${status === "Berhasil"
                        ? "bg-[#009B4F] text-white"
                        : status === "Gagal"
                            ? "bg-[#D31A1D] text-white"
                            : status === "Pending"
                                ? "bg-[#E9B03C] text-white"
                                : "bg-gray-100 text-gray-800"
                        }`}>
                        {status}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "status_booking",
        header: "Status Booking",
        cell: ({ row }) => {
            const status = row.getValue("status_booking") as string
            return (
                <div>
                    <span className={`flex flex-1 justify-center py-1.5 rounded-full text-xs font-medium capitalize ${status === "Aktif"
                        ? "bg-[#009B4F] text-white"
                        : status === "Dibatalkan"
                            ? "bg-[#D31A1D] text-white"
                            : status === "Selesai"
                                ? "bg-[#E9B03C] text-white"
                                : status === "TidakAktif"
                                    ? "bg-[#6B7280] text-white"
                                    : "bg-gray-100 text-gray-800"
                        }`}>
                        {status === "TidakAktif" ? "Tidak Aktif" : status}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "booking_type",
        header: "Tipe Booking",
    },
    {
        accessorKey: "Aksi",
        header: "Aksi",
        cell: ({ row, table }) => {
            return <div>
                <EditBooking row={row} onRefetch={(table.options.meta as any)?.onRefetch} />
            </div>
        }
    }
]
