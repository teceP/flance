"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select'
import { Card } from "@/components/ui/card";
import { useState } from 'react';

interface ProfileSettings {
  username: string;
  email: string;
  companyName: string;
  businessAddress: string;
  taxID: string;
  phoneNumber: string;
  website: string;
  defaultCurrency: string;
  defaultTaxRate: number;
  paymentTerms: string;
  notificationSettings: {
    reminders: boolean;
    paymentConfirm: boolean;
    invoiceViewed: boolean;
  }
}

const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY'];
const paymentTermsOptions = ['Due in 30 days', 'Due in 15 days', 'Due on Receipt'];

export default function AccountPage() {
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    username: "",
    email: "",
    companyName: "",
    businessAddress: "",
    taxID: "",
    phoneNumber: "",
    website: "",
    defaultCurrency: "USD",
    defaultTaxRate: 15,
    paymentTerms: "Due in 30 days",
    notificationSettings: {
      reminders: true,
      paymentConfirm: true,
      invoiceViewed: true,
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ProfileSettings) => {
    setProfileSettings({ ...profileSettings, [field]: e.target.value });
  };

  const handleSelectChange = (field: keyof ProfileSettings, value: string) => {
    setProfileSettings({ ...profileSettings, [field]: value });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Bill & Invoice</h1>
      </div>

      {/* Account Information */}
      <Card className="p-6">
        <h2 className="text-xl font-medium">Account Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profileSettings.username}
              onChange={(e) => handleInputChange(e, 'username')}
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profileSettings.email}
              onChange={(e) => handleInputChange(e, 'email')}
            />
          </div>
        </div>
      </Card>

      {/* Business Information */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-medium">Business Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={profileSettings.companyName}
              onChange={(e) => handleInputChange(e, 'companyName')}
            />
          </div>
          <div>
            <Label htmlFor="businessAddress">Business Address</Label>
            <Input
              id="businessAddress"
              value={profileSettings.businessAddress}
              onChange={(e) => handleInputChange(e, 'businessAddress')}
            />
          </div>
          <div>
            <Label htmlFor="taxID">Tax ID</Label>
            <Input
              id="taxID"
              value={profileSettings.taxID}
              onChange={(e) => handleInputChange(e, 'taxID')}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={profileSettings.phoneNumber}
              onChange={(e) => handleInputChange(e, 'phoneNumber')}
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={profileSettings.website}
              onChange={(e) => handleInputChange(e, 'website')}
            />
          </div>
        </div>
      </Card>

      {/* Invoice Settings */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-medium">Invoice Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Default Currency</Label>
            <Select
              value={profileSettings.defaultCurrency}
              onValueChange={(value) => handleSelectChange('defaultCurrency', value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Default Tax Rate (%)</Label>
            <Input
              type="number"
              value={profileSettings.defaultTaxRate}
              onChange={(e) => handleInputChange(e, 'defaultTaxRate')}
            />
          </div>
          <div>
            <Label>Payment Terms</Label>
            <Select
              value={profileSettings.paymentTerms}
              onValueChange={(value) => handleSelectChange('paymentTerms', value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select Payment Terms" />
              </SelectTrigger>
              <SelectContent>
                {paymentTermsOptions.map((term) => (
                  <SelectItem key={term} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Branding */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-medium">Branding</h2>
        <div>
          <Label>Upload Company Logo</Label>
          <Input type="file" />
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-medium">Notification Settings</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={profileSettings.notificationSettings.reminders}
              onChange={() =>
                setProfileSettings((prev) => ({
                  ...prev,
                  notificationSettings: {
                    ...prev.notificationSettings,
                    reminders: !prev.notificationSettings.reminders,
                  },
                }))
              }
            />
            <Label>Invoice Reminders</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={profileSettings.notificationSettings.paymentConfirm}
              onChange={() =>
                setProfileSettings((prev) => ({
                  ...prev,
                  notificationSettings: {
                    ...prev.notificationSettings,
                    paymentConfirm: !prev.notificationSettings.paymentConfirm,
                  },
                }))
              }
            />
            <Label>Payment Confirmation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={profileSettings.notificationSettings.invoiceViewed}
              onChange={() =>
                setProfileSettings((prev) => ({
                  ...prev,
                  notificationSettings: {
                    ...prev.notificationSettings,
                    invoiceViewed: !prev.notificationSettings.invoiceViewed,
                  },
                }))
              }
            />
            <Label>Invoice Viewed</Label>
          </div>
        </div>
      </Card>

      {/* Save Changes */}
      <Button className="w-full">Save Changes</Button>
    </div>
  );
}
