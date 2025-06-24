import { type Row } from "@tanstack/react-table";
import type { User } from "@/types/User";
import { DeleteUserAlert } from "./DeleteUserAlert";

interface AksiColumnProps {
    row: Row<User>;
}

export function AksiColumn({ row }: AksiColumnProps) {
    const user = row.original;

    return (
        <div className="flex items-center justify-start lg:justify-center  flex-wrap">
            {/* <EditCabangDialog cabang={user} /> */}
            <DeleteUserAlert userId={user.id} namaUser={user.name} />
        </div>
    );
}