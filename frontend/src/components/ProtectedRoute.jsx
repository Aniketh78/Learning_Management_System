import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading, isAuthenticated } = useAuth();

    console.log('ProtectedRoute - user:', user, 'loading:', loading, 'isAuthenticated:', isAuthenticated);

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to /login');
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.log('User role not allowed:', user.role, 'allowed:', allowedRoles);
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
