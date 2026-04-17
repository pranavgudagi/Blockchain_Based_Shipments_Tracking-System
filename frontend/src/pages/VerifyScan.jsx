import React, { useState } from 'react';
import { ShieldCheck, ScanLine, CheckCircle2, AlertCircle, AlertTriangle, Send } from 'lucide-react';
import { verifyShipment, flagShipment, getShipment } from '../services/api';

export default function VerifyScan() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [shipmentInfo, setShipmentInfo] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [flagging, setFlagging] = useState(false);

  const handleScan = async () => {
    if (!trackingId.trim()) return;
    setLoading(true);
    setResult(null);
    setShipmentInfo(null);

    try {
      // First get shipment info
      const info = await getShipment(trackingId.trim());
      if (!info.trackingId) {
        setResult({ type: 'error', message: 'Shipment not found on blockchain.' });
        setLoading(false);
        return;
      }
      setShipmentInfo(info);

      // Then trigger verification
      const data = await verifyShipment(trackingId.trim());
      if (data.success) {
        setResult({ 
          type: 'success', 
          message: 'Shipment verified successfully on the blockchain!',
          block: data.block
        });
      } else {
        setResult({ type: 'warning', message: data.error || 'Verification issue detected.' });
      }
    } catch (err) {
      setResult({ type: 'error', message: 'Connection to blockchain failed.' });
    }
    setLoading(false);
  };

  const handleFlag = async () => {
    if (!trackingId.trim()) return;
    setFlagging(true);

    try {
      const data = await flagShipment(trackingId.trim(), flagReason);
      if (data.success) {
        setResult({ 
          type: 'warning', 
          message: 'Shipment has been flagged on the blockchain.',
          block: data.block
        });
        setShipmentInfo(prev => prev ? { ...prev, isAuthentic: false } : null);
      } else {
        setResult({ type: 'error', message: data.error || 'Flag operation failed.' });
      }
    } catch (err) {
      setResult({ type: 'error', message: 'Connection failed.' });
    }
    setFlagging(false);
  };

  return (
    <div className="page">
      <section className="card animate-in" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="card-header">
          <h1 className="page-title">
            <ShieldCheck size={28} />
            Verify & Scan
          </h1>
        </div>
        <p className="page-desc" style={{ marginBottom: 32 }}>
          Simulate a QR code or RFID scan to verify shipment authenticity 
          via the blockchain smart contract.
        </p>

        {/* Scan Input */}
        <div className="scan-area">
          <div className="scan-visual">
            <ScanLine size={64} strokeWidth={1} />
            <span>Scan QR / RFID</span>
          </div>
          
          <div className="form-group" style={{ width: '100%' }}>
            <label htmlFor="scan-id" className="form-label">Tracking ID (from QR/RFID)</label>
            <div className="search-bar">
              <input
                id="scan-id"
                className="form-input"
                placeholder="Enter or scan tracking ID"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScan()}
                style={{ flex: 1 }}
              />
              <button
                id="verify-btn"
                className="btn btn-primary"
                onClick={handleScan}
                disabled={loading}
              >
                {loading ? <span className="spinner-sm" /> : <ShieldCheck size={18} />}
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`result-banner ${result.type} animate-in`}>
            {result.type === 'success' && <CheckCircle2 size={22} />}
            {result.type === 'warning' && <AlertTriangle size={22} />}
            {result.type === 'error' && <AlertCircle size={22} />}
            <div>
              <strong>{result.message}</strong>
              {result.block && (
                <span className="result-meta">Recorded in Block #{result.block}</span>
              )}
            </div>
          </div>
        )}

        {/* Shipment Quick Info */}
        {shipmentInfo && (
          <div className="verify-info animate-in animate-in-delay-1">
            <h3 className="card-subtitle" style={{ marginBottom: 16 }}>Scanned Item</h3>
            <div className="detail-rows">
              <div className="detail-row">
                <span className="detail-label">Item</span>
                <span className="detail-value">{shipmentInfo.itemName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`status-badge status-${shipmentInfo.statusCode}`}>
                  {shipmentInfo.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Authenticity</span>
                <span className="detail-value">
                  {shipmentInfo.isAuthentic ? (
                    <span className="auth-badge verified">✓ Verified</span>
                  ) : (
                    <span className="auth-badge flagged">✗ Flagged</span>
                  )}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Weight</span>
                <span className="detail-value">{shipmentInfo.weight}g</span>
              </div>
            </div>

            {/* Flag Section */}
            {shipmentInfo.isAuthentic && (
              <div className="flag-section">
                <h4 className="form-label" style={{ color: 'var(--warning)' }}>
                  <AlertTriangle size={16} /> Report Suspicious Activity
                </h4>
                <div className="search-bar" style={{ marginTop: 8 }}>
                  <input
                    id="flag-reason"
                    className="form-input"
                    placeholder="Reason for flagging"
                    value={flagReason}
                    onChange={e => setFlagReason(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    id="flag-btn"
                    className="btn btn-danger"
                    onClick={handleFlag}
                    disabled={flagging}
                  >
                    {flagging ? <span className="spinner-sm" /> : <AlertTriangle size={16} />}
                    Flag
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
