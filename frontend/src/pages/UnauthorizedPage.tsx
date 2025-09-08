import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Logo from "@/assets/images/steerigoLogo.png";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Logo" className="h-10 w-10" />
          <h1 className="text-xl font-semibold text-gray-800">SteeriGo</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center text-center">
          <div className="h-20 w-20 flex items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.66 1.73-2.5L13.73 4.5c-.77-.83-1.96-.83-2.73 0L3.34 16.5c-.77.84.19 2.5 1.73 2.5z"
              />
            </svg>
          </div>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-gray-600 max-w-md">
            Sorry, you don’t have permission to view this page.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            If you think this is a mistake, please contact your administrator.
          </p>

          <div className="mt-8 w-full flex flex-col gap-3">
            <Link to="/">
              <Button variant="primary" size="lg" fullWidth>
                Go to Homepage
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" fullWidth>
                Sign In
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
