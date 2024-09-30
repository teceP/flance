'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
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

type Props = {}

const navItems = [
    { icon: LayoutGrid, href: '/' },
    { icon: Users, href: '/users' },
    { icon: FileText, href: '/invoices' },
    { icon: Clock, href: '/history' },
    { icon: BarChart3, href: '/analytics' },
  ]

const MenuOptions = (props: Props) => {
    const pathname = usePathname()
    const iconSize = 20; // Width of the icon in pixels
    const padding = 16; // Total padding (8px on each side)

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
                  <li key={index}>
                    <Link href={item.href}>
                      <div className={`p-2 rounded-md hover:bg-gray-800 ${pathname === item.href ? 'bg-gray-800' : ''}`}>
                        <Icon className="w-6 h-6" />
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
