import React, { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { motion, AnimatePresence } from 'framer-motion';

interface ContextualGuideProps {
  route: string;
}

interface GuideContent {
  title: string;
  description: string;
  tips?: string[];
}

const GUIDE_CONTENT: Record<string, GuideContent> = {
  '/location-proof': {
    title: 'Location Proof Generation',
    description: 'Create secure, cryptographically signed location proofs.',
    tips: [
      'Ensure GPS is enabled for accurate coordinates',
      'Proofs are valid for 30 minutes',
      'Each proof generates a unique hash'
    ]
  },
  '/payment': {
    title: 'Payment & Tokens',
    description: 'Purchase and manage location proof tokens.',
    tips: [
      'Tokens are required to generate location proofs',
      'Check token balance before generating proofs',
      'Tokens can be purchased using USDC'
    ]
  },
  '/dashboard': {
    title: 'User Dashboard',
    description: 'Overview of your location proofs and account status.',
    tips: [
      'View your recent location proofs',
      'Track token usage and balance',
      'Monitor proof verification status'
    ]
  }
};

export const ContextualGuide: React.FC<ContextualGuideProps & { 
  customContent?: {
    title?: string;
    description?: string;
    tips?: string[];
    icon?: ReactNode;
  }
}> = ({ route, customContent }) => {
  const { t } = useTranslation('contextualGuide');

  const [isVisible, setIsVisible] = useState(false);
  const [guide, setGuide] = useState<GuideContent | null>(null);

  useEffect(() => {
    const content = customContent || GUIDE_CONTENT[route];
    if (content) {
      setGuide(content);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [route]);

  if (!guide) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm bg-white shadow-lg rounded-lg p-4 border-l-4 border-blue-500 transition-all duration-300 ease-in-out hover:shadow-xl"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">{guide.title}</h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
          {guide.tips && (
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
              {guide.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextualGuide;
