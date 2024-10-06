'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, DollarSign, Users, FileText, Bell } from 'lucide-react'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { StatCard } from '@/components/global/stat-card'
import PricingPage from '../pricing/page'
import { createBrowserClient } from '@/lib/pocketbase';

// New CurrentTime component
const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <p className="text-xl text-muted-foreground">
      {currentTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}
    </p>
  )
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('')
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      // 1. Erstelle den PocketBase-Client im Browser
      const pb = createBrowserClient();

      // 2. Prüfe, ob der Benutzer authentifiziert ist
      if (pb.authStore.isValid) {
        const userId = pb.authStore.model?.id; // Hole die userId vom aktuellen authentifizierten Benutzer


        if (userId) {
          // 3. Führe die API-Anfrage mit der userId durch
          const response = await fetch(`/api/subscription-status?userId=${userId}`);
          const data = await response.json();

          // 4. Setze den Zustand je nach Abonnementstatus
          setHasActiveSubscription(data.active);
        } else {
          console.error('User ID is not available');
        }
      } else {
        console.error('User is not authenticated');
      }
    };

    fetchSubscriptionStatus();
  }, []);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) setGreeting('Good morning')
      else if (hour < 18) setGreeting('Good afternoon')
      else setGreeting('Good evening')
    }

    updateGreeting() // Initial greeting update
    const timer = setInterval(updateGreeting, 3600000) // Update greeting every hour
    return () => clearInterval(timer)
  }, [])

  const kpiData = [
    { title: 'Total Revenue', icon: DollarSign, value: '$12,345', change: '+15%' },
    { title: 'New Clients', icon: Users, value: '54', change: '+12%' },
    { title: 'Pending Invoices', icon: FileText, value: '7', change: '-3%' },
  ]

  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 280 },
    { name: 'May', value: 590 },
    { name: 'Jun', value: 320 },
  ]

  const recentActivity = [
    { id: 1, text: 'New client "TechCorp" added', time: '2 hours ago' },
    { id: 2, text: 'Invoice #1234 paid', time: '4 hours ago' },
    { id: 3, text: 'Project "Website Redesign" completed', time: '1 day ago' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{greeting}, User!</h1>
        <CurrentTime />
      </div>

      {!hasActiveSubscription && <PricingPage />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Revenue" value="$12,345" change={15} isPositive={true} color="#10B981" />
        <StatCard title="New Clients" value="54" change={12} isPositive={true} color="#F59E0B" />
        <StatCard title="Pending Invoices" value="7" change={3} isPositive={false} color="#EF4444" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        <Card className="md:row-span-2 flex flex-col h-full"> {/* Ensure Card can fill space */}
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow"> {/* Allow CardContent to grow */}
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis />
                  <Tooltip />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="value" fill="var(--color-desktop)" radius={8} />
                </BarChart>
              </ResponsiveContainer></ChartContainer>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Add Client
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Start Timer
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              Record Expense
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivity.map((activity) => (
                <div>
                  <Bell className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
