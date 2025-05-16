import React, { useState, useEffect } from 'react';

// Interface for location settings
export interface LocationSettings {
  radius: number;         // Location radius in meters
  zoneName: string;       // Custom zone name
  precision: number;      // Location precision (1-10)
  privacyLevel: 'high' | 'medium' | 'low'; // Privacy level
}

// Default values
const DEFAULT_SETTINGS: LocationSettings = {
  radius: 500,
  zoneName: 'My Zone',
  precision: 5,
  privacyLevel: 'high'
};

interface LocationSettingsProps {
  onSettingsChange: (settings: LocationSettings) => void;
  initialSettings?: LocationSettings;
}

const LocationSettings: React.FC<LocationSettingsProps> = ({ 
  onSettingsChange,
  initialSettings 
}) => {
  const [settings, setSettings] = useState<LocationSettings>(initialSettings || DEFAULT_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('locationSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        onSettingsChange(parsedSettings);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, [onSettingsChange]);

  // Save settings to localStorage on each change
  useEffect(() => {
    localStorage.setItem('locationSettings', JSON.stringify(settings));
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setSettings(prev => {
      const newSettings = { 
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      };
      
      onSettingsChange(newSettings);
      return newSettings;
    });
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-8 max-w-3xl mx-auto animate-fade-in">
      <div className="bg-primary-light/20 dark:bg-primary-dark/20 rounded-lg p-5 border border-primary-light/50 dark:border-primary-dark/50 shadow-md transition-all duration-300">
        <h2 className="text-2xl font-bold text-primary-dark dark:text-primary-light mb-4 flex items-center transition-colors duration-300 animate-slide-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Location Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          {/* Location Radius */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300" htmlFor="radius">
              Location Radius (meters)
            </label>
            <input
              type="range"
              id="radius"
              name="radius"
              min="100"
              max="5000"
              step="100"
              value={settings.radius}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer transition-colors duration-300"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
              <span>100m</span>
              <span>{settings.radius}m</span>
              <span>5000m</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Define the radius around your location (100m to 5000m)</p>
          </div>

          {/* Zone Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300" htmlFor="zoneName">
              Zone Name
            </label>
            <input
              type="text"
              id="zoneName"
              name="zoneName"
              value={settings.zoneName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light transition-colors duration-300"
              placeholder="E.g.: Neighborhood, City, etc."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Give a name to this location zone</p>
          </div>

          {/* Precision */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300" htmlFor="precision">
              Precision (1-10)
            </label>
            <input
              type="range"
              id="precision"
              name="precision"
              min="1"
              max="10"
              value={settings.precision}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer transition-colors duration-300"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
              <span>Low</span>
              <span>{settings.precision}</span>
              <span>High</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Higher precision requires more accurate GPS data</p>
          </div>

          {/* Privacy Level */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300" htmlFor="privacyLevel">
              Privacy Level
            </label>
            <select
              id="privacyLevel"
              name="privacyLevel"
              value={settings.privacyLevel}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light transition-colors duration-300"
            >
              <option value="high">High (recommended)</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Controls how much information is shared in proofs</p>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800 transition-all duration-300">
          <p className="text-sm text-blue-800 dark:text-blue-300 transition-colors duration-300">
            <strong>Note:</strong> These settings affect the generation of your location proofs.
            A larger radius offers more privacy but less precision.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationSettings;
