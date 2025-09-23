import React from 'react';
import { StepCard } from './StepCard';
import type { HowItWorksSectionProps, Step } from './HowItWorksSection.types';
import { URLS } from '@/shared/constants'
import { GrLocationPin } from "react-icons/gr";
import { LiaSearchLocationSolid } from "react-icons/lia";
import { TiTick } from "react-icons/ti";
import { PiTarget } from "react-icons/pi";

const steps: Step[] = [
    {
        number: 1,
        title: 'Set Pickup & Select Ride',
        description: 'Choose your pickup location and desired ride type for your journey.',
        icon: GrLocationPin
    },
    {
        number: 2,
        title: 'Find & Confirm Driver',
        description: 'Get matched with qualified drivers and confirm your driver.',
        icon: LiaSearchLocationSolid
    },
    {
        number: 3,
        title: 'Verify & Start Ride',
        description: 'Verify the vehicle code with your driver to securely begin your trip.',
        icon: TiTick
    },
    {
        number: 4,
        title: 'Complete & Confirm Ride',
        description: 'Enjoy your journey and confirm completion when you reach your destination.',
        icon: PiTarget
    }
];

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        How to Get Your Driver Quickly
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Steps */}
                    <div className="space-y-6">
                        {steps.map((step) => (
                            <StepCard key={step.number} step={step} />
                        ))}
                    </div>

                    {/* Map */}
                    <div className="hidden lg:flex justify-center">
                        <img
                            src={URLS.PUBLIC.MAP_CAR_IMG}
                            alt="map"
                            className=" max-w-[200px] xl:max-w-[240px] 2xl:max-w-[280px] h-auto object-contain rounded-lg shadow-md "
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

