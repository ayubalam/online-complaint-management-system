import { useState } from "react";

import Navbar from "../components/layout/Navbar";

import MobileMenu from "../components/layout/MobileMenu";

const HomePage = () => {
  const [isOpen, setIsOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Shared Navbar */}
      <Navbar
        toggleMenu={() =>
          setIsOpen(!isOpen)
        }
      />

      <MobileMenu isOpen={isOpen} />

      {/* Hero Section */}
      <div className="flex items-center justify-center h-[80vh] px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Online Complaint Management
            System
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            A modern role-based complaint
            management platform for users,
            admins, and workers with
            real-time tracking and
            professional dashboard
            management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;