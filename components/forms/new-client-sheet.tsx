'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from 'lucide-react'
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
import { Card } from "@/components/ui/card"

interface NewClientSheetProps {
  onCreateClient: (clientData: any) => void;
}

const industryOptions = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Manufacturing',
  'Other'
]

export function NewClientSheet({ onCreateClient }: NewClientSheetProps) {
  const [clientName, setClientName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [industry, setIndustry] = useState('')
  const [contactPerson, setContactPerson] = useState('')

  const handleCreateClient = () => {
    const clientData = {
      name: clientName,
      email,
      phone,
      address,
      industry,
      contactPerson,
    }
    onCreateClient(clientData)
  }

  return (
    <Sheet modal={true}>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white">Add New Client</Button>
      </SheetTrigger>
      <SheetContent style={{ maxWidth: '40vw' }} side="right" className="flex flex-col h-screen">
        <SheetHeader>
          <SheetTitle>New Client</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-auto space-y-6">
          {/* Client Name and Industry */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                placeholder="Enter client name"
                className="mt-1 h-10"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="industry">Industry</Label>
              <Select onValueChange={setIndustry} value={industry}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {industryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Business St, City, Country"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Primary Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="John Doe"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Additional Fields */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Field
            </Button>
          </Card>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" className="w-full" onClick={handleCreateClient}>
              Create Client
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}