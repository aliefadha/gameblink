import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/lib/api/akses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteUserAlertProps {
    userId: string;
    namaUser: string;
}

export function DeleteUserAlert({ userId, namaUser }: DeleteUserAlertProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast.success(`User "${namaUser}" berhasil dihapus.`);
            queryClient.invalidateQueries({ queryKey: ['cabangs'] });
        },
        onError: (error) => {
            toast.error(`Gagal menghapus cabang: ${error.message}`);
        }
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="link" className="text-[#D31A1D]">
                    Hapus
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#61368E]">Hapus Cabang</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus user "{namaUser}"? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-[#D31A1D] text-white hover:bg-[#B31518]"
                        onClick={() => deleteMutation.mutate(userId)}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}