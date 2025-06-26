import useFormStore from "@/store/UseFormStore";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { BsCreditCardFill } from "react-icons/bs";
import { FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createBooking, transformFormDataToBookingRequest } from "@/lib/api/bookings";

function formatRupiah(value: number) {
  return "Rp" + value.toLocaleString("id-ID");
}

function BookingDetail() {
  const { stepOne, stepTwo, stepThree, clearForm } = useFormStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stepOne || !stepTwo || !stepThree) {
      navigate("/booking");
    }
  }, [stepOne, stepTwo, stepThree, navigate]);

  const handleSubmitBooking = async () => {
    if (!stepOne || !stepTwo || !stepThree) {
      setError("Data booking tidak lengkap");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const bookingData = transformFormDataToBookingRequest(stepOne, stepTwo, stepThree);
      const response = await createBooking(bookingData);
      
      if (response.success) {
        // Clear form data after successful submission
        clearForm();
        navigate('/booking/success', { 
          state: { 
            bookingId: response.data?.id,
            message: 'Booking berhasil dibuat!' 
          } 
        });
      } else {
        setError(response.message || 'Gagal membuat booking');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const layanan = 0;
  const totalHarga = stepThree?.total_harga || 0;
  const totalBayar = totalHarga + layanan;
  const booking = stepThree?.booking_detail?.[0];

  return (
    <div className="p-5 max-w-[350px] md:max-w-xl lg:max-w-3xl mx-auto gap-y-6 flex flex-col overflow-y-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-[#222]">Detail Pemesan</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="text-xs sm:text-sm font-medium mb-1">Nama</div>
        <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{stepOne?.nama || '-'}</div>
      </div>
      <div className="mb-4">
        <div className="text-xs sm:text-sm font-medium mb-1">No HP</div>
        <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{stepOne?.noHp || '-'}</div>
      </div>
      <div className="mb-4">
        <div className="text-xs sm:text-sm font-medium mb-1">Email</div>
        <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{stepOne?.email || '-'}</div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="bg-[#FAF8F7] rounded-xl p-3 sm:p-4 flex-1 mb-4 md:mb-0">
          <div className="font-bold text-[#222] mb-2 text-base sm:text-lg">Detail Booking</div>
          <div className="text-[#222] mb-1 text-sm sm:text-base">Cabang {stepTwo?.nama_cabang || '-'}</div>
          {booking && (
            <>
              <div className="text-[#222] text-sm sm:text-base">{booking.nama_unit} | {booking.jenis_konsol}</div>
              <div className="text-[#222] text-xs sm:text-sm">
                {stepThree?.tanggal_main ? format(new Date(stepThree.tanggal_main), 'd MMM yyyy', { locale: localeId }) : '-'} |
                {booking.jam_main} - {parseInt(booking.jam_main) + 1}.00
              </div>
            </>
          )}
        </div>
        <div className="bg-[#FAF8F7] rounded-xl p-3 sm:p-4 flex-1">
          <div className="font-bold text-[#222] mb-2 text-base sm:text-lg">Detail Pembayaran</div>
          <div className="flex justify-between text-[#222] mb-1 text-sm sm:text-base">
            <span>Subtotal</span>
            <span>{formatRupiah(totalHarga)}</span>
          </div>
          <div className="flex justify-between text-[#222] text-sm sm:text-base">
            <span>Biaya Layanan</span>
            <span>{formatRupiah(layanan)}</span>
          </div>
        </div>
      </div>
      <button className="w-full bg-[#00A651] text-white font-bold text-base sm:text-lg p-3 rounded-xl flex items-center justify-center gap-2 mb-20">
        <span><BsCreditCardFill className="text-white" /></span>
        Pilih metode pembayaran
        <span className="ml-auto"><FaChevronRight /></span>
      </button>
      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <div className="w-full ">
          <div className="bg-[#61368E] text-white text-center py-2 font-medium text-base w-full">
            Total Harga <span className="font-bold">{formatRupiah(totalBayar)}</span>
          </div>
          <button 
            className="w-full bg-[#00A651] text-white font-bold text-base sm:text-lg py-3 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSubmitBooking}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'MEMPROSES...' : 'BAYAR'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingDetail;