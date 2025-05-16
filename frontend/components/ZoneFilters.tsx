import React, { useState } from 'react';

export type ZoneType = 'residential' | 'commercial' | 'educational' | 'recreational' | 'custom';

interface ZoneFiltersProps {
  onFilterChange: (selectedTypes: ZoneType[]) => void;
}

const ZoneFilters: React.FC<ZoneFiltersProps> = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<ZoneType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const zoneTypes: { type: ZoneType; label: string; icon: string }[] = [
    { 
      type: 'residential', 
      label: 'Residential', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    },
    { 
      type: 'commercial', 
      label: 'Commercial', 
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' 
    },
    { 
      type: 'educational', 
      label: 'Educational', 
      icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222' 
    },
    { 
      type: 'recreational', 
      label: 'Recreational', 
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
    },
    { 
      type: 'custom', 
      label: 'Custom', 
      icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' 
    }
  ];

  const toggleFilter = (type: ZoneType) => {
    setSelectedFilters(prev => {
      const newFilters = prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type];
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-6 max-w-3xl mx-auto animate-fade-in">
      <div className="bg-secondary-light/20 dark:bg-secondary-dark/20 rounded-lg p-5 border border-secondary-light/50 dark:border-secondary-dark/50 shadow-md transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-secondary-dark dark:text-secondary-light flex items-center transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Zone Filters
          </h2>
          <button 
            onClick={togglePanel}
            className="text-secondary-dark dark:text-secondary-light hover:text-secondary transition-colors duration-300"
            aria-expanded={isOpen}
            aria-controls="zone-filters-panel"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        {isOpen && (
          <div id="zone-filters-panel" className="animate-slide-up">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {zoneTypes.map(zone => (
                <button
                  key={zone.type}
                  onClick={() => toggleFilter(zone.type)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-300 transform hover:scale-105 ${
                    selectedFilters.includes(zone.type)
                      ? 'bg-secondary-light/30 dark:bg-secondary-dark/30 border-secondary text-secondary-dark dark:text-secondary-light shadow-md'
                      : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={zone.icon} />
                  </svg>
                  <span className="text-sm font-medium">{zone.label}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              <p>
                {selectedFilters.length === 0 
                  ? 'No filters selected. Showing all zones.' 
                  : `Filtering by: ${selectedFilters.map(type => zoneTypes.find(z => z.type === type)?.label).join(', ')}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoneFilters;
