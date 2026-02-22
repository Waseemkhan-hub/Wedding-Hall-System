import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import Navbar from '../../components/layout/Navbar';

export default function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/Reports/dashboard')
       .then(res => setStats(res.data))
       .catch(err => console.error(err))
       .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon:  '📋',
      color: '#8B4A6B'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue?.toLocaleString()}`,
      icon:  '💰',
      color: '#2E7D32'
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon:  '⏳',
      color: '#F57C00'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon:  '📅',
      color: '#1565C0'
    }
  ] : [];

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="mb-4" style={{ color: '#8B4A6B' }}>
          Admin Dashboard
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border"
              style={{ color: '#8B4A6B' }}></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="row g-4 mb-5">
              {cards.map((card, i) => (
                <div key={i} className="col-md-3">
                  <div className="card p-4 text-center">
                    <div style={{ fontSize: '2.5rem' }}>
                      {card.icon}
                    </div>
                    <div className="fw-bold fs-3 mt-2"
                      style={{ color: card.color }}>
                      {card.value}
                    </div>
                    <div className="text-muted">{card.title}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <h5 className="mb-3">Quick Actions</h5>
            <div className="row g-3">
              {[
                {
                  to:    '/admin/halls',
                  icon:  '🏛️',
                  title: 'Manage Halls',
                  desc:  'Add, edit or remove halls'
                },
                {
                  to:    '/admin/bookings',
                  icon:  '📋',
                  title: 'Manage Bookings',
                  desc:  'Approve or reject bookings'
                }
              ].map((item, i) => (
                <div key={i} className="col-md-4">
                  <Link to={item.to}
                    className="card p-4 text-decoration-none
                      text-dark d-block">
                    <div style={{ fontSize: '2rem' }}>
                      {item.icon}
                    </div>
                    <div className="fw-bold mt-2">{item.title}</div>
                    <small className="text-muted">{item.desc}</small>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}