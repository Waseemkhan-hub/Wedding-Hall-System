import { useState, useEffect } from 'react';
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

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/Bookings/my')
       .then(res => setBookings(res.data))
       .catch(err => console.error(err))
       .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="mb-4" style={{ color: '#8B4A6B' }}>
          My Bookings
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border"
              style={{ color: '#8B4A6B' }}></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted fs-5">
              You have no bookings yet.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {bookings.map(b => (
              <div key={b.id} className="col-12">
                <div className="card p-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center
                        gap-3 mb-2">
                        <h5 className="mb-0">{b.hallName}</h5>
                        <span className={`badge bg-${
                          statusColors[getStatus(b.status)]
                          || 'warning'}`}>
                          {getStatus(b.status)}
                        </span>
                      </div>
                      <p className="text-muted mb-1">
                        📋 Booking:{' '}
                        <strong>{b.bookingNumber}</strong>
                      </p>
                      <p className="text-muted mb-1">
                        📅 Date:{' '}
                        <strong>{b.eventDate}</strong>
                      </p>
                      <p className="text-muted mb-1">
                        🕐 Time: {b.startTime} — {b.endTime}
                      </p>
                      <p className="text-muted mb-0">
                        👥 Guests: {b.numberOfGuests} |
                        🪑 Tables: {b.numberOfTables}
                      </p>
                      {b.rejectionReason && (
                        <div className="alert alert-danger
                          mt-2 mb-0 py-1">
                          Reason: {b.rejectionReason}
                        </div>
                      )}
                    </div>
                    <div className="col-md-4 text-md-end
                      mt-3 mt-md-0">
                      <div className="fs-4 fw-bold"
                        style={{ color: '#8B4A6B' }}>
                        ${b.totalPrice?.toLocaleString()}
                      </div>
                      <small className="text-muted">
                        Total Price
                      </small>
                      <div className="mt-2">
                        <span className={`badge bg-${
                          statusColors[getStatus(b.status)]
                          || 'warning'} fs-6`}>
                          {getStatus(b.status)}
                        </span>
                      </div>
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