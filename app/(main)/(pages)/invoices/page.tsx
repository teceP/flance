"use client"

import { NewInvoiceSheet } from "@/components/forms/new-invoice-sheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpIcon, ArrowDownIcon, MoreVerticalIcon, SearchIcon } from "lucide-react"
import { useState } from "react"
import { SiSpotify, SiFigma, SiSlack, SiPatreon, SiEvernote, SiMailchimp } from "react-icons/si"  // Importiere die SimpleIcons

const invoiceData = [
    { id: "# 001", company: "Spotify", logo: <SiSpotify className="w-6 h-6 text-green-500" />, dueDate: "12/06/2023", email: "finance@spotify.com", status: "Pending", amount: "$14,000" },
    { id: "# 003", company: "Figma", logo: <SiFigma className="w-6 h-6 text-pink-500" />, dueDate: "18/06/2023", email: "support@figma.com", status: "Pending", amount: "$12,000" },
    { id: "# 004", company: "Slack", logo: <SiSlack className="w-6 h-6 text-purple-500" />, dueDate: "22/06/2023", email: "support@slack.com", status: "Successes", amount: "$14,000" },
    { id: "# 005", company: "Patreon", logo: <SiPatreon className="w-6 h-6 text-orange-500" />, dueDate: "24/06/2023", email: "support@patreon.com", status: "Failed", amount: "$19,000" },
    { id: "# 002", company: "Evernote", logo: <SiEvernote className="w-6 h-6 text-green-600" />, dueDate: "25/06/2023", email: "support@evernote.com", status: "Successes", amount: "$16,000" },
    { id: "# 006", company: "Mailchimp", logo: <SiMailchimp className="w-6 h-6 text-yellow-500" />, dueDate: "28/06/2023", email: "finance@mailchimp.com", status: "Successes", amount: "$25,000" },
    { id: "# 006", company: "Figma", logo: <SiFigma className="w-6 h-6 text-pink-500" />, dueDate: "29/06/2023", email: "support@figma.com", status: "Successes", amount: "$25,000" },
]

export default function InvoiceDashboard() {
    const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false)
    const [sheetOpen, setSheetOpen] = useState(false);

    const handleClose = () => {
        // Logik zum Schließen des Modals
    };

    const handleCreateInvoice = (invoiceData: any) => {
        console.log('Invoice created:', invoiceData);
        // Hier kannst du den Code zur Verarbeitung der Rechnung hinzufügen
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Bill & Invoice</h1>
                <Button onClick={() => setSheetOpen(true)} className="bg-red-500 hover:bg-red-600 text-white">New Invoice</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Paid invoice" value="2420" change={4.9} isPositive={true} color="#10B981" />
                <StatCard title="Pending invoice" value="1140" change={2.3} isPositive={true} color="#F59E0B" />
                <StatCard title="Failed invoice" value="420" change={1.2} isPositive={false} color="#EF4444" />
            </div>

            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Invoices List</h2>
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
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoiceData.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.id}</TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        {invoice.logo}
                                        <span>{invoice.company}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{invoice.dueDate}</TableCell>
                                <TableCell>{invoice.email}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </TableCell>
                                <TableCell>{invoice.amount}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon">
                                        <MoreVerticalIcon className="h-4 w-4" />
                                    </Button>
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

            <NewInvoiceSheet
                sheetOpen={sheetOpen}
                setSheetOpen={setSheetOpen}
                onCreateInvoice={handleCreateInvoice}
            />
        </div>
    )
}

interface StatCardProps {
    title: string;
    value: number | string;
    change: number;
    isPositive: boolean;
    color?: string; // Optionaler color-Parameter
}

function StatCard({ title, value, change, isPositive, color }: Readonly<StatCardProps>) {
    // Generate random data for the graph
    const graphData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 50);

    // Calculate the SVG path for the graph
    const pathData = graphData.reduce((path, point, index) => {
        return path + (index === 0 ? `M ${index * 20},${100 - point} ` : `L ${index * 20},${100 - point} `);
    }, '');

    return (
        <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <Button variant="ghost" size="icon">
                    <MoreVerticalIcon className="h-4 w-4" />
                </Button>
            </div>
            <div className="text-3xl font-bold mb-2">{value}</div>
            <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'} mb-4`}>
                {isPositive ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
                {change}% Last month
            </div>
            <div className="w-full h-16">
                <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                    <path
                        d={pathData}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                    />
                </svg>
            </div>
        </Card>
    )
}

function getStatusColor(status: string) {
    switch (status) {
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800'
        case 'Successes':
            return 'bg-green-100 text-green-800'
        case 'Failed':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}