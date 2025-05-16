import React from 'react';

interface ZoneStatistic {
  label: string;
  value: number | string;
  icon: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

interface ZoneStatisticsProps {
  statistics: ZoneStatistic[];
}

const ZoneStatistics: React.FC<ZoneStatisticsProps> = ({ statistics }) => {
  return (
    <div className="mb-8 max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md transition-all duration-300">
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Zone Statistics
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
            {statistics.map((stat, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">{stat.label}</p>
                    <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">{stat.value}</p>
                    
                    {stat.change && (
                      <div className={`mt-1 flex items-center text-xs font-medium ${
                        stat.change.isPositive 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      } transition-colors duration-300`}>
                        <span>
                          {stat.change.isPositive ? (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </span>
                        {stat.change.value}%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 bg-primary-light/20 dark:bg-primary-dark/20 rounded-md transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-dark dark:text-primary-light transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneStatistics;
