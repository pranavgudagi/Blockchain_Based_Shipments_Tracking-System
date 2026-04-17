import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Search, PackagePlus, Truck,
  Blocks, ShieldCheck, Menu, X, Box
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/track', label: 'Track Shipment', icon: Search },
  { path: '/create', label: 'Create Shipment', icon: PackagePlus },
  { path: '/manage', label: 'Manage Status', icon: Truck },
  { path: '/verify', label: 'Verify & Scan', icon: ShieldCheck },
  { path: '/explorer', label: 'Chain Explorer', icon: Blocks },
];

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const currentPage = navItems.find(n => n.path === location.pathname);

  return (
    <>
      {/* ── Top Bar ────────────────────────────── */}
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="brand">
            <div className="brand-icon">
              <Box size={22} />
            </div>
            <span className="brand-name">ChainTrack</span>
          </div>
        </div>
        <div className="topbar-center">
          {currentPage && (
            <span className="current-page">{currentPage.label}</span>
          )}
        </div>
        <div className="topbar-right">
          <div className="network-badge">
            <span className="network-dot"></span>
            Hardhat Local
          </div>
        </div>
      </header>

      {/* ── Sidebar ────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => {
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
            >
              <item.icon size={20} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-text">
            Blockchain-Secured
          </div>
          <div className="sidebar-footer-sub">
            Immutable • Decentralized
          </div>
        </div>
      </aside>

      {/* ── Overlay for mobile ─────────────────── */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
