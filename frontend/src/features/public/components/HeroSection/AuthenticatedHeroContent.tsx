import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Link } from 'react-router-dom';
import type { User } from '@/features/auth/types';

interface AuthenticatedHeroContentProps {
  user: User;
}

export const AuthenticatedHeroContent: React.FC<AuthenticatedHeroContentProps> = ({ user }) => {
  return (
    <div className="hero-content">
      <div className="mb-1">
        <span className="inline-block px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-full mb-2">
          Welcome back, {user.name}! 
        </span>
      </div>
      
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-sm text-gray-900">
        Ready for Your Next{' '}
        <span className="text-blue-600">Ride?</span>
      </h1>

      <p className="mt-6 text-lg sm:text-xl max-w-2xl text-gray-700">
        Find safe, top-rated drivers anywhere in your area.
        Experience seamless booking and trusted rides that get you
        there safely and comfortably.
      </p>

      <div className="grid grid-cols-3 gap-6 mt-8 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">2.5k+</div>
          <div className="text-sm text-gray-600">Available Drivers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">4.9★</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">24/7</div>
          <div className="text-sm text-gray-600">Support</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="text-lg px-8 py-4">
          <Link to="/user/dashboard">View My Rides</Link>
        </Button>
      </div>
    </div>
  );
};
