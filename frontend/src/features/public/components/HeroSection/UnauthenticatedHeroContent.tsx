import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';

export const UnauthenticatedHeroContent: React.FC = () => {
  return (
    <div className="hero-content">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-sm text-gray-900">
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
        <Button
          variant="outline"
          size="lg"
          className="text-lg px-8 py-4"
        >
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
};
