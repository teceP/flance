"use client"

import React from 'react';

const InvoicePreview = ({ invoiceData }) => {
  const { companyName, address, email, invoiceNumber, date, items } = invoiceData;

  const totalAmount = items.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div className="invoice-preview" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>{companyName}</h2>
      <p>{address}</p>
      <p>Email: {email}</p>
      <h3>Rechnung #{invoiceNumber}</h3>
      <p>Datum: {date}</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #000', textAlign: 'left' }}>Beschreibung</th>
            <th style={{ borderBottom: '1px solid #000', textAlign: 'left' }}>Menge</th>
            <th style={{ borderBottom: '1px solid #000', textAlign: 'left' }}>Einzelpreis</th>
            <th style={{ borderBottom: '1px solid #000', textAlign: 'left' }}>Gesamt</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>€{item.price.toFixed(2)}</td>
              <td>€{(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4 style={{ marginTop: '20px' }}>Gesamtsumme: €{totalAmount.toFixed(2)}</h4>
    </div>
  );
};

export default InvoicePreview;