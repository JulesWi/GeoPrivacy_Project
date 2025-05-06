# Script de démarrage rapide pour GeoPrivacy

function Check-Prerequisites {
    Write-Host "🔍 Vérification des prérequis..." -ForegroundColor Yellow
    
    # Vérifier Node.js
    if (!(Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Node.js non installé" -ForegroundColor Red
        exit 1
    }
    
    # Vérifier npm
    if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Host "❌ npm non installé" -ForegroundColor Red
        exit 1
    }
    
    # Version minimale de Node.js
    $nodeVersion = (node --version).Trim('v')
    $requiredVersion = [System.Version]"18.0.0"
    
    if ([System.Version]$nodeVersion -lt $requiredVersion) {
        Write-Host "⚠️ Version de Node.js recommandée : >= 18.x" -ForegroundColor Yellow
    }
}

function Setup-Project {
    Write-Host "🛠️ Configuration du projet..." -ForegroundColor Yellow
    
    # Installer les dépendances
    npm ci
    
    # Configuration initiale
    npm run project:setup
    
    # Validation du projet
    npm run project:validate
}

function Start-Services {
    Write-Host "🚀 Démarrage des services..." -ForegroundColor Yellow
    
    # Compiler les contrats
    npm run contract:compile
    
    # Démarrer le backend
    Start-Process npm -ArgumentList "run backend:start" -PassThru
    
    # Démarrer le frontend
    Start-Process npm -ArgumentList "run frontend:start" -PassThru
    
    # Attendre la fin des processus
    Wait-Process
}

function Main {
    Clear-Host
    Write-Host "🌐 GeoPrivacy - Démarrage du projet" -ForegroundColor Green
    
    Check-Prerequisites
    Setup-Project
    Start-Services
}

# Exécution
Main
