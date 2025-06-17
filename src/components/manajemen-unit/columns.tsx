
import type { Unit } from "@/types/Unit"
import { type ColumnDef } from "@tanstack/react-table"
import { DeleteUnitAlert } from "./DeleteUnitAlert"

export const columns: ColumnDef<Unit>[] = [
    {
        accessorKey: "nama_unit",
        header: "Unit",
    },
    {
        accessorKey: "jenis_konsol",
        header: "Jenis Konsol",
    },
    {
        accessorKey: "harga",
        header: "Harga",
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
    {
        id: "aksi",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            return (
                <DeleteUnitAlert unitId={row.original.id} />
            )
        }
    }
]
