import React from 'react';
import { FeatureCard } from './FeatureCard';
import type { FeaturesSectionProps, Feature } from './FeaturesSection.types';
import { GrLocationPin } from "react-icons/gr";
import { GiSteeringWheel } from "react-icons/gi";
import { MdSavings } from "react-icons/md";

const features: Feature[] = [
    {
        id: 'availability',
        icon: GrLocationPin,
        title: 'Availability',
        description: 'Always find the drivers anytime you want to book rides anytime.',
        color: 'blue'
    },
    {
        id: 'comfort',
        icon: GiSteeringWheel,
        title: 'Comfort',
        description: 'Enjoy your trips with our advanced booked driver and services.',
        color: 'green'
    },
    {
        id: 'savings',
        icon: MdSavings,
        title: 'Savings',
        description: 'Experience smart transparent costs cheaper and better savings for you.',
        color: 'purple'
    }
];

export const FeaturesSection: React.FC<FeaturesSectionProps> = () => {
    return (
        <section className="py-10 mx-5 mt-5 rounded-3xl bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <FeatureCard key={feature.id} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};
