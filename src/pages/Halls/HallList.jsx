import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import Navbar from '../../components/layout/Navbar';

export default function HallList() {
  const [halls,   setHalls]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    api.get('/Halls')
       .then(res => setHalls(res.data))
       .catch(err => console.error(err))
       .finally(() => setLoading(false));
  }, []);

  const filtered = halls.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="text-center mb-2"
          style={{ color: '#8B4A6B' }}>
          Our Wedding Halls
        </h2>
        <p className="text-center text-muted mb-4">
          Find the perfect venue for your special day
        </p>

        {/* Search */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search by name or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Halls Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border"
              style={{ color: '#8B4A6B' }}>
            </div>
            <p className="mt-2 text-muted">Loading halls...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No halls found.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(hall => (
              <div key={hall.id} className="col-md-4">
                <div className="card h-100">
                  <div style={{
                    height:     '200px',
                    background: 'linear-gradient(135deg, #8B4A6B, #6d3a55)',
                    borderRadius: '12px 12px 0 0',
                    display:    'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize:   '4rem'
                  }}>
                    💒
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{hall.name}</h5>
                    <p className="text-muted small mb-1">
                      📍 {hall.location}
                    </p>
                    <p className="text-muted small mb-2">
                      👥 Capacity: {hall.capacity} guests
                    </p>
                    <p className="card-text text-muted flex-grow-1"
                      style={{
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                      {hall.description}
                    </p>
                    <div className="d-flex justify-content-between
                      align-items-center mt-3">
                      <span style={{ color: '#8B4A6B' }}
                        className="fw-bold fs-5">
                        ${hall.basePrice.toLocaleString()}
                      </span>
                      <Link
                        to={`/halls/${hall.id}`}
                        className="btn btn-primary text-white">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}