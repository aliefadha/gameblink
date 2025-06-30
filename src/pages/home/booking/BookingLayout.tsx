import { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router";
import useFormStore from "@/store/UseFormStore";
import BookingPage from "./BookingPage";
import BookingCabang from "./BookingCabang";
import BookingJadwal from "./BookingJadwal";
import { MdArrowBack } from "react-icons/md";
import BookingDetail from "./BookingDetail";

const steps = [
    { id: 1, name: "Data Diri", path: "/booking", component: BookingPage },
    { id: 2, name: "Pilih Cabang", path: "/booking/cabang", component: BookingCabang },
    { id: 3, name: "Pilih Jadwal", path: "/booking/jadwal", component: BookingJadwal },
];

function BookingLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { stepOne, stepTwo, stepThree } = useFormStore();
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        const path = location.pathname;
        const step = steps.find(s => s.path === path);
        if (step) {
            setCurrentStep(step.id);
        } else if (path === "/booking") {
            setCurrentStep(1);
        }
    }, [location.pathname]);

    useEffect(() => {
        const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js"
        const script = document.createElement("script");
        script.src = snapScript;
        script.setAttribute("data-client-key", import.meta.env.MIDTRANS_CLIENT_KEY || "");
        script.async = true;
        document.body.appendChild(script);
      }, []);

    useEffect(() => {
        if (currentStep === 2 && !stepOne) {
            navigate('/booking');
        } else if (currentStep === 3 && !stepTwo) {
            navigate('/booking/cabang');
        }
        if (currentStep === 4 && !stepThree) {
            navigate('/booking/jadwal');
        }
    }, [currentStep, stepOne, stepTwo, stepThree, navigate]);

    return (
        <div className="h-screen bg-[url('/images/bg-login.png')] bg-cover">
            <div className="h-1/4 flex flex-col items-center justify-center gap-y-6 relative">
                <div className="w-full flex items-center justify-center relative">
                    {location.pathname !== "/booking" && (
                        <button
                            className="absolute left-4 transition block md:hidden"
                            onClick={() => navigate(-1)}
                            aria-label="Kembali"
                        >
                            <MdArrowBack size={28} className="text-white" />
                        </button>
                    )}
                    <img src="/images/logo.svg" alt="logo" className="mx-auto w-[125px] h-auto" />
                </div>
                <h1 className="text-4xl text-white font-bold text-center" style={{ fontFamily: "Nebula" }}>
                    {location.pathname === "/booking/details"
                        ? "BOOKING SUMMARY"
                        : location.pathname === "/booking/jadwal" && stepTwo?.nama_cabang
                            ? stepTwo.nama_cabang
                            : "BOOKING"
                    }
                </h1>
            </div>
            {/* Main Content */}
            <div className="w-full bg-white rounded-t-3xl h-3/4 p-5">
                <Routes>
                    <Route index element={<BookingPage />} />
                    <Route path="cabang" element={<BookingCabang />} />
                    <Route path="jadwal" element={<BookingJadwal />} />
                    <Route path="details" element={<BookingDetail/>} />
                </Routes>
            </div>
        </div>
    );
}

export default BookingLayout; 