import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axiosClient';
import Navbar from '../../components/layout/Navbar';

const statusColors = {
  Pending:   'warning',
  Approved:  'success',
  Rejected:  'danger',
  Cancelled: 'secondary',
  Completed: 'info'
};

const statusLabels = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
  3: 'Cancelled',
  4: 'Completed'
};

const getStatus = (status) => {
  if (typeof status === 'number') return statusLabels[status];
  return status;
};

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('All');

  const loadBookings = () => {
    setLoading(true);
    api.get('/Bookings')
       .then(res => setBookings(res.data))
       .catch(err => console.error(err))
       .finally(() => setLoading(false));
  };

  useEffect(() => { loadBookings(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/Bookings/${id}/approve`);
      toast.success('Booking approved successfully!');
      loadBookings();
    } catch {
      toast.error('Failed to approve booking.');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await api.put(`/Bookings/${id}/reject`, { reason });
      toast.success('Booking rejected.');
      loadBookings();
    } catch {
      toast.error('Failed to reject booking.');
    }
  };

  const filtered = filter === 'All'
    ? bookings
    : bookings.filter(b => getStatus(b.status) === filter);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="mb-4" style={{ color: '#8B4A6B' }}>
          Manage Bookings
        </h2>

        {/* Filter Tabs */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {['All','Pending','Approved','Rejected','Cancelled'].map(s => (
            <button key={s}
              className={`btn btn-sm ${filter === s
                ? 'btn-primary text-white'
                : 'btn-outline-secondary'}`}
              onClick={() => setFilter(s)}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border"
              style={{ color: '#8B4A6B' }}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No bookings found.</p>
          </div>
        ) : (
          <div className="row g-3">
            {filtered.map(b => (
              <div key={b.id} className="col-12">
                <div className="card p-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center
                        gap-3 mb-2">
                        <h6 className="mb-0 fw-bold">
                          {b.bookingNumber}
                        </h6>
                        <span className={`badge bg-${
                          statusColors[getStatus(b.status)]
                          || 'warning'}`}>
                          {getStatus(b.status)}
                        </span>
                      </div>
                      <p className="mb-1 text-muted">
                        🏛️ Hall: <strong>{b.hallName}</strong>
                      </p>
                      <p className="mb-1 text-muted">
                        📅 Date: <strong>{b.eventDate}</strong>
                        &nbsp;|&nbsp;
                        🕐 {b.startTime} — {b.endTime}
                      </p>
                      <p className="mb-0 text-muted">
                        👥 Guests: {b.numberOfGuests}
                        &nbsp;|&nbsp;
                        💰 Total:{' '}
                        <strong>
                          ${b.totalPrice?.toLocaleString()}
                        </strong>
                      </p>
                    </div>
                    <div className="col-md-4 text-md-end
                      mt-3 mt-md-0">
                      {getStatus(b.status) === 'Pending' && (
                        <div className="d-flex gap-2
                          justify-content-md-end">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApprove(b.id)}>
                            ✓ Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleReject(b.id)}>
                            ✗ Reject
                          </button>
                        </div>
                      )}
                      {getStatus(b.status) !== 'Pending' && (
                        <span className={`badge bg-${
                          statusColors[getStatus(b.status)]} fs-6`}>
                          {getStatus(b.status)}
                        </span>
                      )}
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