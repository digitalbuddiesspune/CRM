import React from "react";
import logoImage from "../assets/width_800.webp";

const Footer = () => {
  return (
    <footer className=" bg-gradient-to-r bg-gray-800 via-slate-600 to-gray-800 mt-auto">
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <img
              src={logoImage}
              alt="Digital Buddiess Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="text-center md:text-right">
            <p className="text-white text-sm">
              © {new Date().getFullYear()} Digital Buddiess. All rights
              reserved.
            </p>
            <p className="text-blue-100 text-xs mt-1">
              Powered by Digital Marketing Solutions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
