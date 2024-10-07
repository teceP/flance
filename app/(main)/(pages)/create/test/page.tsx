'use client';

import React from 'react';
import { PDFViewer, Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';

// Register custom fonts
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
    ],
});

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
});

const testData = {
    invoiceNumber: "INV-1234",
    issueDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    client: "Max Mustermann",
    total: 500,
    discounts: [
        {
            description: "Frühbucherrabatt",
            amount: 50,
            rate: 10,
        },
    ],
    tax: [
        {
            rate: 19,
            amount: 95,
        },
    ],
    subtotal: 445,
    items: [
        {
            name: "Produkt A",
            description: "Eine detaillierte Beschreibung von Produkt A, die die wichtigsten Merkmale hervorhebt.",
            rate: 100,
            quantity: 3,
            tax: 19,
            subtotal: 300,
            total: 357,
        },
        {
            name: "Produkt B",
            description: "Eine detaillierte Beschreibung von Produkt B, die die Vorteile und Merkmale erläutert.",
            rate: 50,
            quantity: 2,
            tax: 19,
            subtotal: 100,
            total: 119,
        },
    ],
};

const ModernInvoicePDF: React.FC = () => {
    const invoiceData = testData;

    return (
        <PDFViewer style={{ width: '100%', height: '90vh' }} showToolbar={true}>
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <Text style={styles.logo}>ACME Inc.</Text>
                        <View style={styles.invoiceInfo}>
                            <Text style={styles.invoiceTitle}>RECHNUNG</Text>
                            <Text style={styles.invoiceDetails}>Rechnungsnummer: {invoiceData.invoiceNumber}</Text>
                            <Text style={styles.invoiceDetails}>Ausstellungsdatum: {invoiceData.issueDate.toLocaleDateString()}</Text>
                            <Text style={styles.invoiceDetails}>Fälligkeitsdatum: {invoiceData.dueDate.toLocaleDateString()}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Kundeninformationen</Text>
                        <Text>{invoiceData.client}</Text>
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
                            {invoiceData.items.map((item, index) => (
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
                                <Text>{invoiceData.subtotal.toFixed(2)} €</Text>
                            </View>
                            {invoiceData.discounts.map((discount, index) => (
                                <View key={index} style={styles.summaryRow}>
                                    <Text>Rabatt ({discount.description})</Text>
                                    <Text>-{discount.amount.toFixed(2)} €</Text>
                                </View>
                            ))}
                            {invoiceData.tax.map((tax, index) => (
                                <View key={index} style={styles.summaryRow}>
                                    <Text>MwSt. ({tax.rate}%)</Text>
                                    <Text>{tax.amount.toFixed(2)} €</Text>
                                </View>
                            ))}
                            <View style={styles.summaryTotal}>
                                <Text>Gesamtbetrag</Text>
                                <Text>{invoiceData.total.toFixed(2)} €</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.footer}>
                        Vielen Dank für Ihr Vertrauen. Bei Fragen stehen wir Ihnen gerne zur Verfügung.
                    </Text>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default ModernInvoicePDF;