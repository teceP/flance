"use client"

import { useState } from 'react'
import { Search, Plus, Filter, Download, MoreVertical, MoreVerticalIcon, SearchIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { StatCard } from '@/components/global/stat-card'
import { StaticDropdownMenu } from '@/components/global/static-dropdown-menu'
import { NewInvoiceSheet } from '@/components/forms/new-invoice-sheet'
import { NewClientSheet } from '@/components/forms/new-client-sheet'

export default function ClientsPage() {
    const [clients, setClients] = useState([
        { id: '001', name: 'Spotify', email: 'finance@spotify.com', phone: '+1 234 567 890', projects: 3, totalBilled: '$42,000' },
        { id: '002', name: 'Figma', email: 'support@figma.com', phone: '+1 987 654 321', projects: 2, totalBilled: '$26,000' },
        { id: '003', name: 'Slack', email: 'support@slack.com', phone: '+1 456 789 012', projects: 4, totalBilled: '$53,000' },
    ])

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">
                    Clients
                </h1>
                <NewClientSheet onCreateClient={() =>{}} />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Clients" value="24" change={8.1} isPositive={true} color="#10B981" />
                <StatCard title="Active Projects" value="18" change={12.3} isPositive={true} color="#F59E0B" />
                <StatCard title="Total Billed" value="$156,000" change={3.2} isPositive={false} color="#EF4444" />
            </div>

            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Clients List</h2>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input className="pl-10" placeholder="Search" />
                        </div>
                        <Button variant="outline">Filters</Button>
                        <Button variant="outline">Export</Button>
                    </div>
                </div>


                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client ID</TableHead>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Projects</TableHead>
                            <TableHead>Total Billed</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.id}</TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        {client.name}
                                    </div>
                                </TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs `}>
                                        {client.phone}
                                    </span>
                                </TableCell>
                                <TableCell>{client.projects}</TableCell>
                                <TableCell>{client.totalBilled}</TableCell>
                                <TableCell>
                                    <StaticDropdownMenu/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-gray-500">Page 1 of 10</span>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm">Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            </Card>

        </div>
    )
}