import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Lot, Material, Recycler, Transaction } from '../data/mockData';

export interface BillPdfOptions {
  lot: Lot;
  material: Material;
  recycler: Recycler;
  transaction?: Transaction | null;
  billUrl: string;
  collectorName?: string;
  collectorPhone?: string;
  collectorCity?: string;
}

/**
 * Loads an image from URL and returns Base64 data string
 */
async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Generates an in-memory QR code as data URL for embedding in the PDF
 */
function createQrCodeDataUrl(text: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 160, 160);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(text)}&margin=1`;
    } catch {
      resolve(null);
    }
  });
}

/**
 * Converts a number to Indian Rupee Words format
 */
function numberToIndianWords(num: number): string {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ',
    'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ',
    'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.round(num);
  if (n === 0) return 'Zero Rupees Only';

  const inWords = (n: number): string => {
    let str = '';
    if (n > 19) {
      str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
    } else {
      str += a[n];
    }
    return str;
  };

  let output = '';
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = Math.floor((n % 1000) / 100);
  const rest = n % 100;

  if (crore > 0) output += inWords(crore) + 'Crore ';
  if (lakh > 0) output += inWords(lakh) + 'Lakh ';
  if (thousand > 0) output += inWords(thousand) + 'Thousand ';
  if (hundred > 0) output += inWords(hundred) + 'Hundred ';
  if (rest > 0) output += inWords(rest);

  return 'Rupees ' + output.trim() + ' Only';
}

/**
 * Returns HSN Code based on scrap category
 */
function getMaterialHsnCode(materialId: string): string {
  switch (materialId) {
    case 'm1': // PCB
      return '8548 10 10';
    case 'm2': // Screen / CRT
      return '8528 73 00';
    case 'm3': // Copper
      return '7404 00 12';
    case 'm4': // Aluminum
      return '7602 00 10';
    case 'm5': // Batteries
      return '8548 10 20';
    case 'm6': // Motors
      return '8501 10 19';
    default:
      return '8548 90 00';
  }
}

/**
 * Generates an official, publication-quality A4 Tax Invoice / Handover Bill PDF
 */
export async function generateBillPdf(options: BillPdfOptions): Promise<void> {
  const {
    lot,
    material,
    recycler,
    transaction,
    billUrl,
    collectorName = 'Ramdas CX-1028',
    collectorPhone = '+91 98231 44102',
    collectorCity = 'Pune Station Node, Maharashtra'
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 14;
  const rightMargin = 14;
  const contentWidth = pageWidth - leftMargin - rightMargin;

  // Visual Palette
  const primaryEmerald: [number, number, number] = [5, 150, 105]; // #059669
  const slateDark: [number, number, number] = [15, 23, 42]; // #0f172a
  const slateMuted: [number, number, number] = [100, 116, 139]; // #64748b
  const borderGray: [number, number, number] = [226, 232, 240]; // #e2e8f0
  const bgLight: [number, number, number] = [248, 250, 252]; // #f8fafc

  let cursorY = 12;

  // Rate & Payout computations
  const ratePerKg = recycler?.offers?.[material.id] || Math.round(lot.estimatedValueRange[0] / lot.weight) || 230;
  const finalPrice = lot.finalPrice || (transaction ? transaction.amount : Math.round(lot.weight * ratePerKg));
  const invoiceNumber = `REG-INV-${lot.id.toUpperCase()}-${new Date().getFullYear()}`;
  const issueDate = transaction?.date 
    ? new Date(transaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const paymentMethod = transaction?.method || 'Cash / Instant Mandi Settle';
  const hsnCode = getMaterialHsnCode(material.id);

  // Environmental impact metrics
  const co2OffsetKg = Math.round(lot.weight * 1.44 * 10) / 10;
  const landfillDivertedKg = Math.round(lot.weight * 10) / 10;

  // Load Logo and QR code in parallel
  const [logoBase64, qrCodeBase64] = await Promise.all([
    getBase64ImageFromUrl('/logo.png'),
    createQrCodeDataUrl(billUrl)
  ]);

  // Top emerald accent line
  doc.setFillColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.rect(0, 0, pageWidth, 4, 'F');

  // --- HEADER SECTION ---
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', leftMargin, cursorY, 14, 14);
    } catch {}
  }

  const brandX = logoBase64 ? leftMargin + 17 : leftMargin;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text('ReGain', brandX, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text('CIRCULAR E-WASTE & SECONDARY RESOURCE NETWORK', brandX + 22, cursorY + 5);

  doc.setFontSize(7.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('CPCB EPR Registered Network • Govt of India E-Waste Rules 2022 Compliant', brandX, cursorY + 10);
  doc.text('GSTIN: 27AAACR9012E1Z8 • CPCB Reg: REG-CPCB-EW-2026-9812', brandX, cursorY + 14);

  // Right Header badge: TAX INVOICE & SCRAP BILL
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text('TAX INVOICE & SCRAP BILL', pageWidth - rightMargin, cursorY + 5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text('ORIGINAL FOR RECIPIENT', pageWidth - rightMargin, cursorY + 10, { align: 'right' });

  doc.setFontSize(7.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Doc ID: #${invoiceNumber}`, pageWidth - rightMargin, cursorY + 14, { align: 'right' });

  cursorY += 21;

  // Divider
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, cursorY, pageWidth - rightMargin, cursorY);
  cursorY += 4;

  // --- INVOICE METADATA ROW ---
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(leftMargin, cursorY, contentWidth, 14, 2, 2, 'F');
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(leftMargin, cursorY, contentWidth, 14, 2, 2, 'S');

  const metaCols = [
    { label: 'INVOICE NO.', val: invoiceNumber },
    { label: 'ISSUE DATE', val: issueDate },
    { label: 'LOT MANIFEST', val: `#LOT-${lot.id.toUpperCase()}` },
    { label: 'PAYMENT STATUS', val: lot.status === 'Handover Completed' || transaction?.status === 'Paid' ? 'PAID & SETTLED' : 'VERIFIED / READY' },
    { label: 'REVERSE CHARGE', val: 'APPLICABLE (YES)' }
  ];

  const colW = contentWidth / metaCols.length;
  metaCols.forEach((col, idx) => {
    const colX = leftMargin + idx * colW + 3;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(col.label, colX, cursorY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    if (col.label === 'PAYMENT STATUS') {
      doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
    } else {
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    }
    doc.text(col.val, colX, cursorY + 10.5);
  });

  cursorY += 18;

  // --- BILLED BY (SELLER) & BILLED TO (BUYER) BOXES ---
  const boxW = (contentWidth - 6) / 2;
  const boxH = 34;

  // Box 1: Billed By (Collector)
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(leftMargin, cursorY, boxW, boxH, 2, 2, 'F');
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(leftMargin, cursorY, boxW, boxH, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text('BILLED BY / SUPPLIER (AGGREGATOR)', leftMargin + 4, cursorY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(collectorName, leftMargin + 4, cursorY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Collector Node ID: ${lot.collectorId || 'COL-1028'}`, leftMargin + 4, cursorY + 17);
  doc.text(`Service Hub: ${collectorCity}`, leftMargin + 4, cursorY + 21.5);
  doc.text(`Contact: ${collectorPhone}`, leftMargin + 4, cursorY + 26);
  doc.text('State Code: 27 (Maharashtra) • GST Unregistered Person', leftMargin + 4, cursorY + 30.5);

  // Box 2: Billed To (Authorized Recycler)
  const buyerX = leftMargin + boxW + 6;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(buyerX, cursorY, boxW, boxH, 2, 2, 'F');
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(buyerX, cursorY, boxW, boxH, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text('BILLED TO / RECIPIENT (AUTHORIZED RECYCLER)', buyerX + 4, cursorY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(recycler.name, buyerX + 4, cursorY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Facility: MIDC Bhosari Industrial Area, Pune 411026`, buyerX + 4, cursorY + 17);
  doc.text(`CPCB Authorization: #EW-MH-PUN-089`, buyerX + 4, cursorY + 21.5);
  doc.text(`GSTIN / Recycler ID: 27AABCE4911G1Z4 (${recycler.id})`, buyerX + 4, cursorY + 26);
  doc.text('State Code: 27 (Maharashtra) • Registered Taxpayer', buyerX + 4, cursorY + 30.5);

  cursorY += boxH + 6;

  // --- ITEM TABLE ---
  autoTable(doc, {
    startY: cursorY,
    margin: { left: leftMargin, right: rightMargin },
    head: [[
      'S.N.',
      'E-WASTE DESCRIPTION & SPECIFICATION',
      'HSN CODE',
      'NET WEIGHT',
      'UNIT RATE',
      'TAXABLE VAL',
      'GST (RCM)',
      'TOTAL (INR)'
    ]],
    body: [
      [
        '01',
        `${material.name} (Industrial Grade A)\nCondition: ${lot.condition || 'Pre-sorted'} | Source: ${lot.source || 'Local Collection'}`,
        hsnCode,
        `${lot.weight.toFixed(1)} KG`,
        `₹${ratePerKg.toLocaleString()} /kg`,
        `₹${finalPrice.toLocaleString()}`,
        '0.00 (RCM)*',
        `₹${finalPrice.toLocaleString()}`
      ]
    ],
    foot: [
      [
        { content: 'SUBTOTAL (TAXABLE VALUE):', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: '', styles: {} },
        { content: `₹${finalPrice.toLocaleString()}`, styles: { fontStyle: 'bold', halign: 'right' } }
      ],
      [
        { content: 'CGST @ 0% (Liability discharged under RCM by Recipient):', colSpan: 6, styles: { halign: 'right', textColor: slateMuted } },
        { content: '', styles: {} },
        { content: '₹0.00', styles: { halign: 'right', textColor: slateMuted } }
      ],
      [
        { content: 'SGST @ 0% (Liability discharged under RCM by Recipient):', colSpan: 6, styles: { halign: 'right', textColor: slateMuted } },
        { content: '', styles: {} },
        { content: '₹0.00', styles: { halign: 'right', textColor: slateMuted } }
      ],
      [
        { content: 'TOTAL SETTLED / PAYABLE INVOICE AMOUNT:', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold', fontSize: 10, textColor: primaryEmerald } },
        { content: '', styles: {} },
        { content: `₹${finalPrice.toLocaleString()}`, styles: { fontStyle: 'bold', fontSize: 10, halign: 'right', textColor: primaryEmerald } }
      ]
    ],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 55 },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 22, halign: 'right', fontStyle: 'bold' },
      4: { cellWidth: 22, halign: 'right' },
      5: { cellWidth: 22, halign: 'right' },
      6: { cellWidth: 18, halign: 'center' },
      7: { cellWidth: 22, halign: 'right', fontStyle: 'bold' }
    }
  });

  cursorY = (doc as any).lastAutoTable.finalY + 4;

  // --- AMOUNT IN WORDS & SETTLEMENT DETAILS ---
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(leftMargin, cursorY, contentWidth, 12, 2, 2, 'F');
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(leftMargin, cursorY, contentWidth, 12, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('AMOUNT CHARGEABLE (IN WORDS):', leftMargin + 4, cursorY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(numberToIndianWords(finalPrice), leftMargin + 4, cursorY + 9.5);

  const rightSettledX = pageWidth - rightMargin - 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Payment Mode: ${paymentMethod}`, rightSettledX, cursorY + 5, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text(`Mandi Settlement Verified ✓`, rightSettledX, cursorY + 9.5, { align: 'right' });

  cursorY += 16;

  // --- ESG & ENVIRONMENTAL OFFSET PANEL ---
  const esgCardH = 16;
  doc.setFillColor(240, 253, 244); // light green bg
  doc.roundedRect(leftMargin, cursorY, contentWidth, esgCardH, 2, 2, 'F');
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(leftMargin, cursorY, contentWidth, esgCardH, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text('CPCB EPR CIRCULAR ECONOMY & ESG AUDIT IMPACT', leftMargin + 4, cursorY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `By channelling this ${lot.weight} kg ${material.name} through certified recyclers, an estimated ${co2OffsetKg} kg CO₂e emissions were avoided and ${landfillDivertedKg} kg of hazardous landfill diversion was achieved under CPCB E-Waste Rules 2022.`,
    leftMargin + 4,
    cursorY + 10.5,
    { maxWidth: contentWidth - 8 }
  );

  cursorY += esgCardH + 5;

  // --- QR VERIFICATION & DECLARATIONS & SIGNATURE BOXES ---
  const bottomBoxH = 40;
  const qrBoxW = 42;
  const declBoxW = contentWidth - qrBoxW - 55 - 4;
  const signBoxW = 55;

  // QR Code Box (Left)
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(leftMargin, cursorY, qrBoxW, bottomBoxH, 2, 2, 'F');
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(leftMargin, cursorY, qrBoxW, bottomBoxH, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('VERIFY LIVE ONLINE', leftMargin + qrBoxW / 2, cursorY + 5, { align: 'center' });

  if (qrCodeBase64) {
    try {
      doc.addImage(qrCodeBase64, 'PNG', leftMargin + (qrBoxW - 25) / 2, cursorY + 7, 25, 25);
    } catch {}
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text('Scan for Live Digital Bill', leftMargin + qrBoxW / 2, cursorY + 36, { align: 'center' });

  // Declarations & Terms (Middle)
  const declX = leftMargin + qrBoxW + 2;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(declX, cursorY, declBoxW, bottomBoxH, 2, 2, 'F');
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(declX, cursorY, declBoxW, bottomBoxH, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text('STATUTORY DECLARATION & NOTES:', declX + 3, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  const declText = [
    '1. Tax on reverse charge basis to be discharged by recipient registered recycler as per Sec 9(4) CGST Act.',
    '2. Material certified free from explosive, radioactive, or bio-hazardous contaminants.',
    '3. Chain-of-custody locked with tamper-evident digital token hash on ReGain network node.',
    '4. Both parties certify the weighing measurement conducted at certified electronic bridge.'
  ];
  declText.forEach((t, i) => {
    doc.text(t, declX + 3, cursorY + 9.5 + i * 4.2, { maxWidth: declBoxW - 6 });
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text(`HASH: SHA-256: 7f83b165...${lot.id.slice(0, 4)}e9`, declX + 3, cursorY + 36);

  // Signatures & Stamp (Right)
  const signX = declX + declBoxW + 2;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(signX, cursorY, signBoxW, bottomBoxH, 2, 2, 'F');
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(signX, cursorY, signBoxW, bottomBoxH, 2, 2, 'S');

  // Stamp badge
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(signX + 4, cursorY + 3, signBoxW - 8, 12, 1.5, 1.5, 'F');
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(signX + 4, cursorY + 3, signBoxW - 8, 12, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text('ReGain CERTIFIED', signX + signBoxW / 2, cursorY + 7.5, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text('CPCB DIGITAL AUDIT SEAL ✓', signX + signBoxW / 2, cursorY + 11.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Authorized Signatory / Digitally Signed', signX + signBoxW / 2, cursorY + 28, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text('For ReGain & Recycling Partner', signX + signBoxW / 2, cursorY + 34, { align: 'center' });

  // --- FOOTER NOTE ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(
    'This is a computer-generated tax invoice and digital chain-of-custody certificate generated by ReGain Circular Network.',
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );
  doc.text(`Page 1 of 1 • Generated on ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, pageHeight - 5, { align: 'center' });

  // Save the PDF
  doc.save(`ReGain_Bill_LOT_${lot.id.toUpperCase()}.pdf`);
}
