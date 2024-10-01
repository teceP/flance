interface InvoiceItem {
    name: string
    quantity: number
    unitPrice: number
    total: number
}
  
interface Invoice {
    invoiceNumber: string
    date: string
    dueDate: string
    companyName: string
    companyAddress: string
    clientName: string
    clientAddress: string
    items: InvoiceItem[]
    subtotal: number
    tax: number
    total: number
}