import type { Ketersediaan } from "@/types/Ketersediaan"
import { type ColumnDef } from "@tanstack/react-table"
import EditKetersediaanDialog from "./EditKetersediaanDialog"
import { DeleteKetersediaanAlert } from "./DeleteKetersediaanAlert"

export const columns: ColumnDef<Ketersediaan>[] = [
    {
        accessorFn: (_, index) => index + 1,
        header: "ID",
        size: 30,
    },
    {
        accessorKey: "nama_cabang",
        header: "Nama Cabang",
        size: 100,
    },
    {
        accessorKey: "nama_unit",
        header: "Nama Unit",
        size: 75
    },
    {
        accessorKey: "tanggal_mulai_blokir",
        header: "Tanggal Mulai Blokir",
        size: 75,
        cell: ({ row }) => {
            const date = new Date(row.getValue("tanggal_mulai_blokir"))
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear()
            return `${day}-${month}-${year}`
        }
    },
    {
        accessorKey: "jam_mulai_blokir",
        header: "Jam Mulai Blokir",
        size: 75,
    },
    {
        accessorKey: "tanggal_selesai_blokir",
        header: "Tanggal Selesai Blokir",
        size: 75,
        cell: ({ row }) => {
            const dateValue = row.getValue("tanggal_selesai_blokir")
            if (!dateValue) return "-"
            
            const date = new Date(dateValue as string)
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear()
            return `${day}-${month}-${year}`
        }
    },
    {
        accessorKey: "jam_selesai_blokir",
        header: "Jam Selesai Blokir",
        size: 75,
        cell: ({ row }) => {
            const timeValue = row.getValue("jam_selesai_blokir")
            if (!timeValue) return "-"
            return timeValue as string
        }
    },
    {
        accessorKey: "keterangan",
        header: "Keterangan",
    },
    {
        accessorKey: "status_perbaikan",
        header: "Status Perbaikan",
    },
    {
        id: "aksi",
        header: "Aksi",
        cell: ({ row }) => (
            <div className="flex  items-center justify-start lg:justify-center flex-wrap">
                <EditKetersediaanDialog ketersediaan={row.original} />
                <DeleteKetersediaanAlert ketersediaanId={row.original.id_ketersediaan} />
            </div>
        ),
        size: 120
    }
]
