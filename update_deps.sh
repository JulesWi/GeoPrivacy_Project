#!/bin/bash
set -e

# Update frontend npm dependencies
echo "Updating frontend npm dependencies..."
cd frontend
npm update
npm audit fix

# Update Noir/Rust dependencies
echo "Updating Noir circuit dependencies..."
cd circuits
nargo update

echo "Dependency update complete!"
