import React from 'react';
import { StatCard } from './StatCard';
import type { StatsSectionProps, Stat } from './StatsSection.types';
import { URLS } from '@/shared/constants';
import { MdPeopleAlt } from "react-icons/md";
import { ImHappy } from "react-icons/im";
import { FaCarRear } from "react-icons/fa6";
import { IoIosTimer } from "react-icons/io";

const stats: Stat[] = [
    {
        id: 'drivers',
        number: '540+',
        label: 'Active Drivers',
        icon: MdPeopleAlt
    },
    {
        id: 'users',
        number: '20k+',
        label: 'Happy Users',
        icon: ImHappy
    },
    {
        id: 'rides',
        number: '3500+',
        label: 'Completed Rides',
        icon: FaCarRear
    },
    {
        id: 'hours',
        number: '20m+',
        label: 'Hours Saved',
        icon: IoIosTimer
    }
];

export const StatsSection: React.FC<StatsSectionProps> = () => {
    return (
        <section
            className="relative py-20 overflow-hidden rounded-3xl shadow-lg lg:py-10 mx-5 my-5"
            style={{
                backgroundImage: `url('${URLS.PUBLIC.BG2}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gray-50/80"></div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        SteeriGo At A Glance
                    </h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                        Every ride on SteeriGo is built on reliability, trust, and seamless service.
                        Join a growing community where your journey always comes first—where finding the
                        right driver is just a click away.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <StatCard key={stat.id} stat={stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};
