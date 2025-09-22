import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@/shared/components/ui/Button';
import { logout } from '@/features/auth/store/authSlice';
import type { MobileMenuProps } from './Header.types';

export const MobileMenu: React.FC<MobileMenuProps> = ({
    isOpen,
    onClose,
    isAuthenticated,
    user
}) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [showNavigateLinks, setShowNavigateLinks] = useState(false);

    if (!isOpen) return null;

    const isActive = (href: string) => location.pathname === href;

    const handleLogout = () => {
        dispatch(logout());
        onClose();
    };

    const navigateLinks = [
        { name: 'Contact Us', href: '/contact', icon: '📞' },
        { name: 'About Us', href: '/about', icon: 'ℹ️' },
        { name: 'Register as Driver', href: '/driver/register', icon: '🚗' },
        { name: 'My Rides', href: '/rides', icon: '🛣️' },
    ];

    return (
        <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 shadow-lg max-h-96 overflow-y-auto">
                {isAuthenticated ? (
                    // Authenticated user mobile menu
                    <>
                        {/* User Info */}
                        {user && (
                            <div className="px-3 py-3 border-b border-gray-200 mb-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : '👤'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {user.firstName || 'User'} {user.lastName || ''}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main Navigation */}
                        <Link
                            to="/"
                            className={`block px-3 py-2 text-base font-medium ${isActive('/')
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-900 hover:bg-gray-50'
                                }`}
                            onClick={onClose}
                        >
                            🏠 Home
                        </Link>

                        <Link
                            to="/rides"
                            className={`block px-3 py-2 text-base font-medium ${isActive('/rides')
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-900 hover:bg-gray-50'
                                }`}
                            onClick={onClose}
                        >
                            🛣️ My Rides
                        </Link>

                        {/* Navigate Section */}
                        <div className="border-t border-gray-200 mt-2 pt-2">
                            <button
                                className="w-full text-left px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 flex items-center justify-between"
                                onClick={() => setShowNavigateLinks(!showNavigateLinks)}
                            >
                                <span>🧭 Navigate</span>
                                <span className={`transition-transform duration-200 ${showNavigateLinks ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {showNavigateLinks && (
                                <div className="ml-4 space-y-1">
                                    {navigateLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.href}
                                            className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            onClick={onClose}
                                        >
                                            <span className="mr-2">{link.icon}</span>
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            to="/help"
                            className={`block px-3 py-2 text-base font-medium ${isActive('/help')
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-900 hover:bg-gray-50'
                                }`}
                            onClick={onClose}
                        >
                            ❓ Help
                        </Link>

                        {/* Profile Section */}
                        <div className="border-t border-gray-200 mt-2 pt-2">
                            <Link
                                to="/profile"
                                className={`block px-3 py-2 text-base font-medium ${isActive('/profile')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                                onClick={onClose}
                            >
                                👤 My Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left block px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                            >
                                🚪 Logout
                            </button>
                        </div>
                    </>
                ) : (
                    // Non-authenticated user mobile menu (same as before)
                    <>
                        <Link
                            to="/"
                            className={`block px-3 py-2 text-base font-medium ${isActive('/')
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-900 hover:bg-gray-50'
                                }`}
                            onClick={onClose}
                        >
                            Home
                        </Link>

                        <Link
                            to="/about"
                            className={`block px-3 py-2 text-base font-medium ${isActive('/about')
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-900 hover:bg-gray-50'
                                }`}
                            onClick={onClose}
                        >
                            About
                        </Link>

                        <Link
                            to="/how-it-works"
                            className={`block px-3 py-2 text-base font-medium ${isActive('/how-it-works')
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-900 hover:bg-gray-50'
                                }`}
                            onClick={onClose}
                        >
                            How It Works
                        </Link>

                        <Link
                            to="/contact"
                            className={`block px-3 py-2 text-base font-medium ${isActive('/contact')
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-900 hover:bg-gray-50'
                                }`}
                            onClick={onClose}
                        >
                            Contact
                        </Link>

                        {/* Action Buttons */}
                        <div className="px-3 py-4 border-t border-gray-200 mt-4 space-y-2">
                            <Button fullWidth variant="ghost" size="sm">
                                <Link to="/login" onClick={onClose}>
                                    Login
                                </Link>
                            </Button>

                            <Button fullWidth variant="primary" size="sm">
                                <Link to="/signup" onClick={onClose}>
                                    Sign Up
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
