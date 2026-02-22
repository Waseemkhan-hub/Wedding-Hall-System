import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axiosClient';
import Navbar from '../../components/layout/Navbar';

const empty = {
  name: '', description: '',
  location: '', capacity: '',
  basePrice: '', isAvailable: true
};

export default function ManageHalls() {
  const [halls,   setHalls]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showing, setShowing] = useState(false);

  const loadHalls = () => {
    api.get('/Halls')
       .then(res => setHalls(res.data))
       .catch(err => console.error(err))
       .finally(() => setLoading(false));
  };

  useEffect(() => { loadHalls(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/Halls/${editing}`, form);
        toast.success('Hall updated successfully!');
      } else {
        await api.post('/Halls', form);
        toast.success('Hall created successfully!');
      }
      setForm(empty);
      setEditing(null);
      setShowing(false);
      loadHalls();
    } catch (err) {
      toast.error('Operation failed.');
    }
  };

  const handleEdit = (hall) => {
    setForm({
      name:        hall.name,
      description: hall.description,
      location:    hall.location,
      capacity:    hall.capacity,
      basePrice:   hall.basePrice,
      isAvailable: hall.isAvailable
    });
    setEditing(hall.id);
    setShowing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hall?')) return;
    try {
      await api.delete(`/Halls/${id}`);
      toast.success('Hall deleted.');
      loadHalls();
    } catch {
      toast.error('Delete failed.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="d-flex justify-content-between
          align-items-center mb-4">
          <h2 style={{ color: '#8B4A6B' }}>Manage Halls</h2>
          <button
            className="btn btn-primary text-white"
            onClick={() => {
              setForm(empty);
              setEditing(null);
              setShowing(true);
            }}>
            + Add New Hall
          </button>
        </div>

        {/* Form */}
        {showing && (
          <div className="card p-4 mb-4">
            <h5 className="mb-3">
              {editing ? 'Edit Hall' : 'Add New Hall'}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Hall Name</label>
                  <input className="form-control"
                    value={form.name}
                    onChange={e => setForm(f => ({
                      ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Location</label>
                  <input className="form-control"
                    value={form.location}
                    onChange={e => setForm(f => ({
                      ...f, location: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="2"
                    value={form.description}
                    onChange={e => setForm(f => ({
                      ...f, description: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Capacity</label>
                  <input type="number" className="form-control"
                    value={form.capacity}
                    onChange={e => setForm(f => ({
                      ...f, capacity: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Base Price ($)</label>
                  <input type="number" className="form-control"
                    value={form.basePrice}
                    onChange={e => setForm(f => ({
                      ...f, basePrice: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Available</label>
                  <select className="form-select"
                    value={form.isAvailable}
                    onChange={e => setForm(f => ({
                      ...f, isAvailable: e.target.value === 'true' }))}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button type="submit"
                  className="btn btn-primary text-white">
                  {editing ? 'Update Hall' : 'Create Hall'}
                </button>
                <button type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Halls Table */}
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border"
              style={{ color: '#8B4A6B' }}></div>
          </div>
        ) : (
          <div className="card">
            <table className="table table-hover mb-0">
              <thead style={{ background: '#f8f0f4' }}>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Base Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {halls.map(h => (
                  <tr key={h.id}>
                    <td className="fw-semibold">{h.name}</td>
                    <td>{h.location}</td>
                    <td>{h.capacity}</td>
                    <td>${h.basePrice?.toLocaleString()}</td>
                    <td>
                      <span className={`badge bg-${h.isAvailable
                        ? 'success' : 'secondary'}`}>
                        {h.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(h)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(h.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}