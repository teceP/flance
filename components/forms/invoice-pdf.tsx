"use client"

import React, { useState } from 'react';
import InvoicePreview from './invoice-preview'; // Importiere die Vorschau-Komponente
import { PDFDocument, rgb } from 'pdf-lib';

const InvoicePdf = () => {
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 0, price: 0 }]);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateInvoice = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size

    // ... (Hier bleibt der vorherige Code für die PDF-Generierung unverändert)

    const pdfBytes = await pdfDoc.save();

    // Blob für den Download erstellen
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `rechnung_${invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 0, price: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div>
      <h1>Rechnung erstellen</h1>
      <input
        type="text"
        placeholder="Firmenname"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Adresse"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Rechnungsnummer"
        value={invoiceNumber}
        onChange={(e) => setInvoiceNumber(e.target.value)}
      />
      <br />
      <input
        type="date"
        placeholder="Datum"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <br />
      {items.map((item, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Beschreibung"
            value={item.name}
            onChange={(e) => updateItem(index, 'name', e.target.value)}
          />
          <input
            type="number"
            placeholder="Menge"
            value={item.quantity}
            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
          />
          <input
            type="number"
            placeholder="Einzelpreis"
            value={item.price}
            onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
          />
        </div>
      ))}
      <button onClick={addItem}>Position hinzufügen</button>
      <button onClick={() => setShowPreview(true)}>Vorschau anzeigen</button>
      <button onClick={handleGenerateInvoice}>PDF generieren</button>

      {showPreview && (
        <div style={{ marginTop: '20px', border: '1px solid #000', padding: '10px' }}>
          <h2>Rechnungsvorschau</h2>
          <InvoicePreview
            invoiceData={{
              companyName,
              address,
              email,
              invoiceNumber,
              date,
              items,
            }}
          />
          <button onClick={() => setShowPreview(false)}>Schließen</button>
        </div>
      )}
    </div>
  );
};

export default InvoicePdf;
