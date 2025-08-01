import { type Row } from "@tanstack/react-table";
import { EditUnitDialog } from "./EditUnitDialog";
import { DeleteUnitAlert } from "./DeleteUnitAlert";
import type { Unit } from "@/types/Unit";

interface AksiColumnProps {
    row: Row<Unit>;
}

export function AksiColumn({ row }: AksiColumnProps) {
    const unit = row.original;

    return (
        <div className="flex items-center justify-start lg:justify-center flex-wrap">
            <EditUnitDialog unit={unit} />
            <DeleteUnitAlert unitId={unit.id} />
        </div>
    );
}