// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { configure, cleanup } from '@testing-library/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { afterEach } from 'vitest';

// Configure i18next for testing
i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    resources: {
      en: {
        common: {
          welcome: "Welcome",
          continue: "Continue"
        },
      },
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Mock i18n for testing
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) => {
      const result = i18n.t(key, options);
      return result;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

// Suppress React 18 warnings during testing
const originalError = console.error;
console.error = (...args) => {
  if (/Warning: ReactDOM.render is no longer supported/.test(args[0])) {
    return;
  }
  originalError(...args);
};

// Cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});
