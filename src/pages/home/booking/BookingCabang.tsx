import { getCabangs } from "@/lib/api/cabangs";
import useFormStore, { type StepTwoData } from "@/store/UseFormStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function BookingCabang() {
    const navigate = useNavigate();
    const { stepOne, setData } = useFormStore();
    const onSubmit = (data: StepTwoData) => {
        console.log(data);
        setData({ step: 2, data });
        navigate('/booking/jadwal');
    };

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
            navigate('/')
        }
    })

    const handleCabang = (data: StepTwoData) => {
        onSubmit(data);
    };

    return (
        <div className="h-screen w-full bg-[url('/images/bg-login.png')] bg-cover">
            <div className="h-1/4 text-center flex flex-col items-center justify-center gap-y-6">
                <img src="/images/logo.svg" alt="logo" className="mx-auto w-[125px] h-auto " />
                <h1 className="text-4xl text-white font-bold font-nebula">BOOKING</h1>
            </div>
            <div className="w-full bg-white rounded-t-3xl h-3/4">
                <div className="py-10 max-w-[350px] md:max-w-xl lg:max-w-3xl mx-auto gap-y-6 flex flex-col h-full">
                    <h1 className="font-semibold md:text-xl lg:text-2xl">Pilih Cabang</h1>
                    {isLoading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : (
                        <div className="space-y-5">
                            {cabangs?.map((cabang) => (
                                <button
                                    className="w-full h-[70px] relative"
                                    key={cabang.id}
                                    onClick={() => handleCabang({
                                        id_cabang: `${cabang.id}`,
                                        nama_cabang: `${cabang.nama_cabang}`
                                    })}>
                                    <div className="w-full h-[70px] relative">
                                        <img src={`${import.meta.env.VITE_API_BASE_URL}${cabang.imageCabang}`} className="h-full w-full object-cover rounded-xl" />
                                        <div className="absolute inset-0 bg-linear-to-r opacity-80 from-[#000000] to-[#61368E] rounded-2xl"></div>
                                        <div className="absolute inset-0 flex items-center justify-start p-4">
                                            <h1 className="text-white font-semibold">{cabang.nama_cabang}</h1>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookingCabang;