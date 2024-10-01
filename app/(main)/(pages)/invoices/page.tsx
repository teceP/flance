"use client"

import { NewInvoiceSheet } from "@/components/forms/new-invoice-sheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/global/stat-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useModal } from "@/providers/modal-provider"
import { SearchIcon } from "lucide-react"
import { useState } from "react"
import { SiSpotify, SiFigma, SiSlack, SiPatreon, SiEvernote, SiMailchimp } from "react-icons/si"  // Importiere die SimpleIcons
import { StaticDropdownMenu } from "@/components/global/static-dropdown-menu"
import PocketBase from 'pocketbase';
import NInvoiceForm from "@/components/forms/n-invoice-form"

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
    const {setOpen, setClose} = useModal();

    const handleClose = () => {
        // Logik zum Schließen des Modals
    };

    const handleCreateInvoice = async (invoiceData: any) => {

        try{
            const pb = new PocketBase("http://127.0.0.1:8090")
            
            const response = await pb.collection('invoices').create(invoiceData);
            console.log(response)

        }catch (ex) {
            console.log(ex)
        }
        console.log('Invoice created:', invoiceData);

        setClose();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Bill & Invoice</h1>
                <NInvoiceForm />
                <NewInvoiceSheet onCreateInvoice={handleCreateInvoice} />
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