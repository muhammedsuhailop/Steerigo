import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { loginUser, clearError } from '@/redux/slices/authSlice';
import type { LoginCredentials } from '@/types';
import { validateEmail, sanitizeInput } from '@/utils';
import { ROLE_ROUTES } from '@/constants';
import steerigoLogoBanner from '@/assets/images/SteeriGoHorizontal.png';
import { log } from '@/utils/logger';
// import Button from '@/components/common/Button';
// import Input from '@/components/forms/Input';

interface LoginFormData {
  readonly email: string;
  readonly password: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error, isAuthenticated, role } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [rememberMe, setRememberMe] = useState(false);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated && role) {
      const from = (location.state as { from?: { pathname: string } })?.from
        ?.pathname;
      const defaultRoute = ROLE_ROUTES[role];
      log.info('Login success, redirecting', { role, from });
      navigate(from || defaultRoute, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    log.debug('Validation result', errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value =
        field === 'email'
          ? sanitizeInput(e.target.value.toLowerCase())
          : e.target.value;

      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field error when user starts typing
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      // Clear global error
      if (error) {
        dispatch(clearError());
      }
    };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const credentials: LoginCredentials = {
      email: formData.email.trim(),
      password: formData.password,
    };

    log.info('Login attempt', { email: formData.email });
    try {
      await dispatch(loginUser(credentials));
    } catch (err: unknown) {
      if (err instanceof Error) log.warn('Login failed', err.message);
      else log.warn('Login failed');
    }
  };

  const handleGoogleSignIn = (): void => {
    // Implement Google Sign-In logic
    console.log('Google Sign-In clicked');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-sm">
        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex flex-col items-center justify-center mb-8">
                <img
                  src={steerigoLogoBanner}
                  alt="SteerGo Logo"
                  className="mb-2 max-h-16 w-auto"
                />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Login</h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="Enter your email"
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.email
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                autoComplete="email"
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="Enter your password"
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.password
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                autoComplete="current-password"
              />
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Forgot Password
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 bg-black text-white text-sm font-medium rounded-md transition-colors ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Login'
              )}
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full py-2.5 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-md border border-gray-300 transition-colors ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Signing with Google
              </div>
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an Account?{' '}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Click here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
