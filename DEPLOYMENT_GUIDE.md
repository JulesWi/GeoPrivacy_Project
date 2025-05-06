# Guide de Déploiement GeoPrivacy 🚀

## Prérequis

### Environnement
- Node.js 18+
- Hardhat
- Wallet Ethereum avec fonds sur OP Sepolia

### Outils Nécessaires
- GitHub CLI
- Vercel CLI
- Etherscan API Key

## Étapes de Préparation

### 1. Configuration Initiale
```bash
# Cloner le dépôt
git clone https://github.com/votre-org/geoproof.git
cd geoproof

# Installer les dépendances
npm ci

# Configuration du projet
npm run project:setup
```

### 2. Configuration des Secrets
```bash
# Configurer les secrets GitHub
./scripts/setup-github-secrets.sh

# Vérifier la configuration
npm run project:validate
```

### 3. Déploiement sur OP Sepolia

#### Déploiement Simulé
```bash
# Tester le déploiement
npm run contract:deploy:dry-run
```

#### Déploiement Réel
```bash
# Déployer les contrats
npm run contract:deploy -- --network op-sepolia

# Vérifier sur Etherscan
npx hardhat verify ADRESSE_CONTRAT --network op-sepolia
```

### 4. Déploiement Frontend (Vercel)
```bash
# Connexion Vercel
vercel login

# Déployer
vercel
```

## Vérifications Finales

```bash
# Validation complète
npm run project:final-validation

# Générer la documentation
npm run docs:generate
```

## Surveillance et Maintenance

- Surveiller les logs de déploiement
- Vérifier les transactions sur Etherscan
- Monitorer les performances sur Vercel

## Rollback et Restauration

- Conserver les adresses de contrats
- Garder une copie du `.env`
- Utiliser les scripts de déploiement pour restaurer

## Sécurité

- Rotation régulière des clés
- Mises à jour des dépendances
- Audits de sécurité périodiques

## Ressources

- [Documentation Optimism](https://community.optimism.io/)
- [Hardhat Docs](https://hardhat.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

**Dernière mise à jour** : 2025-05-05
