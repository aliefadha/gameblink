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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function formatRupiah(value: number) {
  return "Rp" + value.toLocaleString("id-ID");
}

function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '-';

  // Remove any non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  // If it starts with 62, format as +62 8xxx-xxxx-xxxx
  if (digits.startsWith('62')) {
    const mainNumber = digits.substring(2);
    if (mainNumber.length >= 9) {
      return `+62 ${mainNumber.substring(0, 4)}-${mainNumber.substring(4, 8)}-${mainNumber.substring(8)}`;
    }
  }

  // If it starts with 0, remove the 0 and format as +62 8xxx-xxxx-xxxx
  if (digits.startsWith('0')) {
    const mainNumber = digits.substring(1);
    if (mainNumber.length >= 9) {
      return `+62 ${mainNumber.substring(0, 4)}-${mainNumber.substring(4, 8)}-${mainNumber.substring(8)}`;
    }
  }

  // If it starts with 8, format as +62 8xxx-xxxx-xxxx
  if (digits.startsWith('8') && digits.length >= 9) {
    return `+62 ${digits.substring(0, 4)}-${digits.substring(4, 8)}-${digits.substring(8)}`;
  }

  // Return original if doesn't match expected patterns
  return phoneNumber;
}


function BookingDetail() {
  const { stepOne, stepTwo, stepThree } = useFormStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<string>('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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
      // Update stepThree with the final total including service fee
      const updatedStepThree = {
        ...stepThree,
        metode_pembayaran: paymentType
      };


      // Update the store with the final total
      const { setData } = useFormStore.getState();
      setData({ step: 3, data: updatedStepThree });

      const bookingData = transformFormDataToBookingRequest(stepOne, stepTwo, updatedStepThree);
      const response = await createBooking(bookingData);

      if (response.message === "Success") {
        setIsPaymentModalOpen(false);
        (window as any).snap.pay(response.data.token, {
          selectedPaymentType: paymentType
        });
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



  const totalHarga = stepThree?.total_harga || 0;

  // Dynamic service fee calculation based on payment type
  const calculateServiceFee = (paymentMethod: string, subtotal: number): number => {
    switch (paymentMethod) {
      case 'bank_transfer':
        return 4000;
      case 'gopay':
        return Math.round(subtotal * 0.02);
      case 'shopeepay':
        return Math.round(subtotal * 0.02);
      case 'dana':
        return Math.round(subtotal * 0.015);
      case 'qris':
        return Math.round(subtotal * 0.007);
      default:
        return 0;
    }
  };

  const layanan = calculateServiceFee(paymentType, totalHarga);
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
        <div className="bg-[#FAF8F7] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{formatPhoneNumber(stepOne?.noHp || '')}</div>
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
          <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
            <DialogTrigger asChild>
              <button
                className="w-full bg-[#00A651] text-white font-bold text-base sm:text-lg py-3 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'MEMPROSES...' : 'BAYAR'}
              </button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-bold">Pilih Metode Pembayaran</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pilih Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: 'bank_transfer', label: 'Transfer Bank', icon: '/images/payment-icons/bank-transfer.svg' },
                      // { value: 'gopay', label: 'GoPay', icon: '/images/payment-icons/gopay.svg' },
                      // { value: 'shopeepay', label: 'ShopeePay', icon: '/images/payment-icons/shopeepay.svg' },
                      // { value: 'dana', label: 'Dana', icon: '/images/payment-icons/dana.svg' },
                      // { value: 'qris', label: 'QRIS', icon: '/images/payment-icons/qris.svg' }
                    ].map((method) => (
                      <div
                        key={method.value}
                        className={`border-2 rounded-lg p-2 sm:p-3 cursor-pointer transition-all hover:shadow-md ${paymentType === method.value
                          ? 'border-[#00A651] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => setPaymentType(method.value)}
                      >
                        <div className="flex flex-col sm:flex-col items-center text-center">
                          <div className="w-10 h-6 sm:w-12 sm:h-8 flex items-center justify-center mb-1 sm:mb-2">
                            <img
                              src={method.icon}
                              alt={method.label}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className={`text-xs sm:text-sm font-medium ${paymentType === method.value
                            ? 'text-[#00A651]'
                            : 'text-gray-700'
                            }`}>
                            {method.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Ringkasan Pembayaran</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatRupiah(totalHarga)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Layanan</span>
                      <span>{formatRupiah(layanan)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-base">
                      <span>Total Pembayaran</span>
                      <span className="text-[#00A651]">{formatRupiah(totalBayar)}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    className="flex-1 px-4 py-2 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                    onClick={() => setIsPaymentModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Batal
                  </button>
                  <button
                    className="flex-1 px-4 py-2 sm:py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008a45] disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                    onClick={handleSubmitBooking}
                    disabled={isSubmitting || !paymentType}
                  >
                    {isSubmitting ? 'Memproses...' : 'Bayar Sekarang'}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default BookingDetail;