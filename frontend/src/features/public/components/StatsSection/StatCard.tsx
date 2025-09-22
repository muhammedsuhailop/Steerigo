import React from 'react';
import type { StatCardProps } from './StatsSection.types';

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-2xl text-white"><stat.icon /></span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex-1">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        {stat.number}
                    </div>
                    <div className="text-gray-600 text-sm font-medium">
                        {stat.label}
                    </div>
                </div>
            </div>
        </div>
    );
};
