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
    <>
      <Navbar />

      {/* Define routes */}
      <Routes>
        {/* Public Routes (Only accessible if not logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes (Only accessible if logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Home />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
