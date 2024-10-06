'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import { Label } from '@/components/ui/label'
import { createBrowserClient } from "@/lib/pocketbase"; // Import your PocketBase client creation function
import { ClientsRecord } from '@/types/pocketbase-types'

import { CreateClientDialog } from './components/create-client-dialog'

const invoiceFormSchema = z.object({
    invoiceNumber: z.string().min(4, { message: "Invoice number must be at least 4 characters." }),
    issueDate: z.date({ required_error: "Issue date is required." }),
    dueDate: z.date({ required_error: "Due date is required." }),
    client: z.string().nonempty("Client's name is required."),
    total: z.number().min(0, { message: "Total must be a positive number." }),
    discounts: z.array(z.object({
        description: z.string().min(1, { message: "Discount description must be at least 1 character." }),
        amount: z.number().gt(0, { message: "Discount must be a positive number." }),
        rate: z.number().min(0, { message: "Discount must be a positive number." }),
    })).refine((discounts) => {
        const totalDiscountAmount = discounts.reduce((sum, discount) => sum + discount.rate, 0);
        return totalDiscountAmount <= 100;
    }, {
        message: "Total discount amount cannot exceed 100.",
    }),
    tax: z.array(z.object({
        rate: z.number().min(0, { message: "Tax rate must be a positive number." }),
        amount: z.number().min(0, { message: "Tax amount must be a positive number." }),
    })),
    subtotal: z.number().min(0, { message: "Subtotal must be a positive number." }),
    items: z.array(z.object({
        name: z.string().nonempty("Item name is required."),
        description: z.string(),
        rate: z.number().min(0, "Rate must be positive."),
        quantity: z.number().min(1, "Quantity must be at least 1."),
        tax: z.number().min(0).max(100, { message: "Tax must be between 0 and 100." }),
        subtotal: z.number({ required_error: "Subtotal must be a number." }),
        total: z.number({ required_error: "Total must be a number." }),
    })),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>


const defaultValues: Partial<InvoiceFormValues> = {
    invoiceNumber: "",
    issueDate: new Date(),
    dueDate: new Date(),
    client: "",
    total: 0,
    discounts: [],
    tax: [{ rate: 19, amount: 0 }],
    subtotal: 0,
    items: [{ name: "", description: "", rate: 0, quantity: 0, tax: 19, subtotal: 0, total: 0 }],
};

type InvoiceForm = {
    items: InvoiceItem[];
};

export default function CreatePage() {
    const [isNewClientOpen, setIsNewClientOpen] = useState(false)
    const [clients, setClients] = useState<ClientsRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<string | null>(null)

    const pb = createBrowserClient(); // Use the browser client

    async function fetchClients() {
        try {
            const currentUser = pb.authStore.model;
            if (!currentUser) return;

            const clientsList = await pb.collection('clients').getFullList<ClientsRecord>({
                filter: `user_id = "${currentUser.id}"`,
            });
            console.log(clientsList)
            setClients(clientsList);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {


        fetchClients();
    }, [pb]);


    // Calculate subtotal, tax, discount, and total
    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceFormSchema),
        defaultValues,
    })

    function onSubmit(data: InvoiceFormValues) {
        console.log(data)
        // Handle form submission
    }

    const handleClientCreated = (clientId: string) => {
        fetchClients()
        setSelectedClient(clientId)
    }

    const { control, watch } = form

    // Manage the dynamic items array with useFieldArray
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items", // Must match schema field
    })

    const { fields: discountFields, append: appendDiscount, remove: removeDiscount } = useFieldArray({
        control: form.control,
        name: "discounts",
    })

    const recalculateInvoice = () => {
        const items = form.getValues("items");
        const discounts = form.getValues("discounts");

        discounts.forEach((discountItem) => discountItem.amount = 0);  // Setze alle Rabattbeträge auf 0

        let subtotal = 0;
        let taxes: { [key: string]: number } = {};

        // Berechne Subtotal und Steuern für jedes Item
        items.forEach((item, index) => {
            const rate = item.rate || 0;
            const quantity = item.quantity || 0;
            const itemSubtotal = (rate * quantity); // Subtotal für das Item
            console.log("Item Index:", index, "Rate:", item.rate, "Quant:", item.quantity, "ItemSubtotal:", itemSubtotal, "Subtotal:", subtotal);

            // Setze den Subtotal des Items
            form.setValue(`items.${index}.subtotal`, itemSubtotal);
            subtotal += itemSubtotal; // Gesamt-Subtotal


            // Rabattberechnung: Rabatte nacheinander anwenden
            let currentItemTotal = itemSubtotal;
            discounts.forEach((discount) => {
                const discountAmount = currentItemTotal * (discount.rate / 100); // Rabatt auf den aktuellen Betrag
                currentItemTotal -= discountAmount; // Rabatt abziehen
                discount.amount += discountAmount;  // Rabattbeträge aufsummieren
            });

            // Steuerberechnung
            const taxRate = item.tax;
            const taxAmount = currentItemTotal * (taxRate / 100); // Steuer für das Item auf den rabattierten Betrag
            if (taxes[taxRate]) {
                taxes[taxRate] += taxAmount; // Bestehenden Steuersatz aktualisieren
            } else {
                taxes[taxRate] = taxAmount; // Neuen Steuersatz hinzufügen
            }

            // Gesamtbetrag für das Item: rabattiertes Subtotal + Tax
            const itemTotal = currentItemTotal + taxAmount;
            form.setValue(`items.${index}.total`, itemTotal);
        });

        // Rabattberechnung für die gesamte Rechnung
        const totalDiscountAmount = discounts.reduce((sum, discount) => sum + discount.amount, 0);

        let totalTax = 0;
        Object.keys(taxes).forEach((taxRate) => {
            totalTax += taxes[taxRate]; // Gesamtsumme der Steuern
        });

        const totalAmount = subtotal - totalDiscountAmount + totalTax;

        form.setValue("subtotal", subtotal);
        form.setValue("tax", Object.keys(taxes).map(taxRate => ({
            rate: parseFloat(taxRate),
            amount: taxes[taxRate],
        })));
        form.setValue("total", totalAmount);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Create New Invoice</h1>
                <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white">
                    Cancel
                </Button>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className='text-lg font-semibold mb-2'>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="invoiceNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Invoice Number</Label>
                                            <FormControl>
                                                <Input placeholder="INV-0001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="client"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Client</Label>
                                            <Select onValueChange={(value) => {
                                                if (value === "new") {
                                                    setIsNewClientOpen(true);
                                                } else {
                                                    field.onChange(value);
                                                }
                                            }} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a client" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {clients.map((client) => (
                                                        <SelectItem key={client.name} value={client.name}>
                                                            {client.name}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="new">
                                                        <Plus className="mr-2 h-4 w-4 inline-block" />
                                                        Create New Client
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <CreateClientDialog
                                    open={isNewClientOpen}
                                    onOpenChange={setIsNewClientOpen}
                                    onClientCreated={handleClientCreated}
                                />

                                <FormField
                                    control={form.control}
                                    name="issueDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Issue Date</Label>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    value={field.value ? field.value.toISOString().split('T')[0] : ""}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Due Date</Label>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    value={field.value ? field.value.toISOString().split('T')[0] : ""}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold mb-2">Items</h3>
                            {/* Dynamic Items List */}
                            {fields.map((item, index) => (
                                <div key={item.id} className="flex items-start space-x-2 mb-2">
                                    {/* Item Name */}
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Name</Label>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Name"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Description</Label>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Description"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Item Rate */}
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.rate`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Rate</Label>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="Rate"
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value;
                                                            if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
                                                                const newRate = parseFloat(inputValue) || 0;
                                                                field.onChange(newRate); // Passes the number directly
                                                                recalculateInvoice(); // Recalculates the invoice
                                                            }
                                                        }
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Item Quantity */}
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <Label>Quantity</Label>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="Quantity"
                                                        onChange={(e) => {
                                                            if ((parseInt(e.target.value) || 0) >= 0) {
                                                                const newQuantity = parseInt(e.target.value) || 0; // Quantity als Zahl
                                                                console.log(newQuantity)
                                                                field.onChange(newQuantity); // Aktualisiere den Quantity-Wert          
                                                                recalculateInvoice()
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Item Tax */}
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.tax`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Tax</Label>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="Tax"
                                                        step="0.01"
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value;
                                                            if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
                                                                const newTax = parseFloat(inputValue) || 0;
                                                                console.log(newTax);
                                                                field.onChange(inputValue); // übergibt den ursprünglichen Wert zur Anzeige
                                                                recalculateInvoice(); // Führt die Neuberechnung aus
                                                            }
                                                        }
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.subtotal`} // total wird nicht explizit im Schema benötigt
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Subtotal</Label>
                                                <FormControl>
                                                    <Input
                                                        readOnly
                                                        className="text-gray-400"
                                                        type="text" // Typ kann "text" sein, da der Wert als formatierter String angezeigt wird
                                                        value={`$${(field.value)}`} // Dynamische Berechnung
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.total`} // total wird nicht explizit im Schema benötigt
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Total</Label>
                                                <FormControl>
                                                    <Input
                                                        readOnly
                                                        className="text-gray-400"
                                                        type="text" // Typ kann "text" sein, da der Wert als formatierter String angezeigt wird
                                                        value={`$${(field.value)}`} // Dynamische Berechnung
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Remove Item Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove item</span>
                                    </Button>
                                </div>
                            ))}

                            {/* Add New Item Button */}
                            <Button type='button' variant="outline" onClick={() => append({ name: "", description: "", rate: 0, quantity: 0, tax: 19, subtotal: 0, total: 0 })}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Discounts</h3>
                                {discountFields.map((field, index) => (
                                    <div key={field.id} className="flex items-end space-x-2 mb-2">
                                        <FormField
                                            control={form.control}
                                            name={`discounts.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label>Description</Label>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder='Description'
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`discounts.${index}.rate`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label>Rate in %</Label>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            step="0.01"
                                                            onChange={(e) => {
                                                                const inputValue = e.target.value;
                                                                if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
                                                                    const newTax = parseFloat(inputValue) || 0;
                                                                    console.log(newTax);
                                                                    field.onChange(inputValue);
                                                                    recalculateInvoice();
                                                                }
                                                            }
                                                            }
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="button" variant="outline" size="icon" onClick={() => {
                                            removeDiscount(index)
                                            recalculateInvoice()
                                        }}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => {
                                    appendDiscount({ description: "", amount: 0, rate: 0 })
                                }}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Discount
                                </Button>
                            </div>
                            <FormField
                                control={form.control}
                                name="total"
                                render={({ }) => (
                                    <FormItem>
                                        <div className="flex-1 space-y-2 text-right">
                                            <div className="flex justify-end font-bold">
                                                <span className="text-right mr-4">Subtotal</span>
                                                <span className="text-right">{(form.watch("subtotal") || 0).toFixed(2)}€</span>
                                            </div>
                                            {/* Gruppierte Steuersätze ausgeben */}
                                            {form.watch("discounts")?.map((discountItem, index) => (
                                                <div className="flex justify-end" key={index}>
                                                    <span className="text-right mr-4">Discount: ({discountItem.rate}%)</span>
                                                    <span className="text-right">-{discountItem.amount.toFixed(2)}€</span>
                                                </div>
                                            ))}

                                            {/* Gruppierte Steuersätze ausgeben */}
                                            {form.watch("tax")?.map((taxItem, index) => (
                                                <div className="flex justify-end" key={index}>
                                                    <span className="text-right mr-4">Tax ({taxItem.rate}%)</span>
                                                    <span className="text-right">{taxItem.amount.toFixed(2)}€</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-end font-bold">
                                                <span className="text-right mr-4">Total Amount</span>
                                                <span className="text-right">{form.watch("total").toFixed(2)}€</span>
                                            </div>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">Create Invoice</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}