import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Weight, Ruler, Layers, Shield, Clock, User, Truck as TruckIcon, Building2 } from 'lucide-react';
import StatusTimeline from '../components/StatusTimeline';
import { getShipment } from '../services/api';

const STATUS_MAP = {
  "Created": 0,
  "Picked Up": 1,
  "In Transit": 2,
  "Out for Delivery": 3,
  "Delivered": 4
};

export default function TrackShipment() {
  const [searchParams] = useSearchParams();
  const [trackId, setTrackId] = useState(searchParams.get('id') || '');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setTrackId(idFromUrl);
      handleTrack(idFromUrl);
    }
  }, [searchParams]);

  const handleTrack = async (id) => {
    const searchId = id || trackId;
    if (!searchId.trim()) return;
    
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const data = await getShipment(searchId.trim());
      if (data.trackingId) {
        setShipment(data);
      } else {
        setShipment(null);
        setError('Shipment not found on the blockchain. Please check the tracking ID.');
      }
    } catch (e) {
      setShipment(null);
      setError('Unable to connect to the blockchain network. Please try again.');
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleTrack();
  };

  const shortenAddress = (addr) => {
    if (!addr) return '—';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="page">
      {/* Search Section */}
      <section className="card animate-in">
        <div className="track-search-header">
          <h1 className="page-title">
            <Search size={28} />
            Track Your Shipment
          </h1>
          <p className="page-desc">
            Enter your tracking ID to view real-time blockchain-verified status
          </p>
        </div>

        <div className="search-bar">
          <div className="search-input-wrap">
            <Search size={20} className="search-icon" />
            <input
              id="tracking-search-input"
              type="text"
              className="search-input"
              placeholder="Enter Tracking ID (e.g., SHIP-001)"
              value={trackId}
              onChange={e => setTrackId(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <button 
            id="track-btn"
            className="btn btn-primary btn-lg" 
            onClick={() => handleTrack()}
            disabled={loading}
          >
            {loading ? <span className="spinner-sm" /> : <Search size={18} />}
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="card animate-in">
          <div className="empty-state">
            <div className="spinner" />
            <p>Querying blockchain ledger...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="card animate-in error-card">
          <div className="empty-state">
            <Package size={48} strokeWidth={1} />
            <h3>Not Found</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {shipment && !loading && (
        <>
          {/* Status Timeline - Amazon style */}
          <section className="card animate-in animate-in-delay-1">
            <div className="card-header">
              <h2 className="card-title">
                <TruckIcon size={20} />
                Delivery Progress
              </h2>
              <span className={`status-badge status-${shipment.statusCode}`}>
                {shipment.status}
              </span>
            </div>
            <StatusTimeline statusCode={shipment.statusCode} />
          </section>

          {/* Shipment Details */}
          <div className="detail-grid animate-in animate-in-delay-2">
            {/* Item Info */}
            <div className="card">
              <h3 className="card-subtitle">
                <Package size={18} />
                Item Details
              </h3>
              <div className="detail-rows">
                <div className="detail-row">
                  <span className="detail-label">Tracking ID</span>
                  <span className="detail-value mono">{shipment.trackingId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Item Name</span>
                  <span className="detail-value">{shipment.itemName}</span>
                </div>
                {shipment.itemDescription && (
                  <div className="detail-row">
                    <span className="detail-label">Description</span>
                    <span className="detail-value">{shipment.itemDescription}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Packaging Specs (Immutable) */}
            <div className="card">
              <h3 className="card-subtitle">
                <Layers size={18} />
                Packaging Specifications
                <span className="immutable-badge">Immutable</span>
              </h3>
              <div className="detail-rows">
                <div className="detail-row">
                  <span className="detail-label">
                    <Weight size={14} /> Weight
                  </span>
                  <span className="detail-value">{shipment.weight}g</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    <Ruler size={14} /> Dimensions
                  </span>
                  <span className="detail-value">{shipment.dimensions || '—'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    <Layers size={14} /> Materials
                  </span>
                  <span className="detail-value">{shipment.materials || '—'}</span>
                </div>
              </div>
            </div>

            {/* Stakeholders */}
            <div className="card">
              <h3 className="card-subtitle">
                <User size={18} />
                Stakeholders
              </h3>
              <div className="detail-rows">
                <div className="detail-row">
                  <span className="detail-label">
                    <Building2 size={14} /> Company
                  </span>
                  <span className="detail-value mono">{shortenAddress(shipment.packagingCompany)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    <TruckIcon size={14} /> Carrier
                  </span>
                  <span className="detail-value mono">{shortenAddress(shipment.carrier)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    <User size={14} /> Customer
                  </span>
                  <span className="detail-value mono">{shortenAddress(shipment.customer)}</span>
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="card">
              <h3 className="card-subtitle">
                <Shield size={18} />
                Blockchain Verification
              </h3>
              <div className="detail-rows">
                <div className="detail-row">
                  <span className="detail-label">Authenticity</span>
                  <span className="detail-value">
                    {shipment.isAuthentic ? (
                      <span className="auth-badge verified">✓ Blockchain Verified</span>
                    ) : (
                      <span className="auth-badge flagged">✗ Flagged — Possible Tampering</span>
                    )}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    <Clock size={14} /> Created
                  </span>
                  <span className="detail-value">
                    {shipment.createdAt ? new Date(shipment.createdAt).toLocaleString() : '—'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    <Clock size={14} /> Last Updated
                  </span>
                  <span className="detail-value">
                    {shipment.lastUpdatedAt ? new Date(shipment.lastUpdatedAt).toLocaleString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Initial State */}
      {!searched && !loading && (
        <div className="card animate-in animate-in-delay-1">
          <div className="empty-state">
            <Search size={48} strokeWidth={1} />
            <h3>Enter a Tracking ID</h3>
            <p>Search for any shipment registered on the blockchain to view its full history and verification status.</p>
          </div>
        </div>
      )}
    </div>
  );
}