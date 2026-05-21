import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { Link } from "react-router-dom";
import type { User } from "@/features/auth/types";

interface AuthenticatedHeroContentProps {
  user: User;
}

export const AuthenticatedHeroContent: React.FC<
  AuthenticatedHeroContentProps
> = ({ user }) => {
  return (
    <div className="hero-content">
      <div className="mb-1">
        <span className="inline-block px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-full mb-2">
          Welcome back, {user.name}!
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-sm text-gray-900">
        Ready for Your Next <span className="text-blue-600">Ride?</span>
      </h1>

      <p className="mt-6 text-lg sm:text-xl max-w-2xl text-gray-700">
        Find safe, top-rated drivers anywhere in your area. Experience seamless
        booking and trusted rides that get you there safely and comfortably.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-5">
        <Button size="lg" className="text-lg px-8 py-4">
          <Link to="/search">Book a Driver Now</Link>
        </Button>

        <Button size="lg" className="text-lg px-8 py-4">
          <Link to="/search/schedule">Schedule a Driver</Link>
        </Button>
      </div>
    </div>
  );
};
