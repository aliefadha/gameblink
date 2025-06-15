import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteCabang } from "@/lib/api/cabangs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteCabangAlertProps {
    cabangId: string;
    cabangName: string;
}

export function DeleteCabangAlert({ cabangId, cabangName }: DeleteCabangAlertProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteCabang,
        onSuccess: () => {
            toast.success(`Cabang "${cabangName}" berhasil dihapus.`);
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
                        Apakah Anda yakin ingin menghapus cabang "{cabangName}"? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-[#D31A1D] text-white hover:bg-[#B31518]"
                        onClick={() => deleteMutation.mutate(cabangId)}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}