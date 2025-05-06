import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { latitude, longitude, timestamp } = req.body;

      // Mock de génération de preuve (à remplacer par Noir)
      const mockProof = {
        latitude,
        longitude,
        timestamp,
        proof: 'mock_zero_knowledge_proof'
      };

      res.status(200).json(mockProof);
    } catch (error) {
      console.error('Error generating location proof:', error);
      res.status(500).json({ error: 'Failed to generate location proof' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
