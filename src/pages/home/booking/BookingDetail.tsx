/* eslint-disable @typescript-eslint/no-explicit-any */
import useFormStore from "@/store/UseFormStore";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createBooking, transformFormDataToBookingRequest } from "@/lib/api/bookings";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";

function formatRupiah(value: number) {
  return "Rp" + value.toLocaleString("id-ID");
}


function BookingDetail() {
  const { stepOne, stepTwo, stepThree } = useFormStore();
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
      
      if (response.message === "Success") {
        (window as any).snap.pay(response.data.token);
        return;
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
  const bookingDetails = stepThree?.booking_detail || [];

  return (
    <div className="p-5 max-w-[350px] md:max-w-xl lg:max-w-3xl mx-auto gap-y-0 flex flex-col overflow-y-auto">
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
      <div className="flex flex-col md:flex-row gap-4 mb-24">
        <div className="bg-[#FAF8F7] rounded-xl p-3 sm:p-4 flex-1 mb-4 md:mb-0">
          <div className="font-bold text-[#222] mb-2 text-base sm:text-lg">Detail Booking</div>
          <div className="text-[#222] mb-1 text-sm sm:text-base">Cabang {stepTwo?.nama_cabang || '-'}</div>
          {bookingDetails.length > 0 && (
            <>
              <div className="text-[#222] text-sm sm:text-base">
                {bookingDetails.length} slot dipilih
              </div>
              <div className="text-[#222] text-xs sm:text-sm">
                {stepThree?.tanggal_main ? format(new Date(stepThree.tanggal_main), 'd MMM yyyy', { locale: localeId }) : '-'}
              </div>
            </>
          )}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="w-full mt-3 bg-[#61368E] text-white text-center py-2 font-medium text-sm rounded-lg cursor-pointer select-none hover:bg-[#4a2a6b] transition-colors">
                Lihat Detail Booking
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-center">Detail Pesanan</DrawerTitle>
                <DrawerDescription className="text-center sr-only">Rincian slot yang kamu pilih.</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-4 max-h-100 overflow-y-auto">
                {bookingDetails.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center">Belum ada slot dipilih.</div>
                ) : (
                  <div className="bg-[#FAF8F7] rounded-xl p-4 w-full">
                    <div className="font-bold text-[#222] mb-2">Detail Booking</div>
                    <div className="text-[#222] mb-1">Cabang {stepTwo?.nama_cabang || '-'}</div>
                    {bookingDetails.map((booking, idx) => (
                      <div key={idx} className="mb-2 last:mb-0 flex justify-between items-center">
                        <div>
                          <div className="text-[#222]">{booking.nama_unit} | {booking.jenis_konsol}</div>
                          <div className="text-[#222] text-sm">
                            {stepThree?.tanggal_main ? format(new Date(stepThree.tanggal_main), 'd MMM yyyy', { locale: localeId }) : '-'} |
                            {` ${booking.jam_main} - ${parseInt(booking.jam_main) + 1}.00`}
                          </div>
                        </div>
                        <div className="text-[#222] font-medium whitespace-nowrap">{formatRupiah(booking.harga)}</div>
                      </div>
                    ))}
                    <div className="border-t border-[#E5E5E5] mt-3 pt-3 flex justify-between items-center">
                      <span className="font-semibold text-[#222]">Total Harga</span>
                      <span className="font-bold text-[#222]">{formatRupiah(totalHarga)}</span>
                    </div>
                  </div>
                )}
              </div>
              <DrawerClose asChild>
                <button className="w-full bg-[#00A651] text-white font-bold text-lg py-3 mt-2 focus:outline-none" style={{ letterSpacing: 1 }}>
                  TUTUP
                </button>
              </DrawerClose>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="bg-[#FAF8F7] rounded-xl p-3 sm:p-4 flex-1 mb-24 lg:mb-0">
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