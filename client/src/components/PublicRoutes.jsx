import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";

export const PublicRoute = () => {
  const { user, isLoading } = useAuth();

  console.log("PublicRoute - User:", user, "IsLoading:", isLoading); // Debug

  if (isLoading) {
    return (
      <div className="min-h-screen bg-teal-50 flex items-center justify-center">
        <div className="text-teal-700 text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
