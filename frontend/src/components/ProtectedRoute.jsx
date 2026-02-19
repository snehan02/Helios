import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token"); // must match your login storage key

    // If not logged in → go to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If logged in → allow pages
    return <Outlet />;
};

export default ProtectedRoute;