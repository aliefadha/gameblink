import { Routes, Route, Navigate } from 'react-router';

// Import the route protection component we created
import { ProtectedRoute } from './ProtectedRoute';

// Import your primary layout for authenticated pages
import DashboardLayout from '@/layouts/DashboardLayout';

// Import all the page components
import Login from '@/pages/authentication/Login';
import Dashboard from '@/pages/dashboard/Dashboard';
import Booking from '@/pages/dashboard/Booking';
import Cabang from '@/pages/dashboard/Cabang';
import Unit from '@/pages/dashboard/Unit';
import Ketersediaan from '@/pages/dashboard/Ketersediaan';
import DaftarBooking from '@/pages/dashboard/DaftarBooking';
import Akses from '@/pages/dashboard/Akses';
import { BookingLayout } from '@/pages/home/booking';

export function AppRoutes() {
    return (
        <Routes>
            {/* ================================================== */}
            {/* PUBLIC ROUTES                      */}
            {/* ================================================== */}
            {/* The login page is accessible to everyone, logged in or not. */}
            <Route path="/login" element={<Login />} />

            {/* Booking flow routes - using the new BookingLayout */}
            <Route path="/booking/*" element={<BookingLayout />} />

            {/* ================================================== */}
            {/* PROTECTED ROUTES                    */}
            {/* ================================================== */}
            {/* This <Route> acts as a gatekeeper. Any route nested inside
          will first be checked by the ProtectedRoute component. */}
            <Route element={<ProtectedRoute />}>
                {/* The DashboardLayout will be rendered for all nested dashboard routes.
            It contains the sidebar, header, and an <Outlet /> for child routes. */}
                <Route path="dashboard" element={<DashboardLayout />}>
                    {/* The default page when navigating to "/dashboard" */}
                    <Route index element={<Dashboard />} />

                    {/* Other pages that will render inside the DashboardLayout's <Outlet /> */}
                    <Route path="booking" element={<Booking />} />
                    <Route path="cabang" element={<Cabang />} />
                    <Route path="unit" element={<Unit />} />
                    <Route path="ketersediaan" element={<Ketersediaan />} />
                    <Route path="daftar-booking" element={<DaftarBooking />} />
                    <Route path="akses" element={<Akses />} />
                </Route>
            </Route>


            {/* ================================================== */}
            {/* REDIRECTS & FALLBACKS                  */}
            {/* ================================================== */}
            {/* If a user lands on the root path "/", automatically redirect them
          to the booking page. */}
            <Route path="/" element={<Navigate to="/booking" replace />} />

            {/* A catch-all route for any URL that doesn't match the above.
          This acts as your 404 "Not Found" page. */}
            <Route
                path="*"
                element={
                    <div className="flex h-screen w-full flex-col items-center justify-center">
                        <h1 className="text-4xl font-bold">404</h1>
                        <p className="text-lg text-gray-600">Halaman Tidak Ditemukan</p>
                    </div>
                }
            />
        </Routes>
    );
}