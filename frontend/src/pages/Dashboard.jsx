import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Blocks, Package, Truck, ShieldCheck, ArrowRight, 
  Activity, Box, TrendingUp 
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { getBlockchainStats, getAllShipments } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalBlocks: 0, totalShipments: 0, networkStatus: 'Loading...' });
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, sh] = await Promise.all([getBlockchainStats(), getAllShipments()]);
        setStats(s);
        setShipments(sh);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
    const timer = setInterval(load, 8000);
    return () => clearInterval(timer);
  }, []);

  const statusCounts = {
    created: shipments.filter(s => s.statusCode === 0).length,
    inTransit: shipments.filter(s => s.statusCode === 1 || s.statusCode === 2).length,
    delivered: shipments.filter(s => s.statusCode === 4).length,
    flagged: shipments.filter(s => !s.isAuthentic).length,
  };

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="dashboard-hero animate-in">
        <div className="hero-content">
          <div className="hero-badge">
            <Activity size={14} />
            <span>Blockchain Network Active</span>
          </div>
          <h1 className="hero-title">
            Shipment <span className="gradient-text">Intelligence</span> Hub
          </h1>
          <p className="hero-desc">
            Real-time decentralized tracking powered by Ethereum smart contracts. 
            Every shipment is immutably recorded on the blockchain.
          </p>
          <div className="hero-actions">
            <Link to="/track" className="btn btn-primary">
              <Package size={18} />
              Track Shipment
            </Link>
            <Link to="/create" className="btn btn-outline">
              Create New
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-chain">
            {[1, 2, 3].map(i => (
              <div key={i} className={`hero-block block-${i}`}>
                <Blocks size={20} />
                <span>Block</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="stats-grid animate-in animate-in-delay-1">
        <StatCard 
          icon={Blocks} 
          label="Total Blocks" 
          value={loading ? '...' : stats.totalBlocks} 
          sub="On local chain"
          color="#6366f1" 
        />
        <StatCard 
          icon={Package} 
          label="Total Shipments" 
          value={loading ? '...' : stats.totalShipments} 
          sub="Registered on-chain"
          color="#8b5cf6" 
        />
        <StatCard 
          icon={Truck} 
          label="In Transit" 
          value={loading ? '...' : statusCounts.inTransit} 
          sub="Currently moving"
          color="#3b82f6" 
        />
        <StatCard 
          icon={ShieldCheck} 
          label="Verified" 
          value={loading ? '...' : (stats.totalShipments - statusCounts.flagged)} 
          sub="Authenticity confirmed"
          color="#10b981" 
        />
      </section>

      {/* Recent Shipments */}
      <section className="card animate-in animate-in-delay-2">
        <div className="card-header">
          <h2 className="card-title">
            <Box size={20} />
            Recent Shipments
          </h2>
          <Link to="/track" className="btn btn-sm btn-ghost">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="empty-state">
              <div className="spinner" />
              <p>Syncing with blockchain...</p>
            </div>
          ) : shipments.length === 0 ? (
            <div className="empty-state">
              <Package size={48} strokeWidth={1} />
              <h3>No Shipments Yet</h3>
              <p>Create your first shipment to see it here.</p>
              <Link to="/create" className="btn btn-primary btn-sm">
                Create Shipment
              </Link>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Item</th>
                  <th>Status</th>
                  <th>Authentic</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {shipments.slice(0, 8).map((s, i) => (
                  <tr key={i} className="table-row-animate" style={{ animationDelay: `${i * 0.05}s` }}>
                    <td>
                      <Link to={`/track?id=${s.trackingId}`} className="tracking-link">
                        {s.trackingId}
                      </Link>
                    </td>
                    <td>{s.itemName}</td>
                    <td>
                      <span className={`status-badge status-${s.statusCode}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      {s.isAuthentic ? (
                        <span className="auth-badge verified">✓ Verified</span>
                      ) : (
                        <span className="auth-badge flagged">✗ Flagged</span>
                      )}
                    </td>
                    <td className="text-muted">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions animate-in animate-in-delay-3">
        <Link to="/create" className="action-card">
          <div className="action-icon" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <Package size={24} color="#6366f1" />
          </div>
          <h3>Register Shipment</h3>
          <p>Create a new immutable record on the blockchain</p>
          <ArrowRight size={16} className="action-arrow" />
        </Link>
        <Link to="/verify" className="action-card">
          <div className="action-icon" style={{ background: 'rgba(16,185,129,0.12)' }}>
            <ShieldCheck size={24} color="#10b981" />
          </div>
          <h3>Verify Authenticity</h3>
          <p>Scan QR/RFID to verify shipment on-chain</p>
          <ArrowRight size={16} className="action-arrow" />
        </Link>
        <Link to="/explorer" className="action-card">
          <div className="action-icon" style={{ background: 'rgba(139,92,246,0.12)' }}>
            <Blocks size={24} color="#8b5cf6" />
          </div>
          <h3>Explore Chain</h3>
          <p>View the live blockchain ledger and blocks</p>
          <ArrowRight size={16} className="action-arrow" />
        </Link>
      </section>
    </div>
  );
}
