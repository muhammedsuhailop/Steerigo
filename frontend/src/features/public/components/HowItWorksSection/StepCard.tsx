import React from 'react';
import type { StepCardProps } from './HowItWorksSection.types';

export const StepCard: React.FC<StepCardProps> = ({ step }) => {
    const gradients = [
        "bg-gradient-to-br from-gray-200 to-gray-500",
        "bg-gradient-to-br from-gray-300 to-gray-600",
        "bg-gradient-to-br from-gray-400 to-gray-700",
        "bg-gradient-to-br from-gray-500 to-gray-800",
        "bg-gradient-to-br from-gray-600 to-gray-900",
    ];

    const gradient =
        gradients[(step.number - 1) % gradients.length] ||
        gradients[0];
    return (
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
                <div className={`flex items-center justify-center w-10 h-10 ${gradient} text-white rounded-full font-semibold`}>
                    <step.icon />
                </div>
            </div>

            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                </h3>
                <p className="text-gray-600">
                    {step.description}
                </p>
            </div>
        </div>
    );
};
