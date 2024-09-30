'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { menuOptions } from '@/lib/constants'
import clsx from 'clsx'
import { Separator } from '@/components/ui/separator'
import { Database, GitBranch, LucideMousePointerClick } from 'lucide-react'
import { ModeToggle } from '@/components/global/mode-toggle'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { User, LayoutGrid, Users, FileText, Clock, BarChart3, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

type Props = {}

const navItems = [
    { icon: LayoutGrid, href: '/', label: '' },
    { icon: Users, href: '/clients', label: 'Clients' },
    { icon: FileText, href: '/invoices', label: 'Invoices' },
    { icon: Clock, href: '/history', label: 'History' },
    { icon: BarChart3, href: '/analytics', label: 'Analytics' },
  ]

const MenuOptions = (props: Props) => {
    const pathname = usePathname()
    const iconSize = 20; // Width of the icon in pixels
    const padding = 16; // Total padding (8px on each side)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    
    return (
        <div className="flex flex-col h-screen w-16 bg-black text-white">
          <div className="flex items-center justify-center h-16 bg-[#FF4400]">
            <span className="text-2xl font-bold">#</span>
          </div>
          <nav className="flex-1">
            <ul className="flex flex-col items-center py-4 space-y-4">
              {navItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <li key={item.label}>
                    <Link href={item.href}>
                      <div 
                      key={item.label}
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`p-2 rounded-md hover:bg-gray-800 ${pathname === item.href ? 'bg-gray-800' : ''}`}>
                        <Icon className="w-6 h-6" />
                        <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: hoveredItem === item.label ? 1 : 0,
                          x: hoveredItem === item.label ? 0 : -10,
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded text-sm whitespace-nowrap"
                      >
                        {item.label}
                      </motion.div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="flex items-center justify-center h-16">
            <Link href="/settings">
              <div className="p-2 rounded-md hover:bg-gray-800">
                <User className="w-6 h-6" />
              </div>
            </Link>
          </div>          
          <div className="flex items-center justify-center h-16">
            <Link href="/settings">
              <div className="p-2 rounded-md hover:bg-gray-800">
                <Settings className="w-6 h-6" />
              </div>
            </Link>
          </div>
        </div>
    );
}

export default MenuOptions;
