import React, { useState, useEffect } from 'react';
import { Blocks, Hash, Link2, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import { getBlockchainLedger, getBlockchainStats } from '../services/api';

export default function ChainExplorer() {
  const [blocks, setBlocks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [b, s] = await Promise.all([getBlockchainLedger(), getBlockchainStats()]);
      setBlocks(b);
      setStats(s);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, []);

  const shortenHash = (hash) => {
    if (!hash) return '—';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <div className="page">
      {/* Header */}
      <section className="card animate-in">
        <div className="card-header">
          <h1 className="page-title">
            <Blocks size={28} />
            Blockchain Explorer
          </h1>
          <button className="btn btn-ghost btn-sm" onClick={fetchData}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>
        <p className="page-desc">
          Live view of the blockchain ledger. Every block contains an immutable record 
          of shipment transactions — creating a tamper-proof audit trail.
        </p>
      </section>

      {/* Network Info */}
      {stats && (
        <div className="explorer-stats animate-in animate-in-delay-1">
          <div className="explorer-stat">
            <span className="explorer-stat-label">Network</span>
            <span className="explorer-stat-value">
              <span className="network-dot" />
              {stats.networkStatus}
            </span>
          </div>
          <div className="explorer-stat">
            <span className="explorer-stat-label">Chain ID</span>
            <span className="explorer-stat-value">{stats.chainId}</span>
          </div>
          <div className="explorer-stat">
            <span className="explorer-stat-label">Total Blocks</span>
            <span className="explorer-stat-value">{stats.totalBlocks}</span>
          </div>
          <div className="explorer-stat">
            <span className="explorer-stat-label">Shipments</span>
            <span className="explorer-stat-value">{stats.totalShipments}</span>
          </div>
        </div>
      )}

      {/* Visual Chain */}
      <section className="animate-in animate-in-delay-2">
        <h2 className="section-title">Live Chain Visualization</h2>
        
        {loading ? (
          <div className="card">
            <div className="empty-state">
              <div className="spinner" />
              <p>Loading blockchain data...</p>
            </div>
          </div>
        ) : blocks.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <Blocks size={48} strokeWidth={1} />
              <h3>No Blocks</h3>
              <p>The blockchain is empty. Create a shipment to generate blocks.</p>
            </div>
          </div>
        ) : (
          <div className="chain-visual">
            {blocks.map((block, i) => (
              <React.Fragment key={block.number}>
                <div className="block-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="block-card-header">
                    <div className="block-number">
                      <Blocks size={16} />
                      Block #{block.number}
                    </div>
                    {block.txCount > 0 && (
                      <span className="block-tx-count">{block.txCount} tx</span>
                    )}
                  </div>
                  
                  <div className="block-card-body">
                    <div className="block-field">
                      <span className="block-field-label">
                        <Hash size={12} /> Hash
                      </span>
                      <span className="block-field-value mono">
                        {shortenHash(block.hash)}
                      </span>
                    </div>
                    <div className="block-field">
                      <span className="block-field-label">
                        <Link2 size={12} /> Parent
                      </span>
                      <span className="block-field-value mono">
                        {shortenHash(block.parent)}
                      </span>
                    </div>
                    <div className="block-field">
                      <span className="block-field-label">
                        <Clock size={12} /> Time
                      </span>
                      <span className="block-field-value">
                        {block.time ? new Date(block.time).toLocaleTimeString() : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {i < blocks.length - 1 && (
                  <div className="chain-link">
                    <ArrowRight size={20} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
