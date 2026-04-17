# ChainTrack Project Run Guide

## Start the Full Application

Open **three separate terminals** and run the following commands.

---

## Terminal 1: Run the Blockchain Network

This starts your local Ethereum blockchain where the smart contracts live.

```powershell
cd blockchain
npx hardhat node
```

When successful, Hardhat will start a local blockchain network and display available accounts.

---

## Terminal 2: Run the Backend Bridge API

This starts the backend server that connects the React frontend to the smart contract.

```powershell
cd backend
node server.js
```

Expected output:

```text
🚀 ChainTrack API running on port 3000
```

---

## Terminal 3: Run the Frontend Application

This starts the modern UI dashboard.

```powershell
cd frontend
npm run dev
```

After startup, open the local URL shown in the terminal (commonly `http://localhost:5173`).

---

## Recommended Startup Order

1. Blockchain Network
2. Backend API
3. Frontend UI

---

## Troubleshooting

### Port Already in Use

Close the existing process using the port or change the port configuration.

### Dependencies Missing

Run:

```powershell
npm install
```

inside the relevant folder.

### Smart Contract Connection Issues

Make sure the Hardhat node is running before starting backend/frontend.

---

## Project Structure

```text
project-root/
├── blockchain/
├── backend/
└── frontend/
```
