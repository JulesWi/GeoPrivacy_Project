import { Request, Response, NextFunction } from 'express';
import { LocationProof } from '../models/LocationProof';
import { authenticateJWT } from '../middleware/auth';

export const locationProofController = {
  async createProof(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { location, timestamp, proof } = req.body;
      const userId = req.user?._id;

      const newProof = new LocationProof({
        user: userId,
        location,
        timestamp,
        proof
      });

      await newProof.save();

      res.status(201).json({
        message: 'Location proof created successfully',
        proof: newProof
      });
    } catch (error: any) {
      // Pass the error to the next error-handling middleware
      next(error);
    }
  },

  async getProofsByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?._id;
      const proofs = await LocationProof.find({ user: userId });

      res.json({
        message: 'Location proofs retrieved successfully',
        proofs
      });
    } catch (error: any) {
      next(error);
    }
  },

  async findValidProofsNearby(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { latitude, longitude, radius } = req.body;

      const nearbyProofs = await LocationProof.findValidProofsNearby(
        latitude, 
        longitude, 
        radius
      );

      res.json({
        message: 'Nearby valid location proofs retrieved',
        proofs: nearbyProofs
      });
    } catch (error: any) {
      next(error);
    }
  }
};
