import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    contextualGuide: {
      locationProof: {
        title: 'Location Proof Generation',
        description: 'Create secure, cryptographically signed location proofs.',
        tips: [
          'Ensure GPS is enabled for accurate coordinates',
          'Proofs are valid for 30 minutes',
          'Each proof generates a unique hash'
        ]
      },
      payment: {
        title: 'Payment & Tokens',
        description: 'Purchase and manage location proof tokens.',
        tips: [
          'Tokens are required to generate location proofs',
          'Check token balance before generating proofs',
          'Tokens can be purchased using USDC'
        ]
      },
      dashboard: {
        title: 'User Dashboard',
        description: 'Overview of your location proofs and account status.',
        tips: [
          'View your recent location proofs',
          'Track token usage and balance',
          'Monitor proof verification status'
        ]
      }
    }
  },
  fr: {
    contextualGuide: {
      locationProof: {
        title: 'Génération de Preuve de Localisation',
        description: 'Créez des preuves de localisation cryptographiquement signées.',
        tips: [
          'Assurez-vous que le GPS est activé pour des coordonnées précises',
          'Les preuves sont valides pendant 30 minutes',
          'Chaque preuve génère un hachage unique'
        ]
      },
      payment: {
        title: 'Paiement & Jetons',
        description: 'Achetez et gérez des jetons de preuve de localisation.',
        tips: [
          'Des jetons sont nécessaires pour générer des preuves de localisation',
          'Vérifiez le solde des jetons avant de générer des preuves',
          'Les jetons peuvent être achetés en USDC'
        ]
      },
      dashboard: {
        title: 'Tableau de Bord Utilisateur',
        description: 'Vue d\'ensemble de vos preuves de localisation et de l\'état de votre compte.',
        tips: [
          'Consultez vos récentes preuves de localisation',
          'Suivez l\'utilisation et le solde des jetons',
          'Surveillez l\'état de vérification des preuves'
        ]
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // langue par défaut
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already escapes values
    }
  });

export default i18n;
