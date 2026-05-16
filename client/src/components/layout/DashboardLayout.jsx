import {
  useState,
} from "react";

import Navbar from "./Navbar";

import MobileMenu from "./MobileMenu";

const DashboardLayout = ({
  children,
}) => {
  const [isOpen, setIsOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <Navbar
        toggleMenu={() =>
          setIsOpen(!isOpen)
        }
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isOpen}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 text-gray-900 dark:text-white transition-colors duration-300">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;