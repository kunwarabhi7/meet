import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/Auth.Context";
import Profile from "./components/Profile";

// Not Found Component (for 404 route)
const NotFound = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
};

const ProtectedRoute = () => {
  const isAuthenticated = false;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const isAuthenticated = false;

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Navbar />

      {/* Define routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard Placeholder</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={<div>Forgot Password Placeholder</div>}
        />
        <Route
          path="/resend-verification"
          element={<div>Resend Verification Placeholder</div>}
        />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
