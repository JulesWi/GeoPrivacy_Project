# Guide de Configuration des Secrets 🔐

## Secrets GitHub Actions

### 1. Secrets Blockchain

#### OP Sepolia
- `OP_SEPOLIA_RPC_URL`: URL du nœud RPC OP Sepolia
  - Obtenir depuis [Alchemy](https://www.alchemy.com/) ou [Infura](https://infura.io/)
  - Exemple : `https://opt-sepolia.g.alchemy.com/v2/YOUR-API-KEY`

#### Wallet de Déploiement
- `PRIVATE_KEY`: Clé privée du wallet de déploiement
  - **ATTENTION** : Utilisez un wallet dédié au déploiement
  - Jamais partager ou commiter cette clé
  - Générer avec MetaMask ou un portefeuille Ethereum

### 2. Services de Déploiement

#### Vercel
- `VERCEL_TOKEN`: Token d'accès personnel Vercel
  - Générer dans [Paramètres Vercel](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID`: ID de votre organisation Vercel
- `VERCEL_PROJECT_ID`: ID du projet GeoPrivacy sur Vercel

### 3. Analyse de Sécurité

#### Codecov
- `CODECOV_TOKEN`: Token pour les rapports de couverture de code
  - Obtenir depuis [Codecov](https://codecov.io/)

#### MythX
- `MYTHX_API_KEY`: Clé API pour l'analyse de contrats
  - S'inscrire sur [MythX](https://mythx.io/)

## Étapes de Configuration

1. **GitHub**
   ```bash
   # Dans les paramètres du dépôt GitHub
   Settings > Secrets and variables > Actions
   ```

2. **Ajouter Chaque Secret**
   - Cliquer sur "New repository secret"
   - Nom du secret
   - Valeur du secret

## Bonnes Pratiques

- Régénérer régulièrement les tokens
- Utiliser des comptes avec accès minimal
- Surveiller l'utilisation des secrets

## Dépannage

- Vérifier que tous les secrets sont correctement configurés
- Tester individuellement chaque intégration
- Consulter les logs GitHub Actions

## Sécurité Avancée

- Utiliser [git-secret](https://git-secret.io/) 
- Configurer [Vault](https://www.vaultproject.io/) pour la gestion des secrets
- Mettre en place une rotation automatique des credentials

---

**Dernière mise à jour** : 2025-05-05
