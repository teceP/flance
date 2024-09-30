"use client"

import { useState } from 'react'
import { Search, Plus, Filter, Download, MoreVertical, MoreVerticalIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export default function ClientsPage() {
    const [clients, setClients] = useState([
        { id: '001', name: 'Spotify', email: 'finance@spotify.com', phone: '+1 234 567 890', projects: 3, totalBilled: '$42,000' },
        { id: '002', name: 'Figma', email: 'support@figma.com', phone: '+1 987 654 321', projects: 2, totalBilled: '$26,000' },
        { id: '003', name: 'Slack', email: 'support@slack.com', phone: '+1 456 789 012', projects: 4, totalBilled: '$53,000' },
    ])

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4 relative">
                <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
                    Clients
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Total Clients</h2>
                    <p className="text-3xl font-bold">24</p>
                    <p className="text-sm text-green-500">↑ 8.1% Last month</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Active Projects</h2>
                    <p className="text-3xl font-bold">18</p>
                    <p className="text-sm text-green-500">↑ 12.3% Last month</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Total Billed</h2>
                    <p className="text-3xl font-bold">$156,000</p>
                    <p className="text-sm text-red-500">↓ 3.2% Last month</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Clients List</h2>
                    <div className="flex items-center space-x-2">
                        <button className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            <Plus size={16} className="mr-1" />
                            Add Client
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <Filter size={20} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <Download size={20} />
                        </button>
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
                                        <span>{client.name}</span>
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
                                    <Button variant="ghost" size="icon">
                                        <MoreVerticalIcon className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}