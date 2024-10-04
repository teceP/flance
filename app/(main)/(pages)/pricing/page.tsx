"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)

  const plans = [
    {
      name: "Free Trial",
      price: "0€",
      duration: "No time limit",
      features: ["Create 2 free invoices", "Basic invoice templates", "Email support"],
      cta: "Start Free Trial",
    },
    {
      name: "Monthly",
      price: "10€",
      duration: "per month",
      features: ["Unlimited invoices", "Advanced templates", "Priority support", "Invoice tracking"],
      cta: "Choose Monthly",
    },
    {
      name: "Yearly",
      price: "100€",
      duration: "per year",
      features: ["All Monthly features", "Custom branding", "API access", "Data export", "Save 16%"],
      cta: "Choose Yearly",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`
              transition-all duration-300 ease-in-out transform 
              ${index === selectedPlan ? 'scale-105 shadow-lg' : 'hover:scale-102 hover:shadow-md'}
              ${index === 1 ? 'border-primary' : 'border-gray-200'}
              cursor-pointer
            `}
            onClick={() => setSelectedPlan(index)}
          >
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">{plan.price}</span> 
                {index === 0 ? (
                  <span className="block text-sm mt-1">{plan.duration}</span>
                ) : (
                  <span> / {plan.duration}</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`
                  w-full transition-colors duration-300 ease-in-out
                  ${index === selectedPlan ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-primary/10 text-primary hover:bg-primary/20'}
                `}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}