import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axiosClient';
import Navbar from '../../components/layout/Navbar';

export default function BookingPage() {
  const { hallId } = useParams();
  const navigate   = useNavigate();

  const [hall,        setHall]        = useState(null);
  const [menus,       setMenus]       = useState([]);
  const [lightings,   setLightings]   = useState([]);
  const [decorations, setDecorations] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);

  const [form, setForm] = useState({
    eventDate:       '',
    startTime:       '10:00',
    endTime:         '22:00',
    numberOfGuests:  100,
    numberOfTables:  10,
    menuPackageId:   '',
    lightingOptionId:'',
    decorationId:    '',
    specialRequests: ''
  });

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get(`/Halls/${hallId}`),
      api.get('/MenuPackages'),
      api.get('/LightingOptions'),
      api.get('/Decorations'),
    ]).then(([h, m, l, d]) => {
      setHall(h.data);
      setMenus(m.data);
      setLightings(l.data);
      setDecorations(d.data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [hallId]);

  useEffect(() => {
    if (!hall) return;
    const menu  = menus.find(m => m.id == form.menuPackageId);
    const light = lightings.find(l => l.id == form.lightingOptionId);
    const decor = decorations.find(d => d.id == form.decorationId);
    const menuCost  = menu  ? menu.pricePerPerson * form.numberOfGuests : 0;
    const lightCost = light ? light.additionalPrice : 0;
    const decorCost = decor ? decor.additionalPrice : 0;
    const tableCost = form.numberOfTables * 25;
    setTotalPrice(hall.basePrice + menuCost + lightCost + decorCost + tableCost);
  }, [form, hall, menus, lightings, decorations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        hallId:          parseInt(hallId),
        eventDate:       form.eventDate,
        startTime:       form.startTime + ':00',
        endTime:         form.endTime   + ':00',
        numberOfGuests:  parseInt(form.numberOfGuests),
        numberOfTables:  parseInt(form.numberOfTables),
        menuPackageId:   parseInt(form.menuPackageId),
        lightingOptionId:parseInt(form.lightingOptionId),
        decorationId:    parseInt(form.decorationId),
        specialRequests: form.specialRequests
      };
      await api.post('/Bookings', payload);
      toast.success('Booking created successfully!');
      navigate('/my-bookings');
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#8B4A6B' }}></div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="mb-4 text-center" style={{ color: '#8B4A6B' }}>
          Book — {hall?.name}
        </h2>
        <div className="row g-4">

          {/* Left: Form */}
          <div className="col-lg-8">
            <form onSubmit={handleSubmit} className="card p-4">

              {/* Date & Time */}
              <h5 className="mb-3">1. Event Date & Time</h5>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Event Date</label>
                  <input type="date" className="form-control"
                    value={form.eventDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm(f => ({
                      ...f, eventDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Start Time</label>
                  <input type="time" className="form-control"
                    value={form.startTime}
                    onChange={e => setForm(f => ({
                      ...f, startTime: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">End Time</label>
                  <input type="time" className="form-control"
                    value={form.endTime}
                    onChange={e => setForm(f => ({
                      ...f, endTime: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Guests & Tables */}
              <h5 className="mb-3">2. Guests & Tables</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Number of Guests</label>
                  <input type="number" className="form-control"
                    value={form.numberOfGuests} min="10" max="2000"
                    onChange={e => setForm(f => ({
                      ...f, numberOfGuests: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Number of Tables</label>
                  <input type="number" className="form-control"
                    value={form.numberOfTables} min="1" max="200"
                    onChange={e => setForm(f => ({
                      ...f, numberOfTables: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Menu Package */}
              <h5 className="mb-3">3. Menu Package</h5>
              <div className="row mb-3">
                {menus.map(m => (
                  <div key={m.id} className="col-md-4 mb-2">
                    <div
                      className={`card p-3 text-center cursor-pointer
                        ${form.menuPackageId == m.id
                          ? 'border-2' : ''}`}
                      style={{
                        cursor: 'pointer',
                        borderColor: form.menuPackageId == m.id
                          ? '#8B4A6B' : '',
                        background: form.menuPackageId == m.id
                          ? '#f8f0f4' : ''
                      }}
                      onClick={() => setForm(f => ({
                        ...f, menuPackageId: m.id }))}
                    >
                      <div className="fw-bold">{m.name}</div>
                      <small className="text-muted">
                        ${m.pricePerPerson}/person
                      </small>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lighting */}
              <h5 className="mb-3">4. Lighting Type</h5>
              <div className="row mb-3">
                {lightings.map(l => (
                  <div key={l.id} className="col-md-4 mb-2">
                    <div
                      className="card p-3 text-center"
                      style={{
                        cursor: 'pointer',
                        borderColor: form.lightingOptionId == l.id
                          ? '#8B4A6B' : '',
                        background: form.lightingOptionId == l.id
                          ? '#f8f0f4' : ''
                      }}
                      onClick={() => setForm(f => ({
                        ...f, lightingOptionId: l.id }))}
                    >
                      <div className="fw-bold">💡 {l.name}</div>
                      <small className="text-muted">
                        +${l.additionalPrice}
                      </small>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decoration */}
              <h5 className="mb-3">5. Decoration Style</h5>
              <div className="row mb-4">
                {decorations.map(d => (
                  <div key={d.id} className="col-md-4 mb-2">
                    <div
                      className="card p-3 text-center"
                      style={{
                        cursor: 'pointer',
                        borderColor: form.decorationId == d.id
                          ? '#8B4A6B' : '',
                        background: form.decorationId == d.id
                          ? '#f8f0f4' : ''
                      }}
                      onClick={() => setForm(f => ({
                        ...f, decorationId: d.id }))}
                    >
                      <div className="fw-bold">✨ {d.name}</div>
                      <small className="text-muted">
                        +${d.additionalPrice}
                      </small>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Requests */}
              <h5 className="mb-3">6. Special Requests</h5>
              <div className="mb-4">
                <textarea className="form-control" rows="3"
                  placeholder="Any special requirements..."
                  value={form.specialRequests}
                  onChange={e => setForm(f => ({
                    ...f, specialRequests: e.target.value }))}
                />
              </div>

              <button type="submit"
                className="btn btn-lg w-100 text-white"
                style={{ background: '#8B4A6B' }}
                disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>
          </div>

          {/* Right: Price Summary */}
          <div className="col-lg-4">
            <div className="card p-4 sticky-top" style={{ top: '20px' }}>
              <h5 className="mb-3">Price Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Hall Base Price</span>
                <span>${hall?.basePrice?.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tables ({form.numberOfTables}x $25)</span>
                <span>${(form.numberOfTables * 25).toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Menu Package</span>
                <span>
                  ${((menus.find(m => m.id == form.menuPackageId)
                    ?.pricePerPerson || 0) * form.numberOfGuests)
                    .toLocaleString()}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Lighting</span>
                <span>
                  ${lightings.find(l => l.id == form.lightingOptionId)
                    ?.additionalPrice?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Decoration</span>
                <span>
                  ${decorations.find(d => d.id == form.decorationId)
                    ?.additionalPrice?.toLocaleString() || '0'}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>TOTAL</span>
                <span style={{ color: '#8B4A6B' }}>
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}