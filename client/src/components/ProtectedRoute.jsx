import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-teal-50 flex items-center justify-center">
        <div className="text-teal-700 text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
