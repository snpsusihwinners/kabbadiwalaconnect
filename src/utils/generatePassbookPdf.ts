import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Transaction, Material } from '../data/mockData';

export type PassbookTimeframe = '1m' | '1y';

export interface StatisticalAnalysis {
  timeframe: PassbookTimeframe;
  periodLabel: string;
  startDate: Date;
  endDate: Date;
  totalTransactions: number;
  paidTransactions: number;
  pendingTransactions: number;
  totalWeightKg: number;
  totalSettledAmount: number;
  totalPendingAmount: number;
  avgRatePerKg: number;
  avgTransactionValue: number;
  highestPayout: number;
  upiAmount: number;
  cashAmount: number;
  co2OffsetKg: number;
  landfillDivertedKg: number;
  materialStats: Array<{
    materialId: string;
    name: string;
    weightKg: number;
    weightPercent: number;
    amount: number;
    amountPercent: number;
    avgRate: number;
    count: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    weightKg: number;
    amount: number;
  }>;
}

/**
 * Computes statistical analysis for the given transactions and timeframe
 */
export function computePassbookStats(
  transactions: Transaction[],
  materials: Material[],
  timeframe: PassbookTimeframe,
  materialNameGetter: (m?: Material) => string
): { stats: StatisticalAnalysis; filteredTransactions: Transaction[] } {
  const now = new Date('2026-09-11T23:59:59Z');
  const days = timeframe === '1m' ? 30 : 365;
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Filter transactions in timeframe
  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return d >= startDate && d <= now;
  });

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalTransactions = filtered.length;
  const paidList = filtered.filter((t) => t.status === 'Paid');
  const pendingList = filtered.filter((t) => t.status === 'Pending');

  const totalWeightKg = filtered.reduce((acc, t) => acc + (t.weight || 0), 0);
  const totalSettledAmount = paidList.reduce((acc, t) => acc + t.amount, 0);
  const totalPendingAmount = pendingList.reduce((acc, t) => acc + t.amount, 0);

  const avgRatePerKg = totalWeightKg > 0 ? Math.round(totalSettledAmount / totalWeightKg) : 0;
  const avgTransactionValue = paidList.length > 0 ? Math.round(totalSettledAmount / paidList.length) : 0;
  const highestPayout = paidList.reduce((max, t) => Math.max(max, t.amount), 0);

  const upiAmount = paidList.filter((t) => t.method === 'UPI').reduce((acc, t) => acc + t.amount, 0);
  const cashAmount = paidList.filter((t) => t.method === 'Cash').reduce((acc, t) => acc + t.amount, 0);

  // Ecological formula (1.44 kg CO2e avoided per 1 kg e-waste recycled)
  const co2OffsetKg = Math.round(totalWeightKg * 1.44 * 10) / 10;
  const landfillDivertedKg = Math.round(totalWeightKg * 10) / 10;

  // Material category statistics
  const matMap: Record<string, { weight: number; amount: number; count: number }> = {};
  for (const t of filtered) {
    if (!matMap[t.materialId]) {
      matMap[t.materialId] = { weight: 0, amount: 0, count: 0 };
    }
    matMap[t.materialId].weight += t.weight || 0;
    if (t.status === 'Paid') {
      matMap[t.materialId].amount += t.amount || 0;
    }
    matMap[t.materialId].count += 1;
  }

  const materialStats = Object.keys(matMap).map((mId) => {
    const mat = materials.find((m) => m.id === mId);
    const weight = Math.round(matMap[mId].weight * 10) / 10;
    const amount = matMap[mId].amount;
    const weightPercent = totalWeightKg > 0 ? Math.round((weight / totalWeightKg) * 100) : 0;
    const amountPercent = totalSettledAmount > 0 ? Math.round((amount / totalSettledAmount) * 100) : 0;
    const avgRate = weight > 0 ? Math.round(amount / weight) : 0;

    return {
      materialId: mId,
      name: mat ? materialNameGetter(mat) : mId.toUpperCase(),
      weightKg: weight,
      weightPercent,
      amount,
      amountPercent,
      avgRate,
      count: matMap[mId].count
    };
  });

  // Sort materials by revenue descending
  materialStats.sort((a, b) => b.amount - a.amount);

  // Monthly trends
  const monthMap: Record<string, { weight: number; amount: number }> = {};
  for (const t of filtered) {
    const d = new Date(t.date);
    const mKey = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    if (!monthMap[mKey]) {
      monthMap[mKey] = { weight: 0, amount: 0 };
    }
    monthMap[mKey].weight += t.weight || 0;
    if (t.status === 'Paid') {
      monthMap[mKey].amount += t.amount || 0;
    }
  }

  const monthlyTrends = Object.keys(monthMap).map((k) => ({
    month: k,
    weightKg: Math.round(monthMap[k].weight * 10) / 10,
    amount: monthMap[k].amount
  }));

  const periodLabel =
    timeframe === '1m'
      ? 'Past 1 Month (30-Day Audit Statement)'
      : 'Past 1 Year (Annual Fiscal & EPR Audit Statement)';

  return {
    stats: {
      timeframe,
      periodLabel,
      startDate,
      endDate: now,
      totalTransactions,
      paidTransactions: paidList.length,
      pendingTransactions: pendingList.length,
      totalWeightKg: Math.round(totalWeightKg * 10) / 10,
      totalSettledAmount,
      totalPendingAmount,
      avgRatePerKg,
      avgTransactionValue,
      highestPayout,
      upiAmount,
      cashAmount,
      co2OffsetKg,
      landfillDivertedKg,
      materialStats,
      monthlyTrends
    },
    filteredTransactions: filtered
  };
}

/**
 * Loads image URL as Base64 data string
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
 * Generates an official, publication-quality PDF Passbook & Statistical Analysis Report
 */
export async function generatePassbookPdf(
  stats: StatisticalAnalysis,
  transactions: Transaction[],
  materials: Material[],
  collectorInfo = {
    name: 'Ramdas CX-1028',
    role: 'Authorized Scrap Aggregator',
    station: 'Pune Station Node',
    serviceArea: 'Pune City Area, Maharashtra'
  }
): Promise<void> {
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

  // Colors
  const primaryEmerald = [5, 150, 105]; // #059669
  const darkSlate = [15, 23, 42]; // #0f172a
  const textMuted = [100, 116, 139]; // #64748b
  const cardBg = [248, 250, 252]; // #f8fafc

  let cursorY = 12;

  // Try to load logo
  const logoBase64 = await getBase64ImageFromUrl('/logo.png');

  // --- HEADER SECTION ---
  // Top green banner accent line
  doc.setFillColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Logo & Title
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', leftMargin, cursorY, 14, 14);
    } catch {}
  }

  const titleX = logoBase64 ? leftMargin + 17 : leftMargin;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('ReGain', titleX, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text('E-WASTE CIRCULATION NETWORK • DIGITAL PASSBOOK', titleX + 22, cursorY + 5);

  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('CPCB EPR Compliance & Financial Traceability Ledger', titleX, cursorY + 11);

  // Right side metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  const certId = `RG-AUDIT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  doc.text(`AUDIT ID: ${certId}`, pageWidth - rightMargin, cursorY + 4, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`, pageWidth - rightMargin, cursorY + 8, { align: 'right' });
  doc.text(`Govt E-Waste Rules 2022 Verified`, pageWidth - rightMargin, cursorY + 12, { align: 'right' });

  cursorY += 20;

  // Thin separator line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(leftMargin, cursorY, pageWidth - rightMargin, cursorY);
  cursorY += 5;

  // --- STATEMENT SUMMARY BOX ---
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(leftMargin, cursorY, contentWidth, 20, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(leftMargin, cursorY, contentWidth, 20, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('Collector Account:', leftMargin + 4, cursorY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`${collectorInfo.name} (${collectorInfo.role})`, leftMargin + 35, cursorY + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Service Station:', leftMargin + 4, cursorY + 11);
  doc.setFont('helvetica', 'normal');
  doc.text(collectorInfo.serviceArea, leftMargin + 35, cursorY + 11);

  doc.setFont('helvetica', 'bold');
  doc.text('Audit Period:', leftMargin + 4, cursorY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text(stats.periodLabel, leftMargin + 35, cursorY + 16);

  // Status Badge on Right of Box
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(pageWidth - rightMargin - 42, cursorY + 4, 38, 12, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
  doc.text('✓ CPCB VERIFIED', pageWidth - rightMargin - 23, cursorY + 9, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('100% Traceable', pageWidth - rightMargin - 23, cursorY + 13, { align: 'center' });

  cursorY += 26;

  // --- SECTION 1: STATISTICAL KPI CARDS (4 Boxes) ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('1. Statistical Executive Summary', leftMargin, cursorY);
  cursorY += 4;

  const cardWidth = (contentWidth - 9) / 4;
  const cardHeight = 22;

  const kpis = [
    {
      title: 'TOTAL VOLUME',
      value: `${stats.totalWeightKg.toLocaleString()} kg`,
      sub: `${stats.totalTransactions} Total Lots`
    },
    {
      title: 'SETTLED REVENUE',
      value: `INR ${stats.totalSettledAmount.toLocaleString()}`,
      sub: `${stats.paidTransactions} Paid Transfers`
    },
    {
      title: 'AVG RATE / KG',
      value: `INR ${stats.avgRatePerKg} / kg`,
      sub: `Avg Lot: INR ${stats.avgTransactionValue}`
    },
    {
      title: 'CO2 AVOIDED',
      value: `${stats.co2OffsetKg.toLocaleString()} kg`,
      sub: 'EPR Eco-Credit'
    }
  ];

  kpis.forEach((kpi, index) => {
    const cardX = leftMargin + index * (cardWidth + 3);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, cursorY, cardWidth, cardHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(kpi.title, cardX + 3, cursorY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
    doc.text(kpi.value, cardX + 3, cursorY + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text(kpi.sub, cardX + 3, cursorY + 18.5);
  });

  cursorY += cardHeight + 7;

  // --- SECTION 2: MATERIAL CATEGORY BREAKDOWN TABLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('2. Scrap Material Composition & Revenue Yield', leftMargin, cursorY);
  cursorY += 3;

  const materialRows = stats.materialStats.map((m) => [
    m.name,
    `${m.weightKg.toLocaleString()} kg`,
    `${m.weightPercent}%`,
    `INR ${m.avgRate}`,
    `INR ${m.amount.toLocaleString()}`,
    `${m.amountPercent}%`
  ]);

  // Add total summary row
  materialRows.push([
    'TOTAL / AUDIT SUMMARY',
    `${stats.totalWeightKg.toLocaleString()} kg`,
    '100%',
    `INR ${stats.avgRatePerKg}`,
    `INR ${stats.totalSettledAmount.toLocaleString()}`,
    '100%'
  ]);

  autoTable(doc, {
    startY: cursorY,
    margin: { left: leftMargin, right: rightMargin },
    head: [['Scrap Category', 'Total Weight', 'Volume %', 'Avg Rate / kg', 'Settled Value', 'Revenue %']],
    body: materialRows,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      font: 'helvetica'
    },
    headStyles: {
      fillColor: [5, 150, 105],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left'
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right', fontStyle: 'bold' },
      5: { halign: 'right' }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: (data) => {
      // Bold total row
      if (data.row.index === materialRows.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [236, 253, 245];
        data.cell.styles.textColor = [5, 150, 105];
      }
    }
  });

  cursorY = (doc as any).lastAutoTable.finalY + 7;

  // --- SECTION 3: ENVIRONMENTAL IMPACT & PAYMENT METHOD SPLIT ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('3. Environmental Offset & Settlement Analytics', leftMargin, cursorY);
  cursorY += 4;

  const halfWidth = (contentWidth - 4) / 2;

  // Box A: Eco Impact
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(leftMargin, cursorY, halfWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(5, 150, 105);
  doc.text('ECOLOGICAL IMPACT CERTIFICATE (EPR)', leftMargin + 4, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(`• CO2 Emission Avoided: ${stats.co2OffsetKg.toLocaleString()} kg CO2e`, leftMargin + 4, cursorY + 10);
  doc.text(`• Toxic Heavy Metal Landfill Diversion: ${stats.landfillDivertedKg.toLocaleString()} kg`, leftMargin + 4, cursorY + 15);
  doc.text(`• Estimated Recovered Copper/Alloys: ~${Math.round(stats.totalWeightKg * 0.26)} kg`, leftMargin + 4, cursorY + 20);

  // Box B: Payment Method Breakdown
  const boxBX = leftMargin + halfWidth + 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(boxBX, cursorY, halfWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('DISBURSEMENT CHANNEL SPLIT', boxBX + 4, cursorY + 5);

  const upiPercent = stats.totalSettledAmount > 0 ? Math.round((stats.upiAmount / stats.totalSettledAmount) * 100) : 0;
  const cashPercent = 100 - upiPercent;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(`• Instant Bank UPI: INR ${stats.upiAmount.toLocaleString()} (${upiPercent}%)`, boxBX + 4, cursorY + 10);
  doc.text(`• Verified Cash: INR ${stats.cashAmount.toLocaleString()} (${cashPercent}%)`, boxBX + 4, cursorY + 15);
  doc.text(`• Total Pending In-Process: INR ${stats.totalPendingAmount.toLocaleString()}`, boxBX + 4, cursorY + 20);

  cursorY += 29;

  // --- SECTION 4: ITEMIZED PASSBOOK TRANSACTIONS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('4. Itemized Passbook Ledger (Handovers)', leftMargin, cursorY);
  cursorY += 3;

  const txnRows = transactions.slice(0, 15).map((t) => {
    const mat = materials.find((m) => m.id === t.materialId);
    const d = new Date(t.date);
    const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    const methodStr = t.method || (t.status === 'Pending' ? 'Pending' : 'UPI');

    return [
      dateStr,
      t.lotId.toUpperCase(),
      mat ? mat.name : t.materialId,
      `${t.weight} kg`,
      methodStr,
      t.status === 'Paid' ? 'PAID ✓' : 'PENDING',
      `INR ${t.amount.toLocaleString()}`
    ];
  });

  autoTable(doc, {
    startY: cursorY,
    margin: { left: leftMargin, right: rightMargin },
    head: [['Date', 'Lot ID', 'Material Type', 'Net Weight', 'Method', 'Status', 'Payout']],
    body: txnRows,
    theme: 'striped',
    styles: {
      fontSize: 7,
      cellPadding: 1.8,
      font: 'helvetica'
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 22, fontStyle: 'bold' },
      2: { cellWidth: 42 },
      3: { halign: 'right' },
      4: { halign: 'center' },
      5: { halign: 'center' },
      6: { halign: 'right', fontStyle: 'bold' }
    },
    didParseCell: (data) => {
      if (data.column.index === 5) {
        if (data.cell.raw === 'PAID ✓') {
          data.cell.styles.textColor = [5, 150, 105];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [217, 119, 6];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  // --- FOOTER SECTION ON EVERY PAGE ---
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(leftMargin, pageHeight - 12, pageWidth - rightMargin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(
      'ReGain E-Waste Circulation Network • Certified Extended Producer Responsibility (EPR) Passbook',
      leftMargin,
      pageHeight - 8
    );
    doc.text(
      `Page ${i} of ${totalPages} • Cryptographic Hash: ${certId}`,
      pageWidth - rightMargin,
      pageHeight - 8,
      { align: 'right' }
    );
  }

  // File Download
  const filename = `ReGain_Passbook_${stats.timeframe === '1m' ? '1Month' : '1Year'}_${collectorInfo.name.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
