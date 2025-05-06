# Script d'installation PowerShell pour GeoPrivacy

Write-Host "🔧 Installation des dépendances Node.js..." -ForegroundColor Cyan
npm install

Write-Host "🔄 Configuration de WSL pour Noir/Nargo..." -ForegroundColor Cyan
Write-Host "Note: Vous devrez installer Noir dans WSL manuellement avec:" -ForegroundColor Yellow
Write-Host "curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash" -ForegroundColor Yellow
Write-Host "noirup -v 1.0.0-beta.3" -ForegroundColor Yellow

Write-Host "📝 Configuration des chemins pour Windows/WSL..." -ForegroundColor Cyan
# Création d'un fichier .env si nécessaire
if (-not (Test-Path -Path ".\.env")) {
    "NOIR_CIRCUIT_PATH=./circuits" | Out-File -FilePath ".\.env" -Encoding utf8
    Write-Host "Fichier .env créé avec les chemins par défaut" -ForegroundColor Green
}

Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host "Pour lancer l'application, exécutez: cd frontend; npm run dev" -ForegroundColor Cyan
