"use client"

import React, { useState } from 'react';
import { CreditCard, Heart, LogOut, Menu, Search, LayoutGrid, Users, FileText, Clock, BarChart3, User, Settings, FilePlus2, MoreVertical, HelpingHand } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from 'next/navigation'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from '../ui/menubar';
import { createBrowserClient } from '@/lib/pocketbase';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface LayoutProps {
    children: React.ReactNode
}

const navItems = [
    { icon: LayoutGrid, href: '/dashboard', label: 'Dashboard', headline: "Dashboard" },
    { icon: FilePlus2, href: '/create', label: 'Create', headline: 'Create an Invoice' },
    { icon: FileText, href: '/invoices', label: 'Invoices', headline: 'Invoices' },
    { icon: Users, href: '/clients', label: 'Clients', headline: 'Clients' },
    { icon: Clock, href: '/history', label: 'History', headline: 'History' },
    { icon: BarChart3, href: '/analytics', label: 'Analytics', headline: 'Analytics' },
]

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname()
    const headline = 'Billify. | ' + navItems.filter((e) => e.href === pathname)[0].headline
    const router = useRouter()
    const pb = createBrowserClient();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        pb.authStore.clear();
        router.push('/signin');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-48 bg-white shadow-md flex flex-col h-screen">
                <div className="p-4 border-b">
                    <Logo />
                </div>
                <nav className="flex-grow flex flex-col justify-between py-4 px-2">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} active={pathname === item.href} />
                        ))}
                    </div>
                    <div className='mt-auto'>
                        <div className="border-t pt-4 mb-2">
                            <NavItem href="/account" icon={User} label="Account" active={pathname === '/account'} />
                            <NavItem href="/settings" icon={Settings} label="Settings" active={pathname === '/settings'} />
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm z-10">
                    <title>{headline}</title>

                    <div className="px-4">
                        <div className="flex h-16">

                            {/* Left side: Page title
                            <div className="flex items-center space-x-4">
                                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                                    {headline}
                                </h2>
                            </div> */}

                            <div className="w-48">
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <div className=" " style={{ transform: 'translateX(-50px)' }}> {/* Shifted left using translateX */}
                                    <label htmlFor="search" className="sr-only">Search</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            type="search"
                                            id="search"
                                            className="block pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Search"
                                            onClick={() => setOpen(true)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className=" flex justify-end">
                                <Menubar>
                                    <MenubarMenu>
                                        <MenubarTrigger className=''>
                                            {/* <span>Menu</span>*/}
                                            <Heart className="h-5 w-5 text-red-500" />
                                            {/*<MoreVertical className="h-5 w-5" /> */}
                                        </MenubarTrigger>
                                        <MenubarContent>
                                            <MenubarItem className="flex items-center">
                                                <CreditCard className="mr-2 h-4 w-4 text-green-500" />
                                                <span>Billing</span>
                                            </MenubarItem>
                                            <MenubarItem className="flex items-center">
                                                <Heart className="mr-2 h-4 w-4 text-red-500" />
                                                <span>Donate</span>
                                            </MenubarItem>
                                            <MenubarItem className="flex items-center">
                                                <HelpingHand className="mr-2 h-4 w-4 text-purple-500" />
                                                Help & Support
                                            </MenubarItem>
                                            <MenubarItem className="flex items-center" onClick={handleLogout}>
                                                <LogOut className="mr-2 h-4 w-4 text-gray-500" />
                                                <span>Log out</span>
                                            </MenubarItem>
                                        </MenubarContent>
                                    </MenubarMenu>
                                </Menubar>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>

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
    )
}

function Logo() {
    return (
        <div className="flex items-center space-x-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7.8C4 6.11984 4 5.27976 4.32698 4.63803C4.6146 4.07354 5.07354 3.6146 5.63803 3.32698C6.27976 3 7.11984 3 8.8 3H15.2C16.8802 3 17.7202 3 18.362 3.32698C18.9265 3.6146 19.3854 4.07354 19.673 4.63803C20 5.27976 20 6.11984 20 7.8V16.2C20 17.8802 20 18.7202 19.673 19.362C19.3854 19.9265 18.9265 20.3854 18.362 20.673C17.7202 21 16.8802 21 15.2 21H8.8C7.11984 21 6.27976 21 5.63803 20.673C5.07354 20.3854 4.6146 19.9265 4.32698 19.362C4 18.7202 4 17.8802 4 16.2V7.8Z" stroke="#2563EB" strokeWidth="2" />
                <path d="M15 8H9" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                <path d="M13 12H9" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                <path d="M11 16H9" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-bold text-gray-800">Billify.</span>
        </div>
    )
}

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    href: string;
    active?: boolean;
}

function NavItem({ icon: Icon, label, href, active = false }: NavItemProps) {
    return (
        <a
            href={href}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${active ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
        >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
        </a>
    )
}