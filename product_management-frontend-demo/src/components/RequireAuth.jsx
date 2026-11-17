import { Navigate, Outlet, useLocation } from "react-router";

import useAuth from "../hooks/useAuth";

// Wrap routes that need a logged-in user. Pass role="ADMIN" | "USER" to restrict further.
export default function RequireAuth({ role }) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <p>Loading...</p>;

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
