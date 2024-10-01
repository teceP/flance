import InvoiceView from '@/components/pdf/invoice-view'

export default function InvoicePage() {
  const invoiceData = {
    invoiceNumber: 'INV-001',
    date: '2023-06-15',
    dueDate: '2023-07-15',
    companyName: 'Your Company Name',
    companyAddress: '123 Business St, City, Country',
    clientName: 'Client Company Name',
    clientAddress: '456 Client St, City, Country',
    items: [
      { name: 'Item 1', quantity: 2, unitPrice: 100, total: 200 },
      { name: 'Item 2', quantity: 1, unitPrice: 50, total: 50 },
      // Add as many items as needed
    ],
    subtotal: 250,
    tax: 25,
    total: 275,
  }

  return <InvoiceView invoice={invoiceData} />
}