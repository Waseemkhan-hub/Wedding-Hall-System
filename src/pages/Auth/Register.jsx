import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';

export default function Register() {
  const [form, setForm] = useState({
    fullName:    '',
    email:       '',
    password:    '',
    phoneNumber: '',
    address:     ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;
  setLoading(true);
  try {
    await api.post('/Auth/register', form);
    toast.success('Registration successful!');
    const user = await login(form.email, form.password);
    if (user.role === 'Admin') navigate('/admin');
    else navigate('/halls');
  } catch (err) {
    const errors = err.response?.data?.errors;
    if (errors) {
      const messages = Object.values(errors).flat();
      messages.forEach(msg => toast.error(msg));
    } else {
      const msg = err.response?.data?.message
        || 'Registration failed.';
      toast.error(msg);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow-sm">
              <h3 className="text-center mb-4"
                style={{ color: '#8B4A6B' }}>
                Create Account
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={e => setForm(f => ({
                      ...f, fullName: e.target.value }))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={e => setForm(f => ({
                      ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={e => setForm(f => ({
                      ...f, password: e.target.value }))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter phone number"
                    value={form.phoneNumber}
                    onChange={e => setForm(f => ({
                      ...f, phoneNumber: e.target.value }))}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">
                    Address (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your address"
                    value={form.address}
                    onChange={e => setForm(f => ({
                      ...f, address: e.target.value }))}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 text-white"
                  disabled={loading}>
                  {loading ? 'Creating account...' : 'Register'}
                </button>
              </form>
              <p className="text-center mt-3 mb-0">
                Already have an account?{' '}
                <Link to="/login"
                  style={{ color: '#8B4A6B' }}>
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}