import React, { useState, useEffect } from "react";
import axios from "axios";
import logoImage from "../assets/width_800.webp";

const Profile = ({ user, onLogout, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-600">No user data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img
                src={logoImage}
                alt="Digital Buddiess Logo"
                className="h-10 sm:h-12 w-auto object-contain flex-shrink-0"
              />
             
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 sm:px-6 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white hover:bg-opacity-30 rounded-md transition-colors font-medium shadow-sm flex items-center space-x-2 border border-white border-opacity-30"
              >
                <svg
                  className="w-5 h-5"
                  fill="black"
                  color="black"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-sm sm:text-base text-black">Back to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
            Profile updated successfully!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-[#2b2b2b] bg-opacity-20 rounded-full flex items-center justify-center shadow-md">
                <span className="text-4xl font-bold text-[#f0f0f0]">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              
              {/* User Info */}
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                  {user.username || "User"}
                </h2>
                <p className="text-blue-100 text-sm sm:text-base mb-1">
                  {user.email || "No email"}
                </p>
                <span className="inline-block px-3 py-1 bg-[#2b2b2b] bg-opacity-20 rounded-full text-xs sm:text-sm font-medium mt-2 text-[#f0f0f0]">
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "Admin"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* User Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                      {user.username || "N/A"}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                      {user.email || "N/A"}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "N/A"}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-mono">
                      {user.id || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Actions
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={onLogout}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="text-white">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

