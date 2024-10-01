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

const invoiceFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>

const defaultValues: Partial<InvoiceFormValues> = {
  username: "I own a computer.",
}

export default function NInvoiceForm() {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues
  })

  const { fields, append } = useFieldArray({
    username: "urls",
    control: form.control,
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>

    </SheetContent>
  </Sheet>

  )
}