import express from 'express';
import { ethers } from 'ethers';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractData = JSON.parse(fs.readFileSync('./config/ShipmentTracker.json', 'utf8'));
const shipmentContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractData.abi, wallet);

const STATUS_MAP = ["Created", "Picked Up", "In Transit", "Out for Delivery", "Delivered"];

// ─── CREATE SHIPMENT ─────────────────────────────────────────
app.post('/api/shipments/create', async (req, res) => {
    try {
        const { id, name, description, weight, dimensions, materials, carrier, customer } = req.body;
        console.log(`[WRITE] Creating Shipment: ${id}`);
        
        const tx = await shipmentContract.createShipment(
            id,
            name,
            description || "",
            parseInt(weight) || 0,
            dimensions || "",
            materials || "",
            carrier,
            customer
        );
        const receipt = await tx.wait();
        
        res.status(201).json({ 
            success: true, 
            block: receipt.blockNumber,
            txHash: receipt.hash
        });
    } catch (error) {
        console.error("Blockchain Write Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── UPDATE STATUS ───────────────────────────────────────────
app.post('/api/shipments/update', async (req, res) => {
    try {
        const { trackingId, newStatus } = req.body;
        console.log(`[UPDATE] Status for ${trackingId} -> ${STATUS_MAP[newStatus]}`);
        
        const tx = await shipmentContract.updateShipmentStatus(trackingId, parseInt(newStatus));
        const receipt = await tx.wait();
        
        res.json({ 
            success: true, 
            block: receipt.blockNumber,
            txHash: receipt.hash
        });
    } catch (error) {
        console.error("Status Update Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── VERIFY SHIPMENT (QR/RFID SCAN) ─────────────────────────
app.post('/api/shipments/verify', async (req, res) => {
    try {
        const { trackingId } = req.body;
        console.log(`[VERIFY] Scanning shipment: ${trackingId}`);
        
        const tx = await shipmentContract.verifyShipment(trackingId);
        const receipt = await tx.wait();
        
        res.json({ 
            success: true, 
            verified: true,
            block: receipt.blockNumber,
            txHash: receipt.hash
        });
    } catch (error) {
        console.error("Verification Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── FLAG SHIPMENT ───────────────────────────────────────────
app.post('/api/shipments/flag', async (req, res) => {
    try {
        const { trackingId, reason } = req.body;
        console.log(`[FLAG] Flagging shipment: ${trackingId} - ${reason}`);
        
        const tx = await shipmentContract.flagShipment(trackingId, reason || "Suspicious activity");
        const receipt = await tx.wait();
        
        res.json({ success: true, block: receipt.blockNumber });
    } catch (error) {
        console.error("Flag Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── GET SINGLE SHIPMENT ─────────────────────────────────────
app.get('/api/shipments/:id', async (req, res) => {
    try {
        const s = await shipmentContract.getShipment(req.params.id);
        res.json({
            trackingId: s.trackingId,
            itemName: s.itemName,
            itemDescription: s.itemDescription,
            weight: s.packaging.weight.toString(),
            dimensions: s.packaging.dimensions,
            materials: s.packaging.materials,
            packagingCompany: s.packagingCompany,
            carrier: s.carrier,
            customer: s.customer,
            status: STATUS_MAP[Number(s.status)],
            statusCode: Number(s.status),
            isAuthentic: s.isAuthentic,
            createdAt: Number(s.createdAt) * 1000,
            lastUpdatedAt: Number(s.lastUpdatedAt) * 1000
        });
    } catch (error) {
        res.status(404).json({ success: false, message: "Shipment not found on blockchain" });
    }
});

// ─── GET ALL SHIPMENTS ───────────────────────────────────────
app.get('/api/shipments', async (req, res) => {
    try {
        const total = await shipmentContract.getTotalShipments();
        const shipments = [];
        const count = Number(total);
        
        for (let i = 0; i < count; i++) {
            const trackingId = await shipmentContract.getTrackingIdByIndex(i);
            const s = await shipmentContract.getShipment(trackingId);
            shipments.push({
                trackingId: s.trackingId,
                itemName: s.itemName,
                status: STATUS_MAP[Number(s.status)],
                statusCode: Number(s.status),
                isAuthentic: s.isAuthentic,
                createdAt: Number(s.createdAt) * 1000
            });
        }
        
        res.json(shipments);
    } catch (error) {
        console.error("Fetch All Error:", error.message);
        res.json([]);
    }
});

// ─── BLOCKCHAIN LEDGER INFO ──────────────────────────────────
app.get('/api/blockchain/ledger', async (req, res) => {
    try {
        const latestBlock = await provider.getBlockNumber();
        const blocks = [];
        const count = Math.min(6, latestBlock + 1);
        
        for (let i = 0; i < count; i++) {
            const block = await provider.getBlock(latestBlock - i);
            blocks.push({
                number: block.number,
                hash: block.hash,
                parent: block.parentHash,
                time: new Date(block.timestamp * 1000).toISOString(),
                txCount: block.transactions.length
            });
        }
        res.json(blocks);
    } catch (err) { 
        console.error("Ledger Error:", err.message);
        res.json([]); 
    }
});

// ─── BLOCKCHAIN STATS ────────────────────────────────────────
app.get('/api/blockchain/stats', async (req, res) => {
    try {
        const latestBlock = await provider.getBlockNumber();
        const totalShipments = await shipmentContract.getTotalShipments();
        
        res.json({
            totalBlocks: latestBlock,
            totalShipments: Number(totalShipments),
            networkStatus: "Active",
            chainId: (await provider.getNetwork()).chainId.toString()
        });
    } catch (err) {
        res.json({ totalBlocks: 0, totalShipments: 0, networkStatus: "Offline", chainId: "N/A" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 ChainTrack API running on port ${PORT}`));