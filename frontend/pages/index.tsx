import Head from 'next/head'
import Link from 'next/link'
import LocationProofGenerator from '../components/LocationProofGenerator'
import ThemeToggle from '../components/ThemeToggle'
import { useTheme } from '../contexts/ThemeContext'

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <Head>
        <title>GeoPrivacy - Zero-Knowledge Location Proofs</title>
        <meta name="description" content="Generate secure, private location proofs" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
                <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-primary-dark dark:border-primary-light text-sm font-medium text-primary-dark dark:text-primary-light transition-colors duration-300">
                  Home
                </Link>
                <Link href="/dashboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary-dark dark:hover:text-primary-light transition-colors duration-300">
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

      <LocationProofGenerator />

      <footer className="bg-white dark:bg-dark-card shadow-inner mt-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            &copy; {new Date().getFullYear()} GeoPrivacy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
