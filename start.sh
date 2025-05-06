#!/bin/bash

# Script de démarrage rapide pour GeoPrivacy

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de vérification des prérequis
check_prerequisites() {
    echo -e "${YELLOW}🔍 Vérification des prérequis...${NC}"
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js non installé${NC}"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm non installé${NC}"
        exit 1
    fi
    
    # Version minimale de Node.js
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_VERSION="18.0.0"
    
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
        echo -e "${YELLOW}⚠️ Version de Node.js recommandée : >= 18.x${NC}"
    fi
}

# Configuration initiale
setup_project() {
    echo -e "${YELLOW}🛠️ Configuration du projet...${NC}"
    
    # Installer les dépendances
    npm ci
    
    # Configuration initiale
    npm run project:setup
    
    # Validation du projet
    npm run project:validate
}

# Démarrage des services
start_services() {
    echo -e "${YELLOW}🚀 Démarrage des services...${NC}"
    
    # Compiler les contrats
    npm run contract:compile
    
    # Démarrer le backend
    npm run backend:start &
    
    # Démarrer le frontend
    npm run frontend:start &
    
    wait
}

# Fonction principale
main() {
    clear
    echo -e "${GREEN}🌐 GeoPrivacy - Démarrage du projet${NC}"
    
    check_prerequisites
    setup_project
    start_services
}

# Exécution
main
