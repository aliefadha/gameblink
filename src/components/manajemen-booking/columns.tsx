import type { Booking } from "@/types/Booking"
import { type ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: "id",
        header: "ID Booking",
    },
    {
        accessorKey: "nama",
        header: "Nama",
    },
    {
        accessorKey: "nomorHp",
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
        accessorKey: "tanggalMain",
        header: "Tanggal Main",
        cell: ({ row }) => {
            const date = new Date(row.getValue("tanggalMain"))
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear()
            return `${day}-${month}-${year}`
        }
    },
    {
        accessorKey: "jamMain",
        header: "Jam Main",
    },
    {
        accessorKey: "tanggalTransaksi",
        header: "Tanggal Transaksi",
        cell: ({ row }) => {
            const date = new Date(row.getValue("tanggalTransaksi"))
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear()
            return `${day}-${month}-${year}`
        }
    },
    {
        accessorKey: "metodePembayaran",
        header: "Metode Pembayaran",
    },
    {
        accessorKey: "totalHarga",
        header: "Total Harga",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalHarga"))
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
        accessorKey: "statusPembayaran",
        header: "Status Pembayaran",
        size: 150,
        cell: ({ row }) => {
            const status = row.getValue("statusPembayaran") as string
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
        accessorKey: "statusBooking",
        header: "Status Booking",
        cell: ({ row }) => {
            const status = row.getValue("statusBooking") as string
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
