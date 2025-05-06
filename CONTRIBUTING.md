# Guide de Contribution à GeoPrivacy

## Bienvenue !

Nous sommes ravis que vous souhaitiez contribuer à GeoPrivacy. Ce document vous guidera dans le processus de contribution.

## Processus de Contribution

1. **Fork du Dépôt**
   - Forkez le dépôt sur GitHub
   - Clonez votre fork localement

2. **Configuration de l'Environnement**
   ```bash
   # Installer les dépendances
   npm install

   # Configurer les variables d'environnement
   cp .env.example .env
   ```

3. **Développement**
   - Créez une branche pour vos modifications
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```
   - Suivez nos conventions de codage
   - Écrivez des tests pour vos modifications

4. **Tests**
   ```bash
   # Exécuter les tests
   npm run test:contracts

   # Vérifier la couverture de code
   npm run test:contracts:coverage
   ```

5. **Soumettre une Pull Request**
   - Décrivez clairement vos modifications
   - Liez les issues concernées
   - Assurez-vous que tous les tests passent

## Types de Contributions

- Corrections de bugs
- Nouvelles fonctionnalités
- Améliorations de la documentation
- Optimisations de performances
- Corrections de sécurité

## Directives de Codage

- Suivez les standards Solidity
- Commentez votre code
- Maintenez une couverture de test élevée
- Optimisez le gaz pour les contrats

## Processus de Revue

- Revue par les pairs
- Vérifications automatiques
- Tests de sécurité
- Validation des performances

## Questions ?

Ouvrez une issue sur GitHub ou contactez l'équipe de développement.

Merci de contribuer à GeoPrivacy !
