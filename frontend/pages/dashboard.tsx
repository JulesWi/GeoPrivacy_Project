import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import ZoneDashboard from '../components/ZoneDashboard';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30 dark:from-primary-dark/20 dark:to-secondary-dark/20 transition-colors duration-300 ${theme}`}>
      <Head>
        <title>Zone Dashboard | GeoPrivacy</title>
        <meta name="description" content="View and manage your location zones" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white dark:bg-dark-card shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-dark dark:text-primary-light transition-colors duration-300">
                  GeoPrivacy
                </h1>
              </div>
              <nav className="ml-6 flex space-x-8">
                <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary-dark dark:hover:text-primary-light transition-colors duration-300">
                  Home
                </Link>
                <Link href="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-primary-dark dark:border-primary-light text-sm font-medium text-primary-dark dark:text-primary-light transition-colors duration-300">
                  Dashboard
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main>
        <ZoneDashboard />
      </main>

      <footer className="bg-white dark:bg-dark-card shadow-inner mt-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            &copy; {new Date().getFullYear()} GeoPrivacy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
