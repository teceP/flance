'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, User, Settings, CreditCard, LogOut, Users, Heart, Bell } from 'lucide-react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { createBrowserClient } from '@/lib/pocketbase';
import { usePathname, useRouter } from 'next/navigation';
import { Menubar, MenubarContent, MenubarItem, MenubarLabel, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarTrigger } from '../ui/menubar';
import useWindowSize from '@/hooks/use-window-size';

interface InfoBarProps {
  searchBarWidth?: '50' | '60' | '70' | '80' | '90' | '100';
}

const InfoBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pb = createBrowserClient(); // For browser client
  const size = useWindowSize();

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleBackdropClick = (e: { target: any; currentTarget: any; }) => {
    if (e.target === e.currentTarget) {
      handleSearchClose(); // Close when clicking the background
    }
  };

  // Logout function
  const handleLogout = async () => {
    pb.authStore.clear(); // Clear auth state
    router.push('/signin'); // Redirect to login page
  };

  const getEmail = async () => {
    if (pb.authStore.model) {
      return pb.authStore.model.email;
    } else {
      return "no email found";
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b fixed top-0 left-16 right-0 bg-white shadow z-10">
      <div className="flex-grow flex justify-center">
        <div className="relative" style={{ width: '40%' }}>
          <input
            type="text"
            placeholder="Quick Search"
            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
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

      <div>
      <Menubar>
          <MenubarMenu>
            <MenubarTrigger className="font-semibold">Account</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="flex items-center">
                <User className="mr-2 h-4 w-4 text-blue-500" />
                Profile
              </MenubarItem>
              <MenubarItem className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4 text-green-500" />
                Billing
              </MenubarItem>
              <MenubarItem className="flex items-center">
                <Settings className="mr-2 h-4 w-4 text-orange-500" />
                Settings
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-purple-500" />
                Manage Family
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem className="flex items-center">
                <Heart className="mr-2 h-4 w-4 text-red-500" />
                Donate
              </MenubarItem>
              <MenubarItem className="flex items-center" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4 text-gray-500" />
                Log out
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
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
