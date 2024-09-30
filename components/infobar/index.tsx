'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Button } from '../ui/button';

const InfoBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

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
      <div className="flex-1 flex justify-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Quick Search"
            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setOpen(!open)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
      <div>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>Invoices</CommandItem>
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
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
              {/* Close icon can go here */}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default InfoBar;
