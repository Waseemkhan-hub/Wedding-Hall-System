import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuth } from './context/AuthContext';

// Pages
import Home        from './pages/Home/Home';
import Login       from './pages/Auth/Login';
import Register    from './pages/Auth/Register';
import HallList    from './pages/Halls/HallList';
import HallDetail  from './pages/Halls/HallDetail';
import BookingPage from './pages/Booking/BookingPage';
import MyBookings  from './pages/Booking/MyBookings';
import Dashboard   from './pages/Admin/Dashboard';
import ManageHalls from './pages/Admin/ManageHalls';
import ManageBookings from './pages/Admin/ManageBookings';

// Protected Route Component
function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role)
    return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/halls"    element={<HallList />} />
        <Route path="/halls/:id" element={<HallDetail />} />

        {/* Customer Routes */}
        <Route path="/booking/:hallId" element={
          <ProtectedRoute role="Customer">
            <BookingPage />
          </ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute role="Customer">
            <MyBookings />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="Admin">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/halls" element={
          <ProtectedRoute role="Admin">
            <ManageHalls />
          </ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute role="Admin">
            <ManageBookings />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}