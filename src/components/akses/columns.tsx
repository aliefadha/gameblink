import type { User } from "@/types/User";
import type { ColumnDef } from "@tanstack/react-table";
import { AksiColumn } from "./AksiColumn";

export const columns: ColumnDef<User>[] = [
    {
        accessorFn: (_, index) => index + 1,
        header: "No",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Level",
        cell: ({ row }) => {
            return row.original.role === "ADMIN" ? "Admin" : "Super Admin"
        }
    },
    {
        id: "aksi",
        header: "Aksi",
        cell: ({ row }) => <AksiColumn row={row} />
    }
]