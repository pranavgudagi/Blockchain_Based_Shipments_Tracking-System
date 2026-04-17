const API_URL = 'http://localhost:3000/api';

// ─── Shipment Operations ─────────────────────────────────────

export const createShipment = async (shipmentData) => {
    const response = await fetch(`${API_URL}/shipments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shipmentData),
    });
    return response.json();
};

export const getShipment = async (trackingId) => {
    const response = await fetch(`${API_URL}/shipments/${trackingId}`);
    return response.json();
};

export const getAllShipments = async () => {
    const response = await fetch(`${API_URL}/shipments`);
    return response.json();
};

export const updateShipmentStatus = async (trackingId, newStatus) => {
    const response = await fetch(`${API_URL}/shipments/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId, newStatus }),
    });
    return response.json();
};

// ─── Verification (QR / RFID Scan) ──────────────────────────

export const verifyShipment = async (trackingId) => {
    const response = await fetch(`${API_URL}/shipments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId }),
    });
    return response.json();
};

export const flagShipment = async (trackingId, reason) => {
    const response = await fetch(`${API_URL}/shipments/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId, reason }),
    });
    return response.json();
};

// ─── Blockchain Data ─────────────────────────────────────────

export const getBlockchainLedger = async () => {
    const response = await fetch(`${API_URL}/blockchain/ledger`);
    return response.json();
};

export const getBlockchainStats = async () => {
    const response = await fetch(`${API_URL}/blockchain/stats`);
    return response.json();
};