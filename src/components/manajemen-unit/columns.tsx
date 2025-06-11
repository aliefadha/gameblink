
import type { Unit } from "@/types/Unit"
import { type ColumnDef } from "@tanstack/react-table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Button } from "../ui/button"

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
        cell: () => {
            return (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="link" className="text-[#D31A1D] text-center w-full">
                            Hapus
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#61368E] ">Hapus Unit</AlertDialogTitle>
                            <AlertDialogDescription>
                                Yakin Ingin Menghapus Unit
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="text-black border-black">Batal</AlertDialogCancel>
                            <AlertDialogAction className="bg-[#D31A1D] text-white hover:bg-[#B31518]">Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )
        }
    }
]
