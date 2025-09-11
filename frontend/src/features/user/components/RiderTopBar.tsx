import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logoTitle from "@/assets/images/SteeriGoHorizontal.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Rides", to: "/rides" },
  { label: "Notifications", to: "/notifications" },
  { label: "Profile", to: "/profile" },
];

const TopBar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((open) => !open);
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center">
          <img
            src={logoTitle}
            alt="SteeriGo Logo"
            className="h-10 w-auto object-contain ml-5"
          />
        </NavLink>

        {/* Desktop  */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-black hover:text-gray-700 font-medium ${
                  isActive ? "font-extrabold" : "font-normal"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile menu toggle button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-md text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-lg absolute w-full left-0 top-16 border-t border-gray-200">
          <ul className="flex flex-col space-y-2 px-6 py-4">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-black hover:text-gray-700 font-medium ${
                      isActive ? "font-extrabold" : ""
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default TopBar;
