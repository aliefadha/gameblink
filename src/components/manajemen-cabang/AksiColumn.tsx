import { type Row } from "@tanstack/react-table";
import { EditCabangDialog } from "./EditCabangDialog";
import { DeleteCabangAlert } from "./DeleteCabangAlert";
import type { Cabang } from "@/types/Cabang";

interface AksiColumnProps {
    row: Row<Cabang>;
}

export function AksiColumn({ row }: AksiColumnProps) {
    const cabang = row.original;

    return (
        <div className="flex items-center justify-start lg:justify-center flex-wrap">
            <EditCabangDialog cabang={cabang} />
            <DeleteCabangAlert cabangId={cabang.id} cabangName={cabang.nama_cabang} />
        </div>
    );
}