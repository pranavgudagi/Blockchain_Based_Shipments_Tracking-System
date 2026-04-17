import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TrackingPage from './pages/TrackingPage';
import CreateShipment from './pages/CreateShipment';
import ManageStatus from './pages/ManageStatus';
import VerifyScan from './pages/VerifyScan';
import ChainExplorer from './pages/ChainExplorer';
import './App.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/track" element={<TrackingPage />} />
          <Route path="/create" element={<CreateShipment />} />
          <Route path="/manage" element={<ManageStatus />} />
          <Route path="/verify" element={<VerifyScan />} />
          <Route path="/explorer" element={<ChainExplorer />} />
        </Routes>
      </main>
    </div>
  );
}