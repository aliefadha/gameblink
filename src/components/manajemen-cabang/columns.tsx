import type { Cabang } from "@/types/Cabang"
import { type ColumnDef } from "@tanstack/react-table"
import { AksiColumn } from "./AksiColumn";

export const columns: ColumnDef<Cabang>[] = [
    {
        accessorKey: "nama_cabang",
        header: "Nama Cabang",
    },
    {
        accessorKey: "alamat_cabang",
        header: "Alamat",
    },
    {
        accessorKey: "jumlah_unit",
        header: "Jumlah Unit",
    },
    {
        accessorKey: "status",
        header: "Status",
        size: 100,
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <div>
                    <span className={`flex flex-1 justify-center py-1.5 rounded-full text-xs font-medium capitalize ${status === "aktif"
                        ? "bg-[#009B4F] text-white"
                        : status === "nonaktif"
                            ? "bg-[#D31A1D] text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                        {status === "nonaktif" ? "tidak aktif" : status}
                    </span>
                </div>
            )
        }
    },
    {
        id: "aksi",
        header: "Aksi",
        cell: ({ row }) => <AksiColumn row={row} />
    }
]
