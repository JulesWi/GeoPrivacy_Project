#!/usr/bin/env pwsh
$ErrorActionPreference = 'Stop'

# Update frontend npm dependencies
Write-Host "Updating frontend npm dependencies..."
Set-Location frontend
npm update
npm audit fix

# Update Noir/Rust dependencies
Write-Host "Updating Noir circuit dependencies..."
Set-Location circuits
nargo update

Write-Host "Dependency update complete!"
