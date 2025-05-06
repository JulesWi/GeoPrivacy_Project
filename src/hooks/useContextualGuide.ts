import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Interface representing the content of a contextual guide
 */
export interface GuideContent {
  title: string;
  description: string;
  tips: string[];
}

/**
 * Hook to manage contextual guide visibility and content
 * @param route Current route to determine guide content
 * @returns Object with guide visibility, content, and control methods
 */
export function useContextualGuide(route: string): {
  isVisible: boolean;
  guide: GuideContent | null;
  hideGuide: () => void;
  showGuide: () => void;
} {
  const { t } = useTranslation('contextualGuide');

  const [isVisible, setIsVisible] = useState(false);
  const [guide, setGuide] = useState<GuideContent | null>(null);

  useEffect(() => {
    try {
      const title = t(`${route}.title`);
      const description = t(`${route}.description`);
      const tips = t(`${route}.tips`, { returnObjects: true }) as string[] || [];

      // If no title is found, set guide to null
      if (title === `${route}.title`) {
        setGuide(null);
        setIsVisible(false);
        return;
      }

      const content: GuideContent = { title, description, tips };
      setGuide(content);
      setIsVisible(true);
    } catch (error) {
      setGuide(null);
      setIsVisible(false);
    }
  }, [route, t]);

  /**
   * Hide the contextual guide
   */
  const hideGuide = useCallback(() => {
    setIsVisible(false);
  }, []);

  /**
   * Show the contextual guide
   */
  const showGuide = useCallback(() => {
    if (guide) {
      setIsVisible(true);
    }
  }, [guide]);

  return { isVisible, guide, hideGuide, showGuide };
};
