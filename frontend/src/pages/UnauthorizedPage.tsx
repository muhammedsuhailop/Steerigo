import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-error-100">
            <svg 
              className="h-8 w-8 text-error-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h1>
          
          <p className="mt-2 text-base text-gray-600">
            You don't have permission to access this page.
          </p>
          
          <p className="mt-1 text-sm text-gray-500">
            Please contact your administrator if you believe this is an error.
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

export default UnauthorizedPage;
