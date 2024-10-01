'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer'

// Define custom fonts (optional)
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
  ],
})

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  table: {
    //display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: 500,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
  },
})

// Define invoice item type
interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Define invoice type
interface Invoice {
  invoiceNumber: string
  date: string
  dueDate: string
  companyName: string
  companyAddress: string
  clientName: string
  clientAddress: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
}

// Create Invoice component
const InvoicePDF: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Invoice</Text>
        <Text style={styles.title}>Invoice Number: {invoice.invoiceNumber}</Text>
        <Text style={styles.subtitle}>Date: {invoice.date}</Text>
        <Text style={styles.subtitle}>Due Date: {invoice.dueDate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>From:</Text>
        <Text>{invoice.companyName}</Text>
        <Text>{invoice.companyAddress}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>To:</Text>
        <Text>{invoice.clientName}</Text>
        <Text>{invoice.clientAddress}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Quantity</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Unit Price</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
          </View>
          {invoice.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.description}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>${item.unitPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>${item.total.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Subtotal: ${invoice.subtotal.toFixed(2)}</Text>
        <Text style={styles.subtitle}>Tax: ${invoice.tax.toFixed(2)}</Text>
        <Text style={styles.title}>Total: ${invoice.total.toFixed(2)}</Text>
      </View>

      <Text style={styles.footer}>Thank you for your business!</Text>
    </Page>
  </Document>
)

// Create a wrapper component to display the PDF
export default function InvoicePDFWrapper({ invoice }: { invoice: Invoice }) {
  return (
    <PDFViewer width="100%" height="600px">
      <InvoicePDF invoice={invoice} />
    </PDFViewer>
  )
}