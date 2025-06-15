import type { Ketersediaan } from "@/types/Ketersediaan";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { type Row } from "@tanstack/react-table";

interface AksiColumnProps {
    row: Row<Ketersediaan>;
}

export function AksiColumn({ row }: AksiColumnProps) {
    const data = row.original;
    return (
        <div className="w-full">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="link" className="text-[#D31A1D] px-0" >
                        Hapus
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#61368E] ">Hapus Ketersediaan</AlertDialogTitle>
                        <AlertDialogDescription>
                            Yakin Ingin Menghapus Ketersediaan {data.nama_unit} pada {data.nama_cabang}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-black border-black">Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-[#D31A1D] text-white hover:bg-[#B31518]">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}