import React from 'react'
import logoImage from "../assets/width_800.webp";
const Header = () => {
  return (
     <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img
                src={logoImage}
                alt="Digital Buddiess Logo"
                className="h-10 sm:h-12 w-auto object-contain flex-shrink-0"
              />
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Profile
                </h1>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-100 font-medium">
                  Digital Buddiess - User Profile
                </p>
              </div>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 sm:px-6 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white hover:bg-opacity-30 rounded-md transition-colors font-medium shadow-sm flex items-center space-x-2 border border-white border-opacity-30"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-sm sm:text-base text-white">Back to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </header>
  )
}

export default Header
