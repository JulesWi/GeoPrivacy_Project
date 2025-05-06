import { Request, Response } from 'express';
import { GeolocationService, LocationProof } from '../../services/GeolocationService';
import { LocationProofService } from '../../services/LocationProofService';
import { CoordinateMarker } from '../../utils/CoordinateMarker';
// import { config } from '../../config/web3Config';

export class LocationProofController {
  private geolocationService: GeolocationService;
  private locationProofService: LocationProofService;

  constructor() {
    this.geolocationService = new GeolocationService();
    this.locationProofService = new LocationProofService();
  }

  async generateProof(
    lat: number, 
    lon: number, 
    accuracy: number = 10,req: Request, res: Response) {
    try {
      const { userId, location /*, paymentTransaction */ } = req.body; // paymentTransaction removed

      // Générer la preuve de localisation
      const locationProof = this.geolocationService.generateLocationProof(
        lat, lon, accuracy
      );

      // Créer un token de preuve
      const proofToken = await this.geolocationService.createLocationToken(locationProof);

      // Validation des paramètres d'entrée
      if (!userId || !location || !location.latitude || !location.longitude) {
        return res.status(400).json({ 
          error: 'Invalid input parameters' 
        });
      }

      const proof = await this.locationProofService.generateLocationProof({
        userId,
        location,
        // paymentTransaction // Removed
      });

      if (!proof) {
        // Original error referenced config.proofCost which is removed.
        // Simplified error message.
        return res.status(500).json({ 
          error: 'Failed to generate location proof'
        });
      }

      res.status(200).json({ 
        proof,
        message: 'Location proof generated successfully' 
      });
    } catch (error) {
      console.error('Proof generation error:', error);
      res.status(500).json({ 
        error: 'Internal server error during proof generation' 
      });
    }
  }

  // async purchaseProofToken(req: Request, res: Response) { // ENTIRE METHOD REMOVED
  //   try {
  //     const { userAddress, privateKey } = req.body;

  //     if (!userAddress || !privateKey) {
  //       return res.status(400).json({ 
  //         error: 'User address and private key are required' 
  //       });
  //     }

  //     const transactionHash = await this.locationProofService.purchaseProofToken(
  //       userAddress, 
  //       privateKey
  //     );

  //     if (!transactionHash) {
  //       return res.status(402).json({ 
  //         error: 'Token purchase failed',
  //         details: config.proofCost
  //       });
  //     }

  //     res.status(200).json({ 
  //       transactionHash,
  //       message: 'Proof token purchased successfully' 
  //     });
  //   } catch (error) {
  //     console.error('Token purchase error:', error);
  //     res.status(500).json({ 
  //       error: 'Internal server error during token purchase' 
  //     });
  //   }
  // }
}
