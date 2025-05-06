import type { NextApiRequest, NextApiResponse } from 'next';
import { sha3_256 } from 'js-sha3';

interface LocationProof {
  locationHash: string;
  timestamp: Date;
  zkProof: string;
  region?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const proof: LocationProof = req.body;

    try {
      // Basic validation
      if (!proof.locationHash || !proof.zkProof) {
        return res.status(400).json({ 
          valid: false, 
          message: 'Invalid proof format' 
        });
      }

      // Check proof age (e.g., valid for 1 hour)
      const proofAge = Date.now() - new Date(proof.timestamp).getTime();
      if (proofAge > 3600000) {
        return res.status(400).json({ 
          valid: false, 
          message: 'Proof has expired' 
        });
      }

      // Simulate ZK proof verification
      const verificationResult = simulateZKProofVerification(proof);

      return res.status(200).json({
        valid: verificationResult,
        region: proof.region,
        timestamp: proof.timestamp
      });
    } catch (error) {
      console.error('Proof verification error:', error);
      return res.status(500).json({ 
        valid: false, 
        message: 'Internal server error' 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function simulateZKProofVerification(proof: LocationProof): boolean {
  // This is a placeholder for actual ZK proof verification
  // In a real implementation, this would use a ZK proof verification library
  const verificationHash = sha3_256(
    proof.locationHash + 
    proof.zkProof + 
    new Date(proof.timestamp).toISOString()
  );
  
  // Simple validation logic
  return verificationHash.startsWith('0000');
}
