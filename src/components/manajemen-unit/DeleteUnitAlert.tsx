import { useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { deleteUnit } from "@/lib/api/units";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export function DeleteUnitAlert({ unitId }: { unitId: string }) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteUnit,
        onSuccess: () => {
            toast.success(`Unit berhasil dihapus.`);
            queryClient.invalidateQueries({ queryKey: ['units'] });
        },
        onError: (error) => {
            toast.error(`Gagal menghapus unit: ${error.message}`);
        }
    });
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="link" size="sm" className="text-[#D31A1D] text-center ">
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
                    <AlertDialogAction
                        className="bg-[#D31A1D] text-white hover:bg-[#B31518]"
                        onClick={() => deleteMutation.mutate(unitId)}
                        disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}