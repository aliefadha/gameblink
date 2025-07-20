import { getCabangs } from "@/lib/api/cabangs";
import useFormStore, { type StepTwoData } from "@/store/UseFormStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function BookingCabang() {
    const navigate = useNavigate();
    const { stepOne, setData } = useFormStore();
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    const { data: cabangs, isLoading } = useQuery({
        queryKey: ['cabangs'],
        queryFn: async () => {
            try {
                return await getCabangs();
            } catch (error: unknown) {
                if (error instanceof Error) {
                    if (error.message.includes("Status: 404")) {
                        return [];
                    }
                }
                throw error;
            }
        },
    });

    useEffect(() => {
        if (!stepOne) {
            navigate('/booking')
        }
    }, [stepOne, navigate])

    const handleCabang = (data: StepTwoData) => {
        setData({ step: 2, data });
        navigate('/booking/jadwal');
    };

    const handleImageLoad = (cabangId: string) => {
        setLoadedImages(prev => new Set(prev).add(cabangId));
    };

    return (
        <div className="py-10 max-w-[350px] md:max-w-xl lg:max-w-3xl mx-auto gap-y-6 flex flex-col h-full">
            <h1 className="font-semibold md:text-xl lg:text-2xl">Pilih Cabang</h1>
            {isLoading ? (
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#61368E]"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {cabangs && cabangs.filter(cabang => (cabang.status === 'Aktif' && cabang.jumlah_unit > 0)).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                            <span className="text-lg font-medium">Tidak ada cabang</span>
                        </div>
                    ) : (
                        cabangs?.filter(cabang => cabang.status === 'Aktif' && cabang.jumlah_unit > 0).map((cabang) => (
                            <button
                                className="w-full h-[70px] relative"
                                key={cabang.id}
                                onClick={() => handleCabang({
                                    id_cabang: `${cabang.id}`,
                                    nama_cabang: `${cabang.nama_cabang}`
                                })}>
                                <div className="w-full h-[70px] relative">
                                    {/* Background skeleton */}
                                    <div className="h-full w-full bg-gradient-to-r from-[#000000] to-[#61368E] rounded-xl opacity-80"></div>
                                    
                                    {/* Image that loads in background */}
                                    <img 
                                        src={`${import.meta.env.VITE_API_BASE_URL}${cabang.imageCabang}`} 
                                        className={`h-full w-full object-cover rounded-xl object-center absolute inset-0 transition-opacity duration-300 ${
                                            loadedImages.has(cabang.id.toString()) ? 'opacity-100' : 'opacity-0'
                                        }`}
                                        onLoad={() => handleImageLoad(cabang.id.toString())}
                                    />
                                    
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-r opacity-80 from-[#000000] to-[#61368E] rounded-xl"></div>
                                    
                                    {/* Text content - always visible */}
                                    <div className="absolute inset-0 flex items-center justify-start p-4">
                                        <h1 className="text-white font-bold font-play-bold">{cabang.nama_cabang}</h1>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default BookingCabang;