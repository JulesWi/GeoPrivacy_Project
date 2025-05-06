# 🌍 GeoPrivacy: Zero-Knowledge Geolocation Proof System

## 🚀 Overview

GeoPrivacy is an innovative web application that generates zero-knowledge proofs for location verification, ensuring maximum privacy and security. The application has been updated with improved TypeScript configuration and testing capabilities.

## ✨ Features

- 🔒 Zero-Knowledge Location Proofs
- 🗺️ Interactive Map Integration
- 🛡️ Privacy-First Design
- 📍 Precise Location Verification

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with primary (light green) and secondary (light blue) colors
- **Mapping**: React Leaflet
- **Zero-Knowledge Proofs**: Noir Circuit and Aztec Network
- **Testing**: Jest and React Testing Library

## 🌐 Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start frontend
npm run start:frontend

# Start backend
npm run start:backend

# Run tests
npm test
```

## 💰 Payment Model

GeoPrivacy introduces an innovative payment mechanism for Zero-Knowledge Proofs:

- **Network**: OP Sepolia
- **Proof Generation Cost**: 0.5 USDC
- **Smart Contract**: `GeoPrivacyPayment.sol`

### How It Works

1. Purchase a proof token via our smart contract
2. Token is valid for a single ZK proof generation
3. Secure and traceable blockchain-based payment

### Requirements

- Web3 Wallet compatible with OP Sepolia
- USDC on OP Sepolia
- Web3 Connection

### Prerequisites

- Node.js (v18+)
- npm or yarn
- React 18.x (for compatibility with react-leaflet)
- TypeScript 5.x

### Security and Testing

#### Smart Contract Security
- Comprehensive unit testing
- Static code analysis
- Gas optimization
- Regular security audits

#### Continuous Integration
- Automated tests on every push and pull request
- Code coverage reporting
- Security vulnerability scanning
- Vercel deployment with GitHub Actions
  - Configured with VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID secrets

#### Test Commands
```bash
# Run all contract tests
npm run test:contracts

# Generate test coverage report
npm run test:contracts:coverage

# Analyze gas usage
npm run test:contracts:gas
```

#### Security Best Practices
- All sensitive data managed via environment variables
- Private keys and API keys never committed to repository
- Regular dependency updates
- Implemented access control mechanisms

### Smart Contract Deployment

#### OP Sepolia Deployment

1. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add:
# OP_SEPOLIA_RPC_URL=https://sepolia.optimism.io
# PRIVATE_KEY=your_private_key
# OPTIMISM_ETHERSCAN_API_KEY=your_api_key
```

2. Deploy the contract:
```bash
npx hardhat run scripts/deploy.ts --network op-sepolia
```

3. Verify the contract (optional):
```bash
npx hardhat verify --network op-sepolia DEPLOYED_CONTRACT_ADDRESS
```

#### Deployment Details
- **Network**: OP Sepolia
- **Token Cost**: 0.5 USDC
- **Smart Contract**: `GeoPrivacyPayment.sol`
- npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/geoprivacy.git
   ```

2. Install dependencies
   ```bash
   cd geoprivacy/frontend
   npm install
   ```

3. Run development server
   ```bash
   npm run dev
   ```

## 🚀 Deployment

Deployed on Netlify. Visit [GeoPrivacy App](https://geoprivacy.netlify.app)

## 🔒 Privacy Commitment

We use zero-knowledge proofs to verify location without revealing sensitive data.

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 👥 Team

AztecNoir Team - Privacy Innovators project using Zero-Knowledge Proofs with Noir and Aztec Network

## 🌍 Project Overview

GeoPrivacy is a cutting-edge application that allows users to generate zero-knowledge proofs of their location without revealing exact coordinates. Using the Noir ZK framework, users can prove they are within a certain radius of a specified location (Paris) without disclosing their exact position.

## 🛠️ Technical Architecture

- **Frontend**: Next.js + React (TypeScript)
- **Zero-Knowledge Proofs**: Noir circuits
- **Verification**: Custom Haversine distance calculation

## 📁 Project Structure

```
/GeoPrivacy
├── frontend/
│   ├── circuits/           # Noir ZK circuits
│   │   ├── src/main.nr     # Main circuit implementation
│   │   └── Nargo.toml      # Circuit configuration
│   ├── components/         # React components
│   ├── pages/              # Next.js pages
│   └── tests/              # Frontend tests
└── docs/                   # Project documentation
```

## 🚀 Features

- **Location Verification**: Prove presence within a radius of Paris
- **Timestamp Verification**: Ensure the proof is recent (within 24 hours)
- **Privacy-Preserving**: Zero-knowledge proofs reveal nothing about exact coordinates

## ⚙️ Setup and Installation

### Dependency Management

To keep dependencies up to date, use the following scripts:

#### Unix/Linux/macOS
```bash
./update_deps.sh
```

#### Windows
```powershell
.\update_deps.ps1
```

These scripts will:
- Update npm packages
- Run npm audit fix
- Update Noir circuit dependencies

1. **Install Dependencies**:
```bash
npm install
```

2. **Install Noir/Nargo** (if not already installed):
```bash
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noisup -v 1.0.0-beta.3
```

3. **Compile Circuit**:
```bash
cd frontend/circuits
nargo compile
```

4. **Run Development Server**:
```bash
cd frontend
npm run dev
```

## 🧪 Testing

1. **Circuit Testing**:
```bash
cd frontend/circuits
nargo compile  # Compile the circuit
nargo execute  # Execute with inputs from Prover.toml
nargo info     # View circuit info and metrics
```

2. **Frontend Tests**:
```bash
npm test
```

## 💻 Commands Reference

- **Lint Code**: `npm run lint`
- **Fix Lint Issues**: `npm run lint:fix`
- **Type Check**: `npm run typecheck`
- **Build for Production**: `npm run build`

## 📋 Requirements Checklist

- [x] Meaningful Use of Noir
- [x] Public GitHub repository  
- [x] Clear README
- [ ] Working frontend (à compléter)
- [ ] Demo recording (à compléter)

## 🔍 Noir Circuit Implementation

The core of GeoPrivacy is a Noir circuit that implements:

1. **Custom Trigonometric Functions**: Approximations for sine and cosine using Taylor series
2. **Haversine Distance Calculation**: For accurate Earth-surface distance calculations
3. **Radius Constraint**: Verify user is within specified radius of target
4. **Timestamp Verification**: Ensure proof is recent
