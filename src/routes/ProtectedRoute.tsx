import { useAuth } from '@/hooks/use-auth';
import type { User } from '@/types/User';
import { Navigate, Outlet } from 'react-router';

export function ProtectedRoute({ allowedRoles }: { allowedRoles: User['role'][] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user || !allowedRoles.includes(user.role)) {
    if (user?.role === 'ADMIN') {
      return <Navigate to="/dashboard/booking" replace />;
    } else if (user?.role === 'SUPERADMIN') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }
  return <Outlet />;
}