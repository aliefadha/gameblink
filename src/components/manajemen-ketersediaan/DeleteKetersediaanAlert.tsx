import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteKetersediaan } from "@/lib/api/ketersediaans";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export function DeleteKetersediaanAlert({ ketersediaanId }: { ketersediaanId: string }) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteKetersediaan,
        onSuccess: () => {
            toast.success('Ketersediaan Berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['ketersediaans'] });
        },
        onError: (error) => {
            toast.error(`Gagal menghapus ketersediaan: ${error.message}`);
        }
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="link" size="sm" className="text-[#D31A1D]">
                    Hapus
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#61368E]">Hapus Cabang</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus ketersediaan? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-[#D31A1D] text-white hover:bg-[#B31518]"
                        onClick={() => deleteMutation.mutate(ketersediaanId)}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}