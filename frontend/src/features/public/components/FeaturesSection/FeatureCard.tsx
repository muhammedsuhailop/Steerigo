import React from 'react';
import type { FeatureCardProps } from './FeaturesSection.types';

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600 border-blue-200',
        green: 'bg-green-100 text-green-600 border-green-200',
        purple: 'bg-purple-100 text-purple-600 border-purple-200',
    };

    return (
        <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${colorClasses[feature.color]}`}>
                <span className="text-2xl"><feature.icon /></span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
            </h3>

            <p className="text-gray-600 leading-relaxed">
                {feature.description}
            </p>
        </div>
    );
};
