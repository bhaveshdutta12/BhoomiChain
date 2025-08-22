# BhoomiChain - Blockchain-based Land Registry

## 🏡 About
BhoomiChain is a transparent, tamper-proof blockchain registry for managing land ownership records. It uses smart contracts and immutable ledgers for registration and transfers, with map-based property visualization for public use.

## 🎯 Key Features

- **Smart Contracts**: Solidity-based contracts for land asset registration and ownership transfers
- **Blockchain Entries**: Immutable records with every change verified publicly
- **Document Storage**: Secure IPFS storage for deeds/scans with blockchain hash references
- **Citizen Search Portal**: Public interface for ownership verification
- **GIS/Map Visualization**: Interactive maps connecting land plots to legal owners
- **Historical Records**: Complete audit trail of ownership changes

## 🛠️ Technology Stack

- **Blockchain**: Ethereum/Hyperledger Fabric
- **Smart Contracts**: Solidity
- **Storage**: IPFS (InterPlanetary File System)
- **Backend**: Node.js, Express
- **Frontend**: React.js
- **Maps**: Mapbox API
- **Testing**: Hardhat

## 📁 Project Structure

```
BhoomiChain/
├── contracts/          # Solidity smart contracts
├── frontend/          # React.js frontend application
├── backend/           # Node.js backend API
├── scripts/           # Deployment and utility scripts
├── docs/              # Project documentation
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask wallet
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/BhoomiChain.git
cd BhoomiChain
```

2. Install dependencies for all components
```bash
# Install smart contract dependencies
cd contracts && npm install

# Install backend dependencies
cd ../backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Deploy smart contracts (local development)
```bash
cd contracts
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

5. Start the backend server
```bash
cd backend
npm run dev
```

6. Start the frontend application
```bash
cd frontend
npm start
```

## 📊 Demo Flow

1. **Register New Land Title** → Owner submits property documents
2. **Smart Contract Processing** → Blockchain validates and stores ownership
3. **IPFS Document Storage** → Documents stored securely with hash references
4. **Transfer Ownership** → New owner initiates transfer via smart contract
5. **Public Verification** → Citizens can verify ownership through portal
6. **Map Visualization** → Interactive map shows current and historical ownership

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for blockchain hackathon
- Inspired by the need for transparent land registry systems
- Thanks to the open-source blockchain community

---

**Note**: This is a hackathon project for demonstration purposes. For production use, additional security audits and legal compliance would be required.
