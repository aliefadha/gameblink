import { useSearchParams } from "react-router";

function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const transactionStatus = searchParams.get("transaction_status");

  return (
    <div className="h-screen bg-[url('/images/bg-login.webp')] bg-cover flex items-center justify-center flex-col gap-y-12">
      <img src="/images/logo.svg" alt="logo" className="mx-auto w-[200px] h-auto" />
      <div className="bg-white p-5 max-w-[350px] md:max-w-xl lg:max-w-3xl mx-auto gap-y-6 flex flex-col items-center justify-center rounded-xl">
        <div className="text-center">
          <img
            src="/images/logo-success.webp"
            alt="Booking Success Astronaut"
            className="mx-auto mb-4"
            style={{ height: 200, width: 230, objectFit: 'cover' }}
          />
          <h1 className="text-2xl font-bold text-[#222] mb-2">Pembayaran Booking {transactionStatus === "pending" ? "Pending " : "Berhasil"}</h1>
          <p className="text-gray-600 mb-4 text-sm md:text-base">
            Cek email sekarang! Kami telah mengirimkan bukti pembayaran ke email kamu (Jangan lupa cek folder spam). Lalu tunjukkan bukti tersebut ke operator kami saat akan bermain di Gameblink
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess; 