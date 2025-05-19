import React, { useState, useEffect } from 'react';
import ZoneFilters, { ZoneType } from './ZoneFilters';
import ZoneStatistics from './ZoneStatistics';
import { useNotification } from '../contexts/NotificationContext';

interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  radius: number;
  visits: number;
  lastVisit: string;
}

const ZoneDashboard: React.FC = () => {
  const [selectedZoneTypes, setSelectedZoneTypes] = useState<ZoneType[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const { showNotification } = useNotification();

    useEffect(() => {
    // Show loading notification
    showNotification('info', 'Loading your zones...', 1500);
    
    // Fetch real data from API
    fetch('/api/zones') // Assurez-vous que cette API existe
      .then(response => response.json())
      .then(data => {
        setZones(data);
        showNotification('success', `${data.length} zones loaded successfully`, 3000);
      })
      .catch(error => {
        showNotification('error', 'Failed to load zones', 3000);
      });
  }, [showNotification]);

  // Filter zones based on selected types
  const filteredZones = selectedZoneTypes.length > 0
    ? zones.filter(zone => selectedZoneTypes.includes(zone.type))
    : zones;

  // Calculate statistics
  const totalVisits = filteredZones.reduce((sum, zone) => sum + zone.visits, 0);
  const averageRadius = filteredZones.length > 0
    ? Math.round(filteredZones.reduce((sum, zone) => sum + zone.radius, 0) / filteredZones.length)
    : 0;
  
  const mostVisitedZone = filteredZones.length > 0
    ? filteredZones.reduce((prev, current) => (prev.visits > current.visits) ? prev : current)
    : null;

  const statistics = [
    {
      label: 'Total Zones',
      value: filteredZones.length,
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      change: {
        value: 12,
        isPositive: true
      }
    },
    {
      label: 'Total Visits',
      value: totalVisits,
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      change: {
        value: 8,
        isPositive: true
      }
    },
    {
      label: 'Average Radius',
      value: `${averageRadius}m`,
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      change: {
        value: 5,
        isPositive: false
      }
    },
    {
      label: 'Most Visited',
      value: mostVisitedZone?.name || 'N/A',
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    }
  ];

  const handleFilterChange = (types: ZoneType[]) => {
    setSelectedZoneTypes(types);
    
    if (types.length > 0) {
      const typeLabels = types.map(type => {
        // Capitalize first letter
        return type.charAt(0).toUpperCase() + type.slice(1);
      }).join(', ');
      
      showNotification('info', `Filtering zones by: ${typeLabels}`, 3000);
    } else if (zones.length > 0) {
      showNotification('info', 'Showing all zones', 3000);
    }
  };

  return (
    <div className="py-6 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Zone Dashboard</h1>
        
        <ZoneFilters onFilterChange={handleFilterChange} />
        
        <ZoneStatistics statistics={statistics} />
        
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden transition-all duration-300 animate-slide-up">
          <div className="p-5">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              My Zones
            </h2>
            
            {filteredZones.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                  <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Radius</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Visits</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 transition-colors duration-300">
                    {filteredZones.map((zone) => (
                      <tr key={zone.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{zone.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize transition-colors duration-300">{zone.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{zone.radius}m</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{zone.visits}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          {new Date(zone.lastVisit).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-lg font-medium">No zones found</p>
                <p className="mt-1">Try adjusting your filters or create a new zone.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneDashboard;
