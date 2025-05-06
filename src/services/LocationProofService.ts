// import { PaymentService } from './PaymentService';
import { LocationProof, LocationProofType } from '../backend/models/LocationProof';
import crypto from 'crypto'; // Ensure crypto is imported for fallback token generation
import { ZeroKnowledgeProofGenerator } from './ZeroKnowledgeProofGenerator';
// import { config } from '../config/web3Config';

export interface LocationProofRequest {
  userId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  // paymentTransaction?: string;
}

export class LocationProofService {
//   private paymentService: PaymentService;
  private proofGenerator: ZeroKnowledgeProofGenerator;

  constructor() {
    // this.paymentService = new PaymentService();
    this.proofGenerator = new ZeroKnowledgeProofGenerator();
  }

  async generateLocationProof(
    request: LocationProofRequest
  ): Promise<string | null> {
    try {
      // 1. Vérifier le paiement - REMOVED
      // const paymentVerification = await this.paymentService.verifyPayment(
      //   request.userId
      // );

      // if (!paymentVerification.isValid) {
      //   throw new Error('Payment verification failed. Please purchase a proof token.');
      // }

      // 2. Générer la preuve ZK
      const zkProof = await this.proofGenerator.generateProof({
        userId: request.userId,
        location: request.location
      });


      // 3. Enregistrer la preuve avec les détails de transaction
      const proofTimestamp = new Date();
      const expirationDate = new Date(proofTimestamp.getTime() + 60 * 60 * 1000); // 1 hour expiration

      // Helper to generate token - ideally, this would be on the model or a utility
      // For now, creating a temporary instance to call the method.
      const tempProofForToken = new LocationProof();
      const generatedZkToken = tempProofForToken.generateToken ? tempProofForToken.generateToken() : crypto.randomBytes(32).toString('hex');


      const locationProofData = {
        // Fields from ILocationProofDocument / passed by service
        user: request.userId, // This field is not in LocationProofSchema
        location: JSON.stringify(request.location), // This field is not in LocationProofSchema
        proof: zkProof, // This field is not in LocationProofSchema
        timestamp: proofTimestamp, // This will map to proofTimestamp if schema is adjusted, or ignored

        // Fields strictly from LocationProofSchema
        zeroKnowledgeToken: generatedZkToken,
        verificationRadius: 100, // Default value, e.g., 100 meters
        centerLat: request.location.latitude,
        centerLon: request.location.longitude,
        proofTimestamp: proofTimestamp,
        expirationDate: expirationDate,
        isValid: true // Default from schema
        // paymentTransaction is removed
      };
      
      const locationProof = new LocationProof(locationProofData);


      await locationProof.save();

      return zkProof;
    } catch (error) {
      console.error('Location proof generation error:', error);
      return null;
    }
  }

  // async purchaseProofToken( // REMOVED
  //   userAddress: string, 
  //   privateKey: string
  // ): Promise<string | null> {
  //   return this.paymentService.purchaseProofToken(userAddress, privateKey);
  // }
}
