"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { LayoutGrid, Users, FileText, Clock, BarChart3, User, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import path from 'path'

type Props = {}

const navItems = [
  { icon: LayoutGrid, href: '/dashboard', label: 'Dashboard' },
  { icon: FileText, href: '/invoices', label: 'Invoices' },
  { icon: Users, href: '/clients', label: 'Clients' },
  { icon: Clock, href: '/history', label: 'History' },
  { icon: BarChart3, href: '/analytics', label: 'Analytics' },
]

const MenuOptions = (props: Props) => {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-screen w-16 bg-black text-white fixed">
      <div className="flex items-center justify-center h-16 bg-[#FF4400]">
        <span className="text-2xl font-bold">#</span>
      </div>
      <nav className="flex-1">
        <ul className="flex flex-col items-center py-4 space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.label} className="relative">
                <Link href={item.href}>
                  <div
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
        <Link href="/account">
          <div
            onMouseEnter={() => {
              console.log(pathname)
              setHoveredItem("Account")
            }}
            onMouseLeave={() => setHoveredItem(null)}
            className={`p-2 rounded-md hover:bg-gray-800 ${pathname === "/account" ? 'bg-gray-800' : ''}`}>
            <User className="w-6 h-6" />
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: hoveredItem === "Account" ? 1 : 0,
                x: hoveredItem === "Account" ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
              className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded text-sm whitespace-nowrap"
            >
              Account
            </motion.div>
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-center h-16">
        <Link href="/settings">
          <div
            onMouseEnter={() => {
              console.log(pathname)
              setHoveredItem("Settings")
            }}
            onMouseLeave={() => setHoveredItem(null)}
            className={`p-2 rounded-md hover:bg-gray-800 ${pathname === "/settings" ? 'bg-gray-800' : ''}`}>
            <Settings className="w-6 h-6" />
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: hoveredItem === "Settings" ? 1 : 0,
                x: hoveredItem === "Settings" ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
              className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded text-sm whitespace-nowrap"
            >
              Profile
            </motion.div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default MenuOptions;
