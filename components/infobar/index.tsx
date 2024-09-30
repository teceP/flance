'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

const InfoBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleBackdropClick = (e: { target: any; currentTarget: any; }) => {
    if (e.target === e.currentTarget) {
      handleSearchClose(); // Close when clicking the background
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Quick Search"
          className="w-64"
          onClick={handleSearchClick}
        />
      </div>

      {isSearchOpen && (
        <div
          onClick={handleBackdropClick}
          className={`fixed inset-0 z-50 flex items-center justify-center 
            transition-all duration-500 ease-in-out 
            ${isSearchOpen ? 'opacity-100 backdrop-blur-lg' : 'opacity-0 backdrop-blur-none'}
            bg-black bg-opacity-20`}
        >
          <div className="relative bg-white p-6 rounded-md shadow-lg max-w-lg w-full transition-all duration-500 ease-out">
            {/* Expanded Search Input */}
            <Input
              type="search"
              placeholder="Search..."
              className="w-full text-lg p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 text-gray-600 focus:outline-none"
              onClick={handleSearchClose}
            >
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <span>Credits /</span>
        <button className="p-2">
          {/* Icons or additional elements */}
        </button>
      </div>
    </header>
  );
};

export default InfoBar;