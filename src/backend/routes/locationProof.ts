import express from 'express';
import { locationProofController } from '../controllers/locationProofController';
import { LocationProof } from '../models/LocationProof';
import { authenticateJWT } from '../middleware/auth';
import Joi from 'joi';

const router = express.Router();

// Validation middleware
const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }
    
    next();
  };
};

// Create proof validation schema
const createProofSchema = Joi.object({
  location: Joi.string().required(),
  timestamp: Joi.date().required(),
  proof: Joi.string().required()
});

// Nearby proofs validation schema
const nearbyProofsSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  radius: Joi.number().positive().required()
});

// Routes
router.post(
  '/create', 
  authenticateJWT,
  validateRequest(createProofSchema),
  async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      await locationProofController.createProof(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/user',
  authenticateJWT,
  async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      await locationProofController.getProofsByUser(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/nearby',
  authenticateJWT,
  validateRequest(nearbyProofsSchema),
  async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      await locationProofController.findValidProofsNearby(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
