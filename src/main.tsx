import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Dashboard from './pages/dashboard/Dashboard.tsx'
import DashboardLayout from './layouts/DashboardLayout.tsx'
import Booking from './pages/dashboard/Booking.tsx'
import Cabang from './pages/dashboard/Cabang.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Unit from './pages/dashboard/Unit.tsx'
import Ketersediaan from './pages/dashboard/Ketersediaan.tsx'
import { Toaster } from 'sonner'
import DaftarBooking from './pages/dashboard/DaftarBooking.tsx'

async function enableMocking() {
  // Run mock service worker only in development
  if (import.meta.env.VITE_API_MOCKING !== 'true') {
    return;
  }

  const { worker } = await import('./mocks/browser.ts');

  // `onUnhandledRequest` is a good way to see if you missed a handler
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

const queryClient = new QueryClient()

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="booking" element={<Booking />} />
              <Route path="cabang" element={<Cabang />} />
              <Route path="unit" element={<Unit />} />
              <Route path="ketersediaan" element={<Ketersediaan />} />
              <Route path="daftar-booking" element={<DaftarBooking />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode >,
  )
})
