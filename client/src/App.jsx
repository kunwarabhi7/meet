import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./context/Auth.Context";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoutes";
import { EventProvider } from "./context/Event.Context";
import CreateEvent from "./components/CreateEvent";
import ViewEvent from "./components/ViewEvent";
import EditEvent from "./components/EditEvent";

// New PublicRoute component

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/event/:eventId" element={<ViewEvent />} />
              <Route path="/event/:eventId/edit" element={<EditEvent />} />
            </Route>
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
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
