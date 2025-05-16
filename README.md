# 🌍 GeoPrivacy: Zero-Knowledge Geolocation Proof System

## 🚀 Overview

GeoPrivacy is an innovative web application developed for NoirHack, designed to generate zero-knowledge proofs for location verification, ensuring maximum privacy and security.

## ✨ Features

- 🔒 Zero-Knowledge Location Proofs
- 🗺️ Interactive Map Integration
- 🛡️ Privacy-First Design
- 📍 Precise Location Verification

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with primary (light green) and secondary (light blue) colors
- **Mapping**: React Leaflet
- **Zero-Knowledge Proofs**: Noir Language
- **Testing**: Jest and React Testing Library

## 🚀 Getting Started

This section guides you through setting up and running the GeoPrivacy project locally.

### 1. Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Version 18 or newer. (npm is included with Node.js)
    *   *You can download it from [nodejs.org](https://nodejs.org/)*
*   **Noir Language (Nargo CLI)**:
    *   Install `noirup` (the Noir version manager) by following the instructions on the official Noir website: [Noir Installation Guide](https://noir-lang.org/docs/getting_started/installation).
    *   Then, install a Nargo version compatible with the project. This project uses `@noir-lang/noir_js@^1.0.0-beta.2`. The version `1.0.0-beta.3` of Nargo was previously mentioned in this README. Install it (or a compatible version) with:
        ```bash
        noirup -v 1.0.0-beta.3
        ```

### 2. Clone the Repository

Clone the GeoPrivacy project to your local machine:
```bash
git clone https://github.com/JulesWi/GeoPrivacy_Project.git
cd GeoPrivacy_Project
```

### 3. Install Project Dependencies

The main application and Noir circuits are located within the `frontend` directory. Navigate into it and install the necessary npm packages:
```bash
cd frontend
npm install
```
*(If you encounter issues with peer dependencies, you might try `npm install --legacy-peer-deps`)*

### 4. Compile Noir Circuits

The Noir zero-knowledge circuits need to be compiled before running the application.
```bash
# Make sure you are in the GeoPrivacy_Project/frontend/circuits directory
cd circuits 
nargo compile
# Return to the frontend directory
cd .. 
```

### 5. Run the Development Application

To start the Next.js development server for the frontend:
```bash
# Make sure you are in the GeoPrivacy_Project/frontend directory
npm run dev
```
The application should now be accessible at [http://localhost:3000](http://localhost:3000).

### 6. Running Tests

#### Circuit Tests
Test your Noir circuits using Nargo:
```bash
# Make sure you are in the GeoPrivacy_Project/frontend/circuits directory
cd circuits # If not already there
nargo test 
# You can also use `nargo execute` to run with Prover.toml inputs or `nargo info` for circuit details.
cd ..
```

#### Frontend Tests
Run the Jest tests for the React frontend:
```bash
# Make sure you are in the GeoPrivacy_Project/frontend directory
npm test
```

### (Optional) Keeping Dependencies Up-to-Date
The project root includes helper scripts for managing dependencies:
*   For Unix/Linux/macOS: `./update_deps.sh`
*   For Windows: `.\update_deps.ps1`
_These scripts attempt to update npm packages, run `npm audit fix`, and update Noir circuit dependencies._

### Security and Testing

#### Continuous Integration
- Automated tests on every push and pull request
- Code coverage reporting
- Security vulnerability scanning
- Vercel deployment with GitHub Actions
  - Configured with VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID secrets

#### Security Best Practices
- All sensitive data managed via environment variables
- Private keys and API keys never committed to repository
- Regular dependency updates
- Implemented access control mechanisms





## 🚀 Deployment

Deployed on Vercel. Visit [GeoPrivacy App](https://geo-privacy-project.vercel.app/)

## 🔒 Privacy Commitment

We use zero-knowledge proofs to verify location without revealing sensitive data.

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.


## 🌍 Project Overview

GeoPrivacy is a cutting-edge application, developed for NoirHack, that allows users to generate zero-knowledge proofs of their location without revealing exact coordinates. The core privacy is achieved using **Noir**, a domain-specific language for creating and verifying zero-knowledge proofs. Specifically, Noir circuits in this project are designed to:
1.  Accept a user's private geographical coordinates and a public defined area (e.g., within a specific radius of Paris) as inputs.
2.  Perform geometric calculations (like Haversine distance or point-in-polygon) securely within the circuit.
3.  Produce a cryptographic proof affirming that the user's location meets the specified criteria (e.g., being inside the designated area) *without disclosing the precise coordinates themselves*.
This enables verifiable location-based attestations while rigorously preserving user privacy.

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
