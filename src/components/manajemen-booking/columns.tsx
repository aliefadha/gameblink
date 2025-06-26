import type { Booking } from "@/types/Booking"
import { type ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: "booking_id",
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
        accessorKey: "cabang",
        header: "Cabang",
    },
    {
        accessorKey: "unit",
        header: "Unit",
    },
    {
        accessorKey: "tanggal_main",
        header: "Tanggal Main",
        cell: ({ row }) => {
            const date = new Date(row.getValue("tanggal_main"))
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear()
            return `${day}-${month}-${year}`
        }
    },
    {
        accessorKey: "jam_main",
        header: "Jam Main",
    },
    {
        accessorKey: "tanggal_transaksi",
        header: "Tanggal Transaksi",
        cell: ({ row }) => {
            const date = new Date(row.getValue("tanggal_transaksi"))
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear()
            return `${day}-${month}-${year}`
        }
    },
    {
        accessorKey: "metode_pembayaran",
        header: "Metode Pembayaran",
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
                    <span className={`flex flex-1 justify-center py-1.5 rounded-full text-xs font-medium capitalize ${status === "berhasil"
                        ? "bg-[#009B4F] text-white"
                        : status === "gagal"
                            ? "bg-[#D31A1D] text-white"
                            : status === "pending"
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
                    <span className={`flex flex-1 justify-center py-1.5 rounded-full text-xs font-medium capitalize ${status === "selesai"
                        ? "bg-[#009B4F] text-white"
                        : status === "dibatalkan"
                            ? "bg-[#D31A1D] text-white"
                            : status === "aktif"
                                ? "bg-[#E9B03C] text-white"
                                : "bg-gray-100 text-gray-800"
                        }`}>
                        {status}
                    </span>
                </div>
            )
        }
    },
]
