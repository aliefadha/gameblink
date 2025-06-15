import { Routes, Route, Navigate } from 'react-router';

// Import your layouts and pages
import DashboardLayout from '@/layouts/DashboardLayout';
import Dashboard from '@/pages/dashboard/Dashboard';
import Booking from '@/pages/dashboard/Booking';
import Cabang from '@/pages/dashboard/Cabang';
import Unit from '@/pages/dashboard/Unit';
import Ketersediaan from '@/pages/dashboard/Ketersediaan';
import DaftarBooking from '@/pages/dashboard/DaftarBooking';
import Login from '@/pages/authentication/Login';

// Import the ProtectedRoute component we created earlier
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* The root path now redirects. If a user goes to "/", 
        they will be sent to the dashboard, which will then be 
        checked by the ProtectedRoute.
      */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="booking" element={<Booking />} />
                    <Route path="cabang" element={<Cabang />} />
                    <Route path="unit" element={<Unit />} />
                    <Route path="ketersediaan" element={<Ketersediaan />} />
                    <Route path="daftar-booking" element={<DaftarBooking />} />
                </Route>
            </Route>

            {/* Optional: Add a 404 Not Found route */}
            <Route path="*" element={<div>404 - Halaman Tidak Ditemukan</div>} />
        </Routes>
    );
}