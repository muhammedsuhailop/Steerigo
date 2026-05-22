import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/shared/components/ui/Logo';
import LogoTextDark from '../../../../../public/SteeriGoHorizontal Dark.png';
import type { FooterProps } from './Footer.types';
import { CiFacebook } from "react-icons/ci";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";

export const Footer: React.FC<FooterProps> = () => {
    const currentYear = new Date().getFullYear();

    const usefulLinks = [
      { name: "About Us", href: "/help" },
      { name: "How it Works", href: "/dashboard" },
      { name: "Contact Us", href: "/help" },
      { name: "Help", href: "/help" },
    ];

    const pages = [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Find Us", href: "#" },
      { name: "FAQ", href: "/help" },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-4">
                            <img src={LogoTextDark} alt="steerigo logo" className="w-55 h-auto" />
                            {/* <Logo size="lg" className="text-white" /> */}
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Your trusted ride-sharing platform connecting passengers with
                            verified drivers for safe, reliable transportation anywhere, anytime.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <CiFacebook /> Facebook
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaXTwitter /> Twitter
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaInstagram /> Instagram
                            </a>
                        </div>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
                        <ul className="space-y-2">
                            {usefulLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pages */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Pages</h3>
                        <ul className="space-y-2">
                            {pages.map((page) => (
                                <li key={page.name}>
                                    <Link
                                        to={page.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {page.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        © {currentYear} SteeriGo. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
