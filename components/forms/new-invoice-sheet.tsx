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
import { CardContainer } from "../ui/3d-card"

interface InvoiceItem {
  name: string
  rate: number
  quantity: number
  amount: number
}

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
  const [items, setItems] = useState<InvoiceItem[]>([{ name: '', rate: 0, quantity: 0, amount: 0 }])
  const [issueDate, setIssueDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [selectedLogo, setSelectedLogo] = useState<LogoOption | null>(null)
  //
  const [sendInvoiceOpen, setSendInvoiceOpen] = useState(false)
  const [modalContent, setModalContent] = useState<'new' | 'send'>('new')


  const addItem = () => {
    setItems([...items, { name: '', rate: 0, quantity: 0, amount: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === 'rate' || field === 'quantity') {
      newItems[index].amount = newItems[index].rate * newItems[index].quantity
    }
    setItems(newItems)
  }

  const handleCreateInvoice = () => {
    const invoiceData = {
      logo: selectedLogo,
      invoiceNumber,
      issueDate,
      dueDate,
      items,
    }
    setSendInvoiceOpen(true)
    setModalContent('send')
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const tax = subtotal * 0.15
  const discount = subtotal * 0.1
  const total = subtotal + tax - discount

  return (
    <Sheet modal={true} >
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white ">Create Invoice</Button>
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
              <Select onValueChange={(value) => {
                const selected = logoOptions.find(option => option.icon === value)
                setSelectedLogo(selected || null)
              }}
                value={selectedLogo?.icon || ''}>
                <SelectTrigger>
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
                    </div>
                    <div className="flex-1 min-w-[70px]">
                      <Label htmlFor="itemRate">Rate</Label>
                      <Input
                        id="itemRate"
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value))}
                      />
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
                    </div>
                    <div className="flex-1 min-w-[70px]">
                      <Label htmlFor="itemQty">Amount</Label>
                      <Input
                        readOnly
                        value={`$${item.amount.toFixed(2)}`}
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
        <SheetFooter >
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