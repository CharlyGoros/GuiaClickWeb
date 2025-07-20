import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

interface PrivateRouteProps {
    element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { user, initialized } = useAuth();
    console.log("PrivateRoute: initialized =", initialized, "user =", user);

    if (!initialized) {
        return <div className="p-10 text-center">Verificando sesión...</div>;
    }

    return user ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
