import { useLocation, useNavigate } from "react-router";
import { FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, message } = location.state || {};

  return (
    <div className="p-5 max-w-[350px] md:max-w-xl lg:max-w-3xl mx-auto gap-y-6 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#222] mb-2">Booking Berhasil!</h1>
        <p className="text-gray-600 mb-4">
          {message || 'Booking Anda telah berhasil dibuat dan sedang diproses.'}
        </p>
        
        {bookingId && (
          <div className="bg-[#FAF8F7] rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">ID Booking:</p>
            <p className="font-mono text-sm font-semibold text-[#222]">{bookingId}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-[#00A651] text-white font-bold"
          >
            Kembali ke Beranda
          </Button>
          
          <Button 
            onClick={() => navigate('/booking')}
            variant="outline"
            className="w-full"
          >
            Buat Booking Baru
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess; 