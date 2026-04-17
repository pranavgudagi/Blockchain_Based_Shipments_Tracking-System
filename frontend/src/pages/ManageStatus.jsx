import React, { useState } from 'react';
import { Truck, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { updateShipmentStatus } from '../services/api';

const STATUS_OPTIONS = [
  { value: 1, label: 'Picked Up', desc: 'Package collected by carrier' },
  { value: 2, label: 'In Transit', desc: 'On the way to destination' },
  { value: 3, label: 'Out for Delivery', desc: 'Near delivery location' },
  { value: 4, label: 'Delivered', desc: 'Successfully delivered to customer' },
];

export default function ManageStatus() {
  const [trackingId, setTrackingId] = useState('');
  const [newStatus, setNewStatus] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setResult({ success: false, error: 'Please enter a tracking ID.' });
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const data = await updateShipmentStatus(trackingId.trim(), newStatus);
      if (data.success) {
        setResult({
          success: true,
          message: `Status updated to "${STATUS_OPTIONS.find(s => s.value === parseInt(newStatus))?.label}"`,
          block: data.block
        });
      } else {
        setResult({ success: false, error: data.error || 'Update failed.' });
      }
    } catch (err) {
      setResult({ success: false, error: 'Could not connect to backend.' });
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <section className="card animate-in" style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="card-header">
          <h1 className="page-title">
            <Truck size={28} />
            Update Shipment Status
          </h1>
        </div>
        <p className="page-desc" style={{ marginBottom: 32 }}>
          Broadcast a status change to the blockchain. This creates an immutable 
          record of the shipment's journey.
        </p>

        <form onSubmit={handleUpdate} className="form">
          <div className="form-group">
            <label htmlFor="update-tracking-id" className="form-label">Tracking ID</label>
            <input
              id="update-tracking-id"
              className="form-input"
              placeholder="Enter the shipment tracking ID"
              value={trackingId}
              onChange={e => setTrackingId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Status</label>
            <div className="status-options">
              {STATUS_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className={`status-option ${parseInt(newStatus) === opt.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={parseInt(newStatus) === opt.value}
                    onChange={e => setNewStatus(e.target.value)}
                  />
                  <div className="status-option-content">
                    <span className="status-option-label">{opt.label}</span>
                    <span className="status-option-desc">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            id="update-status-btn"
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-sm" /> Broadcasting...</>
            ) : (
              <><Send size={18} /> Broadcast Status Update</>
            )}
          </button>
        </form>

        {result && (
          <div className={`result-banner ${result.success ? 'success' : 'error'} animate-in`}>
            {result.success ? (
              <>
                <CheckCircle2 size={22} />
                <div>
                  <strong>{result.message}</strong>
                  {result.block && (
                    <span className="result-meta">Confirmed in Block #{result.block}</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <AlertCircle size={22} />
                <div>
                  <strong>Update Failed</strong>
                  <span className="result-meta">{result.error}</span>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
