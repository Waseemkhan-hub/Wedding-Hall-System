import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';

export default function HallDetail() {
  const { id }    = useParams();
  const { user }  = useAuth();
  const [hall,    setHall]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/Halls/${id}`)
       .then(res => setHall(res.data))
       .catch(err => console.error(err))
       .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="text-center py-5">
        <div className="spinner-border"
          style={{ color: '#8B4A6B' }}></div>
      </div>
    </>
  );

  if (!hall) return (
    <>
      <Navbar />
      <div className="text-center py-5">
        <p>Hall not found.</p>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row g-4">

          {/* Left - Image */}
          <div className="col-lg-6">
            <div style={{
              height:     '400px',
              background: 'linear-gradient(135deg, #8B4A6B, #6d3a55)',
              borderRadius: '16px',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize:   '6rem'
            }}>
              💒
            </div>
          </div>

          {/* Right - Details */}
          <div className="col-lg-6">
            <h2 style={{ color: '#8B4A6B' }}>{hall.name}</h2>
            <p className="text-muted">📍 {hall.location}</p>
            <p className="mt-3">{hall.description}</p>

            <div className="row g-3 my-3">
              <div className="col-6">
                <div className="card text-center p-3">
                  <div className="fw-bold fs-4"
                    style={{ color: '#8B4A6B' }}>
                    {hall.capacity}
                  </div>
                  <small className="text-muted">Max Guests</small>
                </div>
              </div>
              <div className="col-6">
                <div className="card text-center p-3">
                  <div className="fw-bold fs-4"
                    style={{ color: '#8B4A6B' }}>
                    ${hall.basePrice.toLocaleString()}
                  </div>
                  <small className="text-muted">Base Price</small>
                </div>
              </div>
            </div>

            <div className="mt-4">
              {user?.role === 'Customer' ? (
                <Link
                  to={`/booking/${hall.id}`}
                  className="btn btn-primary btn-lg
                    text-white w-100">
                  Book This Hall
                </Link>
              ) : !user ? (
                <Link
                  to="/login"
                  className="btn btn-primary btn-lg
                    text-white w-100">
                  Login to Book
                </Link>
              ) : (
                <div className="alert alert-info">
                  Admin accounts cannot make bookings.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}