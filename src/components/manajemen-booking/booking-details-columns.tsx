import type { BookingDetail } from "@/types/Booking"
import { type ColumnDef } from "@tanstack/react-table"

export const bookingDetailsColumns: ColumnDef<BookingDetail>[] = [
    {
        accessorFn: (_, index) => index + 1,
        header: "No",
        size: 50
    },
    {
        accessorKey: "nama_unit",
        header: "Nama Unit",
        size: 120,
    },
    {
        accessorKey: "tanggal",
        header: "Tanggal",
        size: 100,
        cell: ({ row }) => {
            const date = new Date(row.getValue("tanggal"))
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear()
            return `${day}-${month}-${year}`
        }
    },
    {
        accessorKey: "jam_main",
        header: "Jam Main",
        size: 100,
    },
    {
        accessorKey: "harga",
        header: "Harga",
        size: 120,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("harga"))
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount)
            return formatted.replace(/\s+/g, ' ')
        },
    },
] 