#!/bin/bash
# Script d'installation pour le projet GeoPrivacy

echo "🔧 Installation des dépendances Node.js..."
npm install

echo "🔒 Installation de Noir/Nargo..."
if ! command -v nargo &> /dev/null; then
    curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
    export PATH="$HOME/.nargo/bin:$PATH"
    noirup -v 1.0.0-beta.3
else
    echo "Nargo déjà installé, vérification de la version..."
    NARGO_VERSION=$(nargo --version | head -n 1)
    echo "Version actuelle: $NARGO_VERSION"
fi

echo "🔄 Compilation du circuit Noir..."
cd frontend/circuits
nargo compile

echo "✅ Configuration terminée!"
echo "Pour lancer l'application, exécutez: cd frontend && npm run dev"
