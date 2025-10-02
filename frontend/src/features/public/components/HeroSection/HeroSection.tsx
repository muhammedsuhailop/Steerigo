import React from 'react';
import { useAuth } from '@/features/auth';
import { DriverSearchForm } from '@/features/user/dashbaord/components/DriverSearchForm';
import { AuthenticatedHeroContent } from './AuthenticatedHeroContent';
import { UnauthenticatedHeroContent } from './UnauthenticatedHeroContent';
import type { HeroSectionProps } from './HeroSection.types';
import type { SearchFormData } from '@/features/user/dashbaord/components/DriverSearchForm';
import { URLS } from '@/shared/constants';

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleDriverSearch = async (searchData: SearchFormData) => {
    try {
      console.log('Searching for drivers with:', searchData);
      // TODO: Implement driver search logic
    } catch (error) {
      console.error('Driver search failed:', error);
    }
  };

  if (isLoading) {
    return (
      <section className="relative flex items-center justify-center overflow-hidden rounded-3xl shadow-lg lg:py-10 mx-5 mt-5 min-h-[400px]">
        <div className="absolute inset-0 bg-white/60 rounded-3xl"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

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
          {/* Content - Conditional based on authentication */}
          <div className="text-center lg:text-left">
            {isAuthenticated && user ? (
              <AuthenticatedHeroContent user={user} />
            ) : (
              <UnauthenticatedHeroContent />
            )}
          </div>

          {/* Sub Content - Driver Search Form for authenticated riders */}
          <div>
            {isAuthenticated && user?.role === 'Rider' && (
              <DriverSearchForm 
                onSearch={handleDriverSearch}
                isLoading={false}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
