"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { toast } from "@/providers/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { SelectGroup, SelectLabel } from "@radix-ui/react-select"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"

const invoiceFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  invoiceNumber: z.string().min(4, {
    message: "Invoice number must be at least 4 characters."
  }),
  issueDate: z.date({
    message: "Enter a valid date."
  }),
  dueDate: z.date({
    message: "Enter a valid date."
  }),
  client: z.string().min(4, {
    message: "Client must be chosen."
  }),
})

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>

const defaultValues: Partial<InvoiceFormValues> = {
  username: "",
  invoiceNumber: "",
  issueDate: undefined,
  dueDate: undefined,
  client: undefined,
}

export default function NInvoiceForm() {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false)
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues
  })

  function onSubmit(data: InvoiceFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  function handleNewClient() {
    setIsNewClientDialogOpen(true)
  }

  return (<Sheet modal={true} >
    <SheetTrigger asChild>
      <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white">Create Invoice</Button>
    </SheetTrigger>
    <SheetContent style={{ maxWidth: '40vw' }} side="right" className="flex flex-col h-scree">
      <SheetHeader >
        <SheetTitle>New Invoice</SheetTitle>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex-1 overflow-auto space-y-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input placeholder="00-0000" {...field} />
                      </FormControl>
                      <FormDescription>
                        The Invoice Number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="tt.mm.yyyy" {...field}
                          value={field.value ? field.value.toISOString().split('T')[0] : ""}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        The Issue Date.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="tt.mm.yyyy" {...field}
                          value={field.value ? field.value.toISOString().split('T')[0] : ""}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        The Due Date.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="client"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a client" />

                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="initAg">init AG</SelectItem>
                                  <SelectItem value="vw">VW</SelectItem>
                                  <SelectItem value="akkusys">Akkusys</SelectItem>
                                  <SelectItem value="new" className="text-blue-500 font-semibold" onSelect={handleNewClient}>
                                    <Plus className="mr-2 h-4 w-4 inline-block" />
                                    Create New Client
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Choose the corrosponding client.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                  </div>
                </div>
              </div>
            </div>

          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>

    </SheetContent>

    <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
        </DialogHeader>
        {/* Add your new client form here */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          {/* Add more fields as needed */}
        </div>
        <DialogFooter>
          <Button type="submit">Create Client</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Sheet>

  )
}