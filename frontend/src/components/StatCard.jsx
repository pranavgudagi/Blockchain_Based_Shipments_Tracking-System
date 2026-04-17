import React from 'react';

export default function StatCard({ icon: Icon, label, value, sub, color = 'var(--accent-primary)' }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: `${color}18`, color }}>
        <Icon size={22} />
      </div>
      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
        {sub && <span className="stat-card-sub">{sub}</span>}
      </div>
    </div>
  );
}
