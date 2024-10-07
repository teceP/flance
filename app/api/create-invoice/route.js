// pages/api/create-invoice.js
import { NextApiRequest, NextApiResponse } from 'next';
import PDFDocument from 'pdfkit';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const doc = new PDFDocument();
  let buffers: Buffer[] = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    const pdfData = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfData);
  });

  doc.fontSize(25).text('This is an invoice!', 100, 100);
  doc.end();
}
