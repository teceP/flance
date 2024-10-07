'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { PDFViewer, Document, Page, View, Text, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, FileText, MoreHorizontal, Plus, Trash2, X } from "lucide-react"
import { createBrowserClient } from "@/lib/pocketbase";
import { ClientsRecord } from '@/types/pocketbase-types'

import { CreateClientDialog } from '../create/components/create-client-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Register custom fonts (as in your original code)
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
    ],
});

// PDF styles (as in your original code)
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Roboto',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    logo: {
        fontSize: 24,
        fontWeight: 700,
        color: '#3B82F6',
    },
    invoiceInfo: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    invoiceTitle: {
        fontSize: 32,
        fontWeight: 700,
        color: '#1F2937',
        marginBottom: 8,
    },
    invoiceDetails: {
        fontSize: 12,
        color: '#6B7280',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 500,
        color: '#1F2937',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 5,
    },
    table: {
        flexDirection: 'column',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        padding: 8,
        fontWeight: 500,
        fontSize: 12,
        color: '#374151',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        padding: 8,
        fontSize: 12,
        color: '#4B5563',
    },
    tableCell: {
        flex: 1,
    },
    summarySection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    summaryTable: {
        width: '50%',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        fontSize: 12,
        color: '#4B5563',
    },
    summaryTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        fontSize: 14,
        fontWeight: 700,
        color: '#1F2937',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginTop: 8,
    },
    footer: {
        marginTop: 40,
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    watermark: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    watermarkText: {
        fontSize: 60,
        color: 'lightgrey',
        opacity: 0.5,
    },
});

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

export default function CreateInvoicePage() {
    const [isNewClientOpen, setIsNewClientOpen] = useState(false);
    const [clients, setClients] = useState<ClientsRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);

    const pb = createBrowserClient();

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceFormSchema),
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const { fields: discountFields, append: appendDiscount, remove: removeDiscount } = useFieldArray({
        control: form.control,
        name: "discounts",
    });

    async function fetchClients() {
        try {
            const currentUser = pb.authStore.model;
            if (!currentUser) return;

            const clientsList = await pb.collection('clients').getFullList<ClientsRecord>({
                filter: `user_id = "${currentUser.id}"`,
            });
            setClients(clientsList);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchClients();
    }, []);

    const handleClientCreated = (clientId: string) => {
        fetchClients();
        setSelectedClient(clientId);
    };

    const recalculateInvoice = () => {
        const items = form.getValues("items");
        const discounts = form.getValues("discounts");

        discounts.forEach((discountItem) => discountItem.amount = 0);

        let subtotal = 0;
        let taxes: { [key: string]: number } = {};

        items.forEach((item, index) => {
            const rate = item.rate || 0;
            const quantity = item.quantity || 0;
            const itemSubtotal = (rate * quantity);

            form.setValue(`items.${index}.subtotal`, itemSubtotal);
            subtotal += itemSubtotal;

            let currentItemTotal = itemSubtotal;
            discounts.forEach((discount) => {
                const discountAmount = currentItemTotal * (discount.rate / 100);
                currentItemTotal -= discountAmount;
                discount.amount += discountAmount;
            });

            const taxRate = item.tax;
            const taxAmount = currentItemTotal * (taxRate / 100);
            if (taxes[taxRate]) {
                taxes[taxRate] += taxAmount;
            } else {
                taxes[taxRate] = taxAmount;
            }

            const itemTotal = currentItemTotal + taxAmount;
            form.setValue(`items.${index}.total`, itemTotal);
        });

        const totalDiscountAmount = discounts.reduce((sum, discount) => sum + discount.amount, 0);

        let totalTax = 0;
        Object.keys(taxes).forEach((taxRate) => {
            totalTax += taxes[taxRate];
        });

        const totalAmount = subtotal - totalDiscountAmount + totalTax;

        form.setValue("subtotal", subtotal);
        form.setValue("tax", Object.keys(taxes).map(taxRate => ({
            rate: parseFloat(taxRate),
            amount: taxes[taxRate],
        })));
        form.setValue("total", totalAmount);
    };

    function onSubmit(data: InvoiceFormValues) {
        console.log(data);
        // Handle form submission
    }

    const hasPreviewData = form.watch("items").length > 0 || form.watch("client") !== "";

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Create New Invoice</h1>
                {/*<div className="space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button variant="outline">Create Draft</Button>
                    <Button type="submit" form="invoice-form">Create Invoice</Button>
                </div>*/}
            </div>

            <div className="flex gap-6">
                <div className="w-2/3">
                    <Form {...form}>
                        <form id="invoice-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Generals</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="invoiceNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Invoice Number</FormLabel>
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
                                                    <FormLabel>Client</FormLabel>
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
                                        <FormField
                                            control={form.control}
                                            name="issueDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Issue Date</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
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
                                                    <FormLabel>Due Date</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Items</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Rate</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Tax</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fields.map((item, index) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="align-top">
                                                        <FormField
                                                            control={form.control}
                                                            name={`items.${index}.name`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input {...field} placeholder="Name" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="align-top">
                                                        <FormField
                                                            control={form.control}
                                                            name={`items.${index}.description`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input {...field} placeholder="Description" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="align-top">
                                                        <FormField
                                                            control={form.control}
                                                            name={`items.${index}.rate`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            type="number"
                                                                            placeholder="Rate"
                                                                            onChange={(e) => {
                                                                                const inputValue = e.target.value;
                                                                                if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
                                                                                    const newRate = parseFloat(inputValue) || 0;
                                                                                    field.onChange(newRate);
                                                                                    recalculateInvoice();
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="align-top">
                                                        <FormField
                                                            control={form.control}
                                                            name={`items.${index}.quantity`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            type="number"
                                                                            placeholder="Quantity"
                                                                            onChange={(e) => {
                                                                                const newQuantity = parseInt(e.target.value) || 0;
                                                                                field.onChange(newQuantity);
                                                                                recalculateInvoice();
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="align-top">
                                                        <FormField
                                                            control={form.control}
                                                            name={`items.${index}.tax`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            type="number"
                                                                            placeholder="Tax"
                                                                            step="0.01"
                                                                            onChange={(e) => {
                                                                                const inputValue = e.target.value;
                                                                                if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
                                                                                    field.onChange(parseFloat(inputValue) || 0);
                                                                                    recalculateInvoice();
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="align-top">
                                                        {form.watch(`items.${index}.total`).toFixed(2)}€
                                                    </TableCell>
                                                    {/* Other table cells for description, rate, quantity, tax, and total remain unchanged */}
                                                    <TableCell className="align-top">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => remove(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Remove item</span>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => append({ name: "", description: "", rate: 0, quantity: 0, tax: 19, subtotal: 0, total: 0 })}
                                        className="mt-4"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Item
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Discounts</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Rate (%)</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {discountFields.map((field, index) => (
                                                <TableRow key={field.id}>
                                                    <TableCell className="align-top">
                                                        <FormField
                                                            control={form.control}
                                                            name={`discounts.${index}.description`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input {...field} placeholder="Description" />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="align-top">
                                                        <FormField
                                                            control={form.control}
                                                            name={`discounts.${index}.rate`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            type="number"
                                                                            step="0.01"
                                                                            onChange={(e) => {
                                                                                const inputValue = e.target.value;
                                                                                if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
                                                                                    field.onChange(parseFloat(inputValue) || 0);
                                                                                    recalculateInvoice();
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="align-top">
                                                        {form.watch(`discounts.${index}.amount`).toFixed(2)}€
                                                    </TableCell>
                                                    <TableCell className="align-top">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                removeDiscount(index);
                                                                recalculateInvoice();
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Remove discount</span>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => appendDiscount({ description: "", amount: 0, rate: 0 })}
                                        className="mt-4"
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Add Discount
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-2 text-right">
                                        <div className="flex justify-end font-bold">
                                            <span className="mr-4">Subtotal</span>
                                            <span>{form.watch("subtotal").toFixed(2)}€</span>
                                        </div>
                                        {form.watch("discounts")?.map((discountItem, index) => (
                                            <div key={index} className="flex justify-end">
                                                <span className="mr-4">Discount: ({discountItem.rate}%)</span>
                                                <span>-{discountItem.amount.toFixed(2)}€</span>
                                            </div>
                                        ))}
                                        {form.watch("tax")?.map((taxItem, index) => (
                                            <div key={index} className="flex justify-end">
                                                <span className="mr-4">Tax ({taxItem.rate}%)</span>
                                                <span>{taxItem.amount.toFixed(2)}€</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-end font-bold">
                                            <span className="mr-4">Total Amount</span>
                                            <span>{form.watch("total").toFixed(2)}€</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </Form>
                </div>

                <div className="w-1/3">
                    <div className="sticky top-4 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Save as Draft
                                </Button>
                                <Button variant="outline" size="sm">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Mark as Paid
                                </Button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button type="submit" form="invoice-form">Create Invoice</Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => console.log("Create Draft")}>
                                            Create Draft
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => console.log("Cancel")}>
                                            Cancel
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                                {hasPreviewData ? (
                                    <PDFViewer style={{ width: '100%', height: 'calc(100vh - 12rem)' }} showToolbar={false}>
                                        <Document>
                                            <Page size="A4" style={styles.page}>
                                                {/* Watermark */}
                                                <Svg style={styles.watermark}>
                                                    <Path
                                                        d="M50,50 L150,150 M100,50 L200,150 M150,50 L250,150"
                                                        stroke="lightgrey"
                                                        strokeWidth={2}
                                                    />
                                                    <Text
                                                        style={styles.watermarkText}
                                                        transform="rotate(-45 150,150)"
                                                    >
                                                        PREVIEW
                                                    </Text>
                                                </Svg>

                                                <View style={styles.header}>
                                                    <Text style={styles.logo}>ACME Inc.</Text>
                                                    <View style={styles.invoiceInfo}>
                                                        <Text style={styles.invoiceTitle}>RECHNUNG</Text>
                                                        <Text style={styles.invoiceDetails}>Rechnungsnummer: {form.watch("invoiceNumber")}</Text>
                                                        <Text style={styles.invoiceDetails}>Ausstellungsdatum: {form.watch("issueDate")?.toLocaleDateString()}</Text>
                                                        <Text style={styles.invoiceDetails}>Fälligkeitsdatum: {form.watch("dueDate")?.toLocaleDateString()}</Text>
                                                    </View>
                                                </View>

                                                <View style={styles.section}>
                                                    <Text style={styles.sectionTitle}>Kundeninformationen</Text>
                                                    <Text>{form.watch("client")}</Text>
                                                </View>

                                                <View style={styles.section}>
                                                    <Text style={styles.sectionTitle}>Positionen</Text>
                                                    <View style={styles.table}>
                                                        <View style={styles.tableHeader}>
                                                            <Text style={styles.tableCell}>Produkt</Text>
                                                            <Text style={styles.tableCell}>Menge</Text>
                                                            <Text style={styles.tableCell}>Einzelpreis</Text>
                                                            <Text style={styles.tableCell}>Gesamt</Text>
                                                        </View>
                                                        {form.watch("items").map((item, index) => (
                                                            <View key={index} style={styles.tableRow}>
                                                                <Text style={styles.tableCell}>{item.name}</Text>
                                                                <Text style={styles.tableCell}>{item.quantity}</Text>
                                                                <Text style={styles.tableCell}>{item.rate.toFixed(2)} €</Text>
                                                                <Text style={styles.tableCell}>{item.total.toFixed(2)} €</Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>

                                                <View style={styles.summarySection}>
                                                    <View style={styles.summaryTable}>
                                                        <View style={styles.summaryRow}>
                                                            <Text>Zwischensumme</Text>
                                                            <Text>{form.watch("subtotal").toFixed(2)} €</Text>
                                                        </View>
                                                        {form.watch("discounts").map((discount, index) => (
                                                            <View key={index} style={styles.summaryRow}>
                                                                <Text>Rabatt ({discount.description})</Text>
                                                                <Text>-{discount.amount.toFixed(2)} €</Text>
                                                            </View>
                                                        ))}
                                                        {form.watch("tax").map((tax, index) => (
                                                            <View key={index} style={styles.summaryRow}>
                                                                <Text>MwSt. ({tax.rate}%)</Text>
                                                                <Text>{tax.amount.toFixed(2)} €</Text>
                                                            </View>
                                                        ))}
                                                        <View style={styles.summaryTotal}>
                                                            <Text>Gesamtbetrag</Text>
                                                            <Text>{form.watch("total").toFixed(2)} €</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                                <Text style={styles.footer}>
                                                    Vielen Dank für Ihr Vertrauen. Bei Fragen stehen wir Ihnen gerne zur Verfügung.
                                                </Text>
                                            </Page>
                                        </Document>
                                    </PDFViewer>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] bg-muted/50 rounded-lg">
                                        <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground text-center">
                                            Your invoice preview will appear here as you add items and details.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <CreateClientDialog
                open={isNewClientOpen}
                onOpenChange={setIsNewClientOpen}
                onClientCreated={handleClientCreated}
            />
        </div>
    );
}