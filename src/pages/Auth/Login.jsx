import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.fullName}!`);
      if (user.role === 'Admin') navigate('/admin');
      else navigate('/halls');
    } catch (err) {
      toast.error('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card p-4 shadow-sm">
              <h3 className="text-center mb-4"
                style={{ color: '#8B4A6B' }}>
                Welcome Back
              </h3>
              <form onSubmit={handleSubmit}>
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
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm(f => ({
                      ...f, password: e.target.value }))}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 text-white"
                  disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <p className="text-center mt-3 mb-0">
                Don't have an account?{' '}
                <Link to="/register"
                  style={{ color: '#8B4A6B' }}>
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}