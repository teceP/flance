'use client'

import React, { useState } from 'react'
import { Document, Page } from '@react-pdf/renderer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import InvoicePDFWrapper from '@/components/pdf/invoice-pdf'

export default function InvoiceView({ invoice }: { invoice: Invoice }) {
    const [numPages, setNumPages] = useState<number>(1)
    const [pageNumber, setPageNumber] = useState(1)
    const [showPaywall, setShowPaywall] = useState(false)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
    }

    const handleDownload = () => {
        // Here you would implement your paywall logic
        setShowPaywall(true)
    }

    const handlePayment = () => {
        // Simulate successful payment
        setShowPaywall(false)
        // Here you would trigger the actual PDF download
        console.log('PDF download started')
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Invoice PDF Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-muted-foreground">
                            Invoice #{invoice.invoiceNumber} for {invoice.clientName}
                        </p>
                        <Button onClick={handleDownload} className="bg-blue-500 hover:bg-blue-600">
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden" style={{ height: '70vh' }}>
                        <Document
                            file={<InvoicePDFWrapper invoice={invoice} />}
                            onLoadSuccess={onDocumentLoadSuccess}
                            options={{ workerSrc: "/pdf.worker.js" }}
                        >
                            <Page pageNumber={pageNumber} width={600} />
                        </Document>
                    </div>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Page {pageNumber} of {numPages}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Premium Feature</DialogTitle>
                        <DialogDescription>
                            Downloading PDFs is a premium feature. Please upgrade your account to access this functionality.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={handlePayment} className="mt-4 bg-green-500 hover:bg-green-600">
                        Upgrade Account
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}