import React, { useState } from 'react';
import { PackagePlus, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { createShipment } from '../services/api';

export default function CreateShipment() {
  const [form, setForm] = useState({
    id: '',
    name: '',
    description: '',
    weight: '',
    dimensions: '',
    materials: '',
    carrier: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    customer: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id.trim() || !form.name.trim()) {
      setResult({ success: false, error: 'Tracking ID and Item Name are required.' });
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const data = await createShipment(form);
      if (data.success) {
        setResult({ 
          success: true, 
          message: `Shipment registered on blockchain!`,
          block: data.block,
          txHash: data.txHash
        });
        setForm({ ...form, id: '', name: '', description: '', weight: '', dimensions: '', materials: '' });
      } else {
        setResult({ success: false, error: data.error || 'Transaction failed.' });
      }
    } catch (err) {
      setResult({ success: false, error: 'Could not connect to backend server.' });
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <section className="card animate-in" style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="card-header">
          <h1 className="page-title">
            <PackagePlus size={28} />
            Register New Shipment
          </h1>
        </div>
        <p className="page-desc" style={{ marginBottom: 32 }}>
          Create an immutable record on the Ethereum blockchain. Once submitted, 
          the packaging specifications cannot be altered.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-section">
            <h3 className="form-section-title">Item Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="shipment-id" className="form-label">Tracking ID *</label>
                <input
                  id="shipment-id"
                  className="form-input"
                  placeholder="e.g., SHIP-001"
                  value={form.id}
                  onChange={handleChange('id')}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="item-name" className="form-label">Item Name *</label>
                <input
                  id="item-name"
                  className="form-input"
                  placeholder="e.g., Premium Packaging Box"
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="item-desc" className="form-label">Description</label>
              <input
                id="item-desc"
                className="form-input"
                placeholder="Brief description of the item"
                value={form.description}
                onChange={handleChange('description')}
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">
              Packaging Specifications
              <span className="immutable-badge">Immutable on-chain</span>
            </h3>
            <div className="form-grid form-grid-3">
              <div className="form-group">
                <label htmlFor="weight" className="form-label">Weight (grams)</label>
                <input
                  id="weight"
                  type="number"
                  className="form-input"
                  placeholder="e.g., 500"
                  value={form.weight}
                  onChange={handleChange('weight')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dimensions" className="form-label">Dimensions (L×W×H)</label>
                <input
                  id="dimensions"
                  className="form-input"
                  placeholder="e.g., 30x20x15 cm"
                  value={form.dimensions}
                  onChange={handleChange('dimensions')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="materials" className="form-label">Materials Used</label>
                <input
                  id="materials"
                  className="form-input"
                  placeholder="e.g., Corrugated cardboard"
                  value={form.materials}
                  onChange={handleChange('materials')}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Stakeholder Addresses</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="carrier-addr" className="form-label">Carrier Address</label>
                <input
                  id="carrier-addr"
                  className="form-input mono"
                  value={form.carrier}
                  onChange={handleChange('carrier')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="customer-addr" className="form-label">Customer Address</label>
                <input
                  id="customer-addr"
                  className="form-input mono"
                  value={form.customer}
                  onChange={handleChange('customer')}
                />
              </div>
            </div>
          </div>

          <button
            id="submit-shipment-btn"
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-sm" /> Mining Transaction...</>
            ) : (
              <><Send size={18} /> Register on Blockchain</>
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className={`result-banner ${result.success ? 'success' : 'error'} animate-in`}>
            {result.success ? (
              <>
                <CheckCircle2 size={22} />
                <div>
                  <strong>{result.message}</strong>
                  <span className="result-meta">
                    Mined in Block #{result.block}
                    {result.txHash && ` • TX: ${result.txHash.slice(0, 14)}...`}
                  </span>
                </div>
              </>
            ) : (
              <>
                <AlertCircle size={22} />
                <div>
                  <strong>Transaction Failed</strong>
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
