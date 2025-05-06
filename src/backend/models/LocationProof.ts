import mongoose, { Types, Model } from 'mongoose';
import crypto from 'crypto';

/**
 * Base interface representing the core properties of a Location Proof
 * Used for creating and storing geospatial verification tokens
 */
export interface ILocationProofBase {
  zeroKnowledgeToken: string;
  verificationRadius: number;
  centerLat: number;
  centerLon: number;
  proofTimestamp: Date;
  expirationDate: Date;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Methods interface for Location Proof, defining additional functionality
 * beyond basic document properties
 */
export interface ILocationProofMethods {
  /**
   * Checks if the location proof has expired
   * @returns {boolean} True if the proof is expired, false otherwise
   */
  isExpired(): boolean;
  generateToken(): string;
  invalidate(): Promise<any>;
  checkValidity(): boolean;
}

// Define the document type that combines the base interface with Document
export interface ILocationProofDocument extends mongoose.Document, ILocationProofBase {
  user: Types.ObjectId;
  location: string;
  timestamp: Date;
  proof: string;
  zeroKnowledgeToken: string;
  paymentTransaction?: {
    hash: string;
    network: string;
    amount: number;
    token: string;
  };
}

// Define the model type that includes methods
export interface ILocationProofModel extends Model<ILocationProofDocument, {}, ILocationProofMethods> {
  findValidProofsNearby(this: ILocationProofModel, latitude: number, longitude: number, radius: number): Promise<ILocationProofDocument[]>;
  findValidProofs(this: ILocationProofModel, latitude: number, longitude: number, radius: number): Promise<ILocationProofDocument[]>;
}

// Schema for Location Proof
const LocationProofSchema = new mongoose.Schema({
  zeroKnowledgeToken: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (token: string) => token.length === 64, // Assuming SHA-256 token
      message: 'Zero Knowledge Token must be a valid 64-character hash'
    }
  },
  verificationRadius: {
    type: Number,
    required: true,
    min: [0, 'Verification radius cannot be negative'],
    max: [1000, 'Verification radius cannot exceed 1000 meters']
  },
  centerLat: {
    type: Number,
    required: true,
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90']
  },
  centerLon: {
    type: Number,
    required: true,
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180']
  },
  proofTimestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  expirationDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(this: ILocationProofDocument, value: Date) {
        return value > this.proofTimestamp;
      },
      message: 'Expiration date must be after proof timestamp'
    }
  },
  isValid: {
    type: Boolean,
    default: true
  },
  // Optional fields now added to schema based on ILocationProofDocument usage
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  location: { // Storing as stringified JSON as per LocationProofService
    type: String 
  },
  proof: { // The ZK proof string
    type: String 
  },
  // Note: createdAt and updatedAt are handled by the timestamps option below
}, {
  timestamps: true
});

// Instance Methods
/**
 * Calculates the remaining validity time of the location proof
 * @returns {number} Remaining time in milliseconds, or negative if expired
 */
LocationProofSchema.methods.getRemainingValidity = function(): number {
  return this.expirationDate.getTime() - new Date().getTime();
};

LocationProofSchema.methods.isExpired = function(): boolean {
  return new Date() > this.expirationDate;
};

/**
 * Generates a cryptographically secure random token
 * Uses SHA-256 for high entropy and uniqueness
 * @returns {string} A 64-character hexadecimal token
 */
LocationProofSchema.methods.generateToken = function(): string {
  // Additional entropy by combining random bytes with timestamp
  const timestamp = Date.now().toString();
  const randomPart = crypto.randomBytes(32).toString('hex');
  return crypto.createHash('sha256').update(randomPart + timestamp).digest('hex');
};

/**
 * Invalidates the current location proof
 * Sets isValid to false and saves the document
 * @returns {Promise<LocationProofType>} The updated location proof document
 */
LocationProofSchema.methods.invalidate = function(): Promise<any> {
  this.isValid = false;
  return this.save();
};

LocationProofSchema.methods.checkValidity = function(): boolean {
  return this.isValid && !this.isExpired();
};

// Static Methods
LocationProofSchema.statics.findValidProofs = function(
  lat: number, 
  lon: number, 
  radius: number
) {
  return this.find({
    isValid: true,
    centerLat: { $gte: lat - radius, $lte: lat + radius },
    centerLon: { $gte: lon - radius, $lte: lon + radius }
  });
};

/**
 * Static method to find valid location proofs within a specific geographic area
 * @param lat Latitude of the center point
 * @param lon Longitude of the center point
 * @param radius Search radius in meters
 * @returns {Promise<LocationProofType[]>} Array of valid location proofs
 */
LocationProofSchema.statics.findValidProofsNearby = async function(
  lat: number, 
  lon: number, 
  radius: number
): Promise<ILocationProofDocument[]> {
  const earthRadiusInMeters = 6371000; // Approximate Earth radius in meters
  
  return this.find({
    isValid: true,
    $expr: {
      $lte: [
        {
          $sqrt: {
            $add: [
              { $pow: [{ $subtract: ['$centerLat', lat] }, 2] },
              { $pow: [{ $subtract: ['$centerLon', lon] }, 2] }
            ]
          }
        },
        radius / earthRadiusInMeters
      ]
    }
  });
};

// Create and export the model
export const LocationProof = mongoose.model<
  ILocationProofDocument, 
  ILocationProofModel
>('LocationProof', LocationProofSchema);

// Export a type for instances of the model (for use in other files)
export type LocationProofType = mongoose.HydratedDocument<ILocationProofDocument> & ILocationProofMethods;
