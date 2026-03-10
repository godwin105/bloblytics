<<<<<<< HEAD
<div align="center">

# 📊 Bloblytics

### Decentralized Storage Meets Data Intelligence

**Upload datasets. Store securely on Shelby. Analyze with interactive dashboards.**

[![Built on Shelby](https://img.shields.io/badge/Built%20on-Shelby-02C39A?style=for-the-badge)](https://shelby.xyz)
[![Powered by Aptos](https://img.shields.io/badge/Powered%20by-Aptos-064663?style=for-the-badge)](https://aptoslabs.com)
[![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 🌐 What is Bloblytics?

**Bloblytics** is an open-source analytics dashboard built on top of [Shelby](https://shelby.xyz) — a decentralized blob storage layer on the Aptos blockchain.

It lets anyone:
- 📁 **Upload** CSV, JSON, or Excel datasets
- 🔒 **Store** them as tamper-proof blobs on Shelby's decentralized network
- 📈 **Analyze** data through rich, interactive visualizations — without ever trusting a centralized server

> _No central servers. No data ownership trade-offs. Just trustless, decentralized analytics._

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔼 **Decentralized Upload** | Store datasets as blobs on Shelby — no single point of failure |
| 📊 **Interactive Dashboards** | Rich charts, filters, and visualizations powered by Recharts & D3.js |
| 🛡️ **Tamper-Proof Storage** | Cryptographic guarantees — your data is immutable and verifiable |
| 👥 **Multi-User Access** | Share datasets and dashboards with teammates via access control |
| ⚡ **Fast Retrieval** | Optimized blob fetching keeps your analytics workflow snappy |
| 📤 **Export & API** | Export insights as CSV/PDF or connect via API |
| 🔐 **Wallet Auth** | Aptos wallet-gated access — trustless, no passwords |

---

## 🏗️ Architecture

```
User
 │
 ├── Uploads dataset (CSV / JSON / Excel)
 │
 ▼
Bloblytics Frontend (React + TypeScript)
 │
 ├── Encodes dataset as blob
 │
 ▼
Shelby SDK  ──►  Shelby Network (Aptos)
                  │
                  └── Blob stored on-chain, tamper-proof
                        │
                        ▼
                  Retrieved for analytics & visualization
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- An [Aptos wallet](https://petra.app) (Petra recommended)
- Access to Shelby Early Access ([apply here](https://shelby.xyz))

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/bloblytics.git
cd bloblytics

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the development server
npm run dev
```

### Environment Variables

```env
VITE_SHELBY_API_KEY=your_shelby_api_key
VITE_APTOS_NETWORK=mainnet       # or testnet
VITE_APTOS_NODE_URL=https://fullnode.mainnet.aptoslabs.com
```

---

## 🗂️ Project Structure

```
bloblytics/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── charts/        # Chart components (Bar, Line, Pie, etc.)
│   │   ├── upload/        # Drag & drop upload UI
│   │   └── layout/        # Navbar, Sidebar, Footer
│   ├── pages/             # Route-level pages
│   │   ├── Landing.tsx    # Marketing landing page
│   │   ├── Dashboard.tsx  # Main analytics dashboard
│   │   ├── Upload.tsx     # Dataset upload page
│   │   └── Settings.tsx   # User & workspace settings
│   ├── hooks/             # Custom React hooks
│   │   ├── useWallet.ts   # Aptos wallet connection
│   │   ├── useBlob.ts     # Shelby blob upload/fetch
│   │   └── useDataset.ts  # Dataset parsing & state
│   ├── lib/               # SDK clients & utilities
│   │   ├── shelby.ts      # Shelby SDK wrapper
│   │   └── aptos.ts       # Aptos client setup
│   ├── types/             # TypeScript interfaces
│   └── assets/            # Logo, icons, images
├── public/
├── .env.example
├── README.md
└── package.json
```

---

## 🛣️ Roadmap

- [x] Project setup & architecture design
- [ ] **Q2 2026** — MVP: Shelby integration, dataset upload, basic dashboards
- [ ] **Q3 2026** — Beta: Multi-user access, advanced charts, Aptos wallet auth
- [ ] **Q4 2026** — Launch: Public release, API access, collaboration tools
- [ ] **Q1 2026** — Scale: AI-powered insights, mobile app, enterprise tier

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + TypeScript + Vite |
| **Styling** | Tailwind CSS |
| **Charts** | Recharts + D3.js |
| **Storage** | Shelby (Decentralized Blob Storage) |
| **Blockchain** | Aptos |
| **Auth** | Aptos Wallet (Petra / Martian) |
| **Deploy** | Vercel |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for our code of conduct and contribution guidelines.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🌍 Community & Links

| | Link |
|---|---|
| 🌐 Website | [ |
| 🐦 Twitter/X | [ |
| 💬 Discord | [ |
| 📦 Shelby | [shelby.xyz](https://shelby.xyz) |
| ⛓️ Aptos | [aptoslabs.com](https://aptoslabs.com) |

---

<div align="center">

Built with ❤️ on **Shelby** and **Aptos**

_Bloblytics — Analyze your data. Own your storage._

</div>
