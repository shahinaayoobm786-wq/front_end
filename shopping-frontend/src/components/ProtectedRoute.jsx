import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        return (
            <div style={{ padding: "50px", textAlign: "center" }}>
                <h2>Access Denied</h2>
                <p>You must have Admin privileges to access this page.</p>
            </div>
        );
    }

    return children;
}
