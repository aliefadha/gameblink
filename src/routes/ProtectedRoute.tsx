
import { useAuth } from '@/hooks/use-auth';
import { Link, Outlet } from 'react-router';

export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!isAuthenticated) {
        return <Link to="/login" replace />;
    }

    return <Outlet />; // Renders the child route element
}