import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import type { HeroSectionProps } from './HeroSection.types';
import { URLS } from '@/shared/constants';

export const HeroSection: React.FC<HeroSectionProps> = () => {
    return (
        <section
            className="relative flex items-center overflow-hidden rounded-3xl shadow-lg lg:py-10 mx-5 mt-5"
            style={{
                backgroundImage: `url('${URLS.PUBLIC.HERO_BG}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Light overlay */}
            <div className="absolute inset-0 bg-white/60 rounded-3xl"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-15 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="text-center lg:text-left text-gray-900">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-sm">
                            Driving Dreams,{' '}
                            <span className="text-blue-600">Riding Easy</span>
                        </h1>

                        <p className="mt-6 text-lg sm:text-xl max-w-2xl text-gray-700">
                            Find safe, top-rated drivers anywhere in your area.
                            Experience seamless booking and trusted rides that get you
                            there safely and comfortably.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button
                                size="lg"
                                className="text-lg px-8 py-4"
                            >
                                <Link to="/signup">Signup Now</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Sub Content */}
                    <div>

                    </div>
                </div>
            </div>
        </section>
    );
};
