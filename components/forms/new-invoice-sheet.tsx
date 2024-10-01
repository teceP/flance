import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus } from 'lucide-react'
import { useState } from 'react'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Card } from "../ui/card"

interface LogoOption {
  name: string
  icon: string
}

const logoOptions: LogoOption[] = [
  { name: 'Apple', icon: '🍎' },
  { name: 'Spotify', icon: '🎵' },
  { name: 'Amazon', icon: '📦' },
  { name: 'Notion', icon: '📝' },
]

// Define the props interface
interface NewInvoiceSheetProps {
  onCreateInvoice: (invoiceData: any) => void;
}

export function NewInvoiceSheet({ onCreateInvoice }: NewInvoiceSheetProps) {
  const [items, setItems] = useState<InvoiceItem[]>([{ name: '', quantity: 0, unitPrice: 0, total: 0 }])
  const [issueDate, setIssueDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [selectedLogo, setSelectedLogo] = useState<LogoOption | null>(null)
  //
  const [sendInvoiceOpen, setSendInvoiceOpen] = useState(false)
  const [modalContent, setModalContent] = useState<'new' | 'send'>('new')
  //
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const [formErrors, setFormErrors] = useState<any>({}); // For tracking form errors

  const addItem = () => {
    setItems([...items, { name: '', quantity: 0, unitPrice: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === 'unitPrice' || field === 'quantity') {
      newItems[index].total = newItems[index].unitPrice * newItems[index].quantity
    }
    setItems(newItems)
    calculateTotals(newItems);
  }

  const calculateTotals = (updatedItems: InvoiceItem[]) => {
    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const newTax = newSubtotal * 0.15;  // 15% tax
    const newTotal = newSubtotal + newTax;

    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax; // Hier keine Abzüge für den Rabatt

    const invoiceData = {
      logo: selectedLogo,
      invoiceNumber,
      issueDate,
      dueDate,
      companyName,
      companyAddress,
      clientName,
      clientAddress,
      items,
      subtotal,
      tax,
      total,
    };

    onCreateInvoice(invoiceData); // Übergebe die Daten an die InvoicePage
    setSendInvoiceOpen(true);
    setModalContent('send');
  }

  const validateForm = () => {
    const errors: any = {};

    if (!invoiceNumber) {
      errors.invoiceNumber = "Invoice number is required.";
    }
    if (!issueDate) {
      errors.issueDate = "Issue date is required.";
    }
    if (!dueDate) {
      errors.dueDate = "Due date is required.";
    }
    if (!companyName) {
      errors.companyName = "Company name is required.";
    }
    if (!companyAddress) {
      errors.companyAddress = "Company address is required.";
    }
    if (!clientName) {
      errors.clientName = "Client name is required.";
    }
    if (!clientAddress) {
      errors.clientAddress = "Client address is required.";
    }
    if (!selectedLogo) {
      errors.logo = "Please select a logo.";
    }
    items.forEach((item, index) => {
      if (!item.name) {
        errors[`itemName_${index}`] = "Item name is required.";
      }
      if (item.quantity <= 0) {
        errors[`itemQuantity_${index}`] = "Quantity must be greater than 0.";
      }
      //if (item.unitPrice <= 0) {
      //  errors[`itemPrice_${index}`] = "Unit price must be greater than 0.";
      // }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Form is valid if no errors
  };

  return (
    <Sheet modal={true} >
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white">Create Invoice</Button>
      </SheetTrigger>
      <SheetContent style={{ maxWidth: '40vw' }} side="right" className="flex flex-col h-scree">
        <SheetHeader >
          <SheetTitle>New Invoice</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {/* Logo and Invoice Number */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="logo">Logo</Label>
              <div className="mt-1">
                <Select onValueChange={(value) => {
                  const selected = logoOptions.find(option => option.icon === value)
                  setSelectedLogo(selected || null)
                }}
                  value={selectedLogo?.icon || ''}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Logo" />
                  </SelectTrigger>
                  <SelectContent className="w-full" position='popper'>
                    {logoOptions.map((option) => (
                      <SelectItem
                        value={option.icon}
                        className='w-full bg-gray-100 hover:bg-white'
                      ><span className="mr-2">{option.icon}</span>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.logo && <p className="text-red-600">{formErrors.logo}</p>}
              </div>
            </div>
            <div className="flex-1">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                placeholder="00-0000"
                className="mt-1 h-10"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
              {formErrors.invoiceNumber && <p className="text-red-600">{formErrors.invoiceNumber}</p>}
            </div>
          </div>

          {/* Issue and Due Date */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                className="mt-1"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
              {formErrors.issueDate && <p className="text-red-600">{formErrors.issueDate}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                className="mt-1"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              {formErrors.dueDate && <p className="text-red-600">{formErrors.dueDate}</p>}

            </div>
          </div>

          {/* Company Name and Address */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Your Company Name"
                className="mt-1 h-10"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              {formErrors.companyName && <p className="text-red-600">{formErrors.companyName}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Input
                id="companyAddress"
                placeholder="Your Company Address"
                className="mt-1 h-10"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
              {formErrors.companyAddress && <p className="text-red-600">{formErrors.companyAddress}</p>}
            </div>
          </div>

          {/* Client Name and Address */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                placeholder="Client's Name"
                className="mt-1 h-10"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              {formErrors.clientName && <p className="text-red-600">{formErrors.clientName}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="clientAddress">Client Address</Label>
              <Input
                id="clientAddress"
                placeholder="Client's Address"
                className="mt-1 h-10"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
              />
              {formErrors.clientAddress && <p className="text-red-600">{formErrors.clientAddress}</p>}
            </div>
          </div>
          {/* Items List */}
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="mt-1 space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex space-x-2 items-center">
                    <div className="flex-1 min-w-[170px]">
                      <Label htmlFor="itemName">Items</Label>
                      <Input
                        id="itemName"
                        placeholder="Item Name"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                      />
                      {formErrors[`itemName_${index}`] && (
                        <p className="text-red-600">{formErrors[`itemName_${index}`]}</p>
                      )}
                    </div>
                    <div className="flex-1 min-w-[70px]">
                      <Label htmlFor="itemRate">Rate</Label>
                      <Input
                        id="itemRate"
                        type="number"
                        placeholder="Rate"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                      />
                      {formErrors[`itemQuantity_${index}`] && (
                        <p className="text-red-600">{formErrors[`itemQuantity_${index}`]}</p>
                      )}
                    </div>
                    <div className="flex-1 min-w-[70px]">
                      <Label htmlFor="itemQty">Qty</Label>
                      <Input
                        id="itemQty"
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      />
                      {formErrors[`itemPrice_${index}`] && (
                        <p className="text-red-600">{formErrors[`itemPrice_${index}`]}</p>
                      )}
                    </div>
                    <div className="flex-1 min-w-[70px]">
                      <Label htmlFor="itemQty">Amount</Label>
                      <Input
                        readOnly
                        value={`$${item.quantity.toFixed(2)}`}
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Button variant="outline" onClick={addItem} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </Card>

          {/* Totals */}
          <div className="flex justify-between items-start space-x-4">
            <div className="flex-1">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                className="mt-1"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>

            <div className="flex-1 space-y-2 text-right">
              <div className="flex justify-end font-bold">
                <span className="text-right mr-4">Subtotal</span>
                <span className="text-right">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-end">
                <span className="text-right mr-4">Tax (15%)</span>
                <span className="text-right">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-end">
                <span className="text-right mr-4">Discount (10%)</span>
                <span className="text-right">${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-end font-bold">
                <span className="text-right mr-4">Total Amount</span>
                <span className="text-right">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter>
          <div className="flex flex-col">

          </div>
          <SheetClose asChild>
            <Button type="submit" className="w-full" onClick={handleCreateInvoice}>
              Confirm
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}