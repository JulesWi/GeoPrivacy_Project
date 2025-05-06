import mongoose from 'mongoose';
import { LocationProof, ILocationProofDocument, ILocationProofModel } from '../models/LocationProof';

class DatabaseService {
  private mongoUri: string;

  constructor() {
    // Utiliser une variable d'environnement pour l'URI MongoDB
    this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/geoprivacy';
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.mongoUri, {
        serverSelectionTimeoutMS: 5000,
        retryWrites: true
      });
      console.log('Connexion à MongoDB réussie');
    } catch (error) {
      console.error('Erreur de connexion à MongoDB:', error);
      throw new Error(`Impossible de se connecter à MongoDB: ${error}`);
    }
  }

  async saveLocationProof(proofData: Partial<ILocationProofDocument>): Promise<ILocationProofDocument> {
    try {
      // Définir une durée de validité configurable
      const validityDuration = parseInt(process.env.PROOF_EXPIRATION_TIME || '3600', 10);
      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + validityDuration);

      const locationProof = new LocationProof({
        ...proofData,
        expirationDate,
        isValid: true
      });

      return await locationProof.save();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la preuve:', error);
      throw new Error(`Impossible de sauvegarder la preuve: ${error}`);
    }
  }

  async findValidLocationProof(token: string): Promise<ILocationProofDocument | null> {
    try {
      // Trouver une preuve valide par son token
      return await LocationProof.findOne({ zeroKnowledgeToken: token, isValid: true });
    } catch (error) {
      console.error('Erreur lors de la recherche de la preuve par token:', error);
      return null;
    }
  }

  async invalidateLocationProof(token: string): Promise<void> {
    try {
      const proof = await LocationProof.findOne({ zeroKnowledgeToken: token });
      if (proof) {
        await proof.invalidate();
      }
    } catch (error) {
      console.error('Erreur lors de l\'invalidation de la preuve:', error);
      throw new Error(`Impossible d'invalider la preuve: ${error}`);
    }
  }

  async cleanExpiredProofs(): Promise<number> {
    try {
      const result = await LocationProof.deleteMany({ 
        expirationDate: { $lt: new Date() } 
      });
      console.log(`Nettoyage des preuves expirées: ${result.deletedCount} preuves supprimées`);
      return result.deletedCount;
    } catch (error) {
      console.error('Erreur lors du nettoyage des preuves:', error);
      return 0;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('Déconnexion de MongoDB réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion de MongoDB:', error);
    }
  }
}

export default new DatabaseService();
