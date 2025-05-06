import express from 'express';
import { authController } from '../controllers/authController';
import Joi from 'joi';

const router = express.Router();

// Validation middleware
const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      });
      return;
    }
    
    next();
  };
};

// Registration validation schema
const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().optional(),
  publicKey: Joi.string().optional()
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Routes
router.post(
  '/register', 
  validateRequest(registrationSchema),
  authController.register
);

router.post(
  '/login', 
  validateRequest(loginSchema),
  authController.login
);

export default router;
