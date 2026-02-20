import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          💒 Wedding Hall
        </Link>

        <button className="navbar-toggler" type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/halls">
                Our Halls
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-primary text-white ms-2"
                    to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {user.role === 'Admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      Dashboard
                    </Link>
                  </li>
                )}
                {user.role === 'Customer' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/my-bookings">
                      My Bookings
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <span className="nav-link text-muted">
                    Hi, {user.fullName}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-secondary ms-2"
                    onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}