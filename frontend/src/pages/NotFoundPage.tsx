import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100">
            <span className="text-2xl font-bold text-gray-600">404</span>
          </div>
          
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page Not Found
          </h1>
          
          <p className="mt-2 text-base text-gray-600">
            The page you're looking for doesn't exist.
          </p>
          
          <p className="mt-1 text-sm text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="mt-8 space-y-3">
            <Link to="/">
              <Button variant="primary" size="lg" fullWidth>
                Go Home
              </Button>
            </Link>
            
            <Link to="/login">
              <Button variant="outline" size="lg" fullWidth>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
