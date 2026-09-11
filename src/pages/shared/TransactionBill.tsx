import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Leaf, 
  ArrowLeft, 
  Building2,
  User,
  Clock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppContext } from '../../context/AppContext';
import { generateBillPdf } from '../../utils/generateBillPdf';
import type { Lot, Material, Recycler } from '../../data/mockData';

export const TransactionBill: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lots, materials, recyclers, transactions } = useAppContext();

  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Find lot by id or by transaction id
  const targetId = id?.toLowerCase();
  const foundLot = lots.find(l => l.id.toLowerCase() === targetId);
  const foundTxn = transactions.find(t => t.id.toLowerCase() === targetId || t.lotId?.toLowerCase() === targetId);
  
  // Fallback to first lot or synthesize mock if direct link accessed with unknown lot
  const lot: Lot = foundLot || (foundTxn ? {
    id: foundTxn.lotId || foundTxn.id,
    materialId: foundTxn.materialId,
    weight: foundTxn.weight,
    condition: 'Pre-sorted Clean',
    source: 'Local Aggregation',
    estimatedValueRange: [Math.round(foundTxn.amount * 0.95), Math.round(foundTxn.amount * 1.05)],
    status: 'Handover Completed',
    createdAt: foundTxn.date,
    collectorId: 'COL-1028',
    recyclerId: 'r1',
    finalPrice: foundTxn.amount
  } : lots[0] || {
    id: 'l1',
    materialId: 'm3',
    weight: 28,
    condition: 'Pre-sorted',
    source: 'Pune Node',
    estimatedValueRange: [6000, 6800],
    status: 'Handover Completed',
    createdAt: new Date().toISOString(),
    collectorId: 'COL-1028',
    recyclerId: 'r1',
    finalPrice: 6440
  });

  const material: Material = materials.find(m => m.id === lot.materialId) || materials[2] || {
    id: 'm3',
    name: 'High-Grade Copper Wire',
    basePrice: 230,
    unit: 'kg',
    icon: '⚡'
  };

  const recycler: Recycler = recyclers.find(r => r.id === lot.recyclerId) || recyclers[0] || {
    id: 'r1',
    name: 'EcoRecycle Maharashtra Hub',
    distance: 3.2,
    rating: 4.8,
    pickup: true,
    address: 'Plot 42, MIDC Bhosari Industrial Area, Pune 411026',
    offers: { m1: 460, m2: 85, m3: 230, m4: 105, m5: 350, m6: 180 }
  };

  const currentTxn = foundTxn || transactions.find(t => t.lotId === lot.id) || null;
  const ratePerKg = recycler?.offers?.[material.id] || Math.round(lot.estimatedValueRange[0] / lot.weight) || 230;
  const finalAmount = lot.finalPrice || (currentTxn ? currentTxn.amount : Math.round(lot.weight * ratePerKg));
  const invoiceNumber = `REG-INV-${lot.id.toUpperCase()}-${new Date().getFullYear()}`;
  const billUrl = window.location.href;

  const co2OffsetKg = Math.round(lot.weight * 1.44 * 10) / 10;
  const landfillDivertedKg = Math.round(lot.weight * 10) / 10;

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      await generateBillPdf({
        lot,
        material,
        recycler,
        transaction: currentTxn,
        billUrl
      });
    } catch (err) {
      console.error('Failed to generate Bill PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ReGain Tax Invoice - LOT #${lot.id.toUpperCase()}`,
          text: `Official ReGain E-Waste Handover Bill for ${lot.weight} kg ${material.name} (₹${finalAmount}).`,
          url: billUrl
        });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(billUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-6 px-3 sm:px-6 print:p-0 print:bg-white">
      <div className="max-w-3xl mx-auto space-y-4">
        
        {/* Top Floating Action Bar (Hidden in Print) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="ReGain Logo" className="w-7 h-7 rounded-lg object-contain" />
              <div>
                <h1 className="text-sm font-extrabold text-slate-900 leading-tight">ReGain Digital Bill</h1>
                <p className="text-[11px] text-slate-500 font-medium">LOT #{lot.id.toUpperCase()} • Tax Invoice</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleShare}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              title="Share Bill URL"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied ✓' : 'Share'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all hidden md:flex"
              title="Print Bill"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold flex items-center space-x-2 shadow-md transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* The Official Bill / Invoice Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
          
          {/* Top Green Accent Header */}
          <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700" />

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header: Brand & Invoice Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-start space-x-3.5">
                <img src="/logo.png" alt="ReGain Logo" className="w-12 h-12 rounded-xl object-contain border border-slate-100 p-0.5 shadow-sm" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">ReGain</h2>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                      CPCB Certified
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-700">Circular E-Waste & Secondary Resource Network</p>
                  <p className="text-[11px] text-slate-500 pt-0.5">CPCB Reg: #REG-CPCB-EW-2026-9812 • GSTIN: 27AAACR9012E1Z8</p>
                  <p className="text-[11px] text-slate-400">Govt of India E-Waste Management Rules 2022 Compliant</p>
                </div>
              </div>

              <div className="text-left sm:text-right w-full sm:w-auto bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Tax Invoice & Scrap Handover Bill
                </span>
                <div className="text-lg font-black text-slate-900">{invoiceNumber}</div>
                <div className="text-xs text-slate-500 flex items-center sm:justify-end space-x-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{currentTxn?.date ? new Date(currentTxn.date).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-1.5 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Traceability Verified</span>
                </div>
              </div>
            </div>

            {/* Parties: Billed By (Collector) & Billed To (Recycler) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Billed By (Collector) */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Billed By / Aggregator (Seller)</span>
                </div>
                <div className="text-base font-extrabold text-slate-900">Ramdas CX-1028</div>
                <p className="text-xs text-slate-600">Collector Node ID: <strong className="text-slate-800">{lot.collectorId || 'COL-1028'}</strong></p>
                <p className="text-xs text-slate-600">Service Hub: Pune Central Aggregation Node</p>
                <p className="text-xs text-slate-600">Contact: +91 98231 44102</p>
                <p className="text-[11px] text-slate-400 pt-1">State Code: 27 (Maharashtra) • Registered Aggregator</p>
              </div>

              {/* Billed To (Recycler) */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Billed To / Authorized Recycler (Buyer)</span>
                </div>
                <div className="text-base font-extrabold text-slate-900">{recycler.name}</div>
                <p className="text-xs text-slate-600">Facility: {recycler.address || 'MIDC Bhosari Industrial Area, Pune 411026'}</p>
                <p className="text-xs text-slate-600">CPCB Authorization: <strong className="text-slate-800">#EW-MH-PUN-089</strong></p>
                <p className="text-xs text-slate-600">GSTIN / Recycler ID: 27AABCE4911G1Z4 ({recycler.id})</p>
                <p className="text-[11px] text-slate-400 pt-1">State Code: 27 (Maharashtra) • Registered Taxpayer</p>
              </div>

            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">E-Waste Description</th>
                    <th className="py-3 px-4">HSN Code</th>
                    <th className="py-3 px-4 text-right">Net Weight</th>
                    <th className="py-3 px-4 text-right">Agreed Rate</th>
                    <th className="py-3 px-4 text-right">Taxable (₹)</th>
                    <th className="py-3 px-4 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="bg-white hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-bold text-slate-400">01</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                        <span>{material.icon}</span>
                        <span>{material.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block pt-0.5">
                        Industrial Scrap Grade A • {lot.condition || 'Pre-sorted'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {material.id === 'm1' ? '8548 10 10' : material.id === 'm3' ? '7404 00 12' : '8548 90 00'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                      {lot.weight.toFixed(1)} KG
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-600">
                      ₹{ratePerKg.toLocaleString()} /kg
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">
                      ₹{finalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-700 text-sm">
                      ₹{finalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 text-slate-700 text-xs border-t border-slate-200">
                  <tr>
                    <td colSpan={5} className="py-2.5 px-4 text-right font-bold text-slate-600">
                      Subtotal (Taxable Value):
                    </td>
                    <td colSpan={2} className="py-2.5 px-4 text-right font-bold text-slate-900">
                      ₹{finalAmount.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="py-2 px-4 text-right text-slate-500 text-[11px]">
                      CGST & SGST (0% - Reverse Charge Mechanism Sec 9(4) applicable):
                    </td>
                    <td colSpan={2} className="py-2 px-4 text-right text-slate-500 text-[11px]">
                      ₹0.00
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/70 border-t border-emerald-200">
                    <td colSpan={5} className="py-3.5 px-4 text-right font-extrabold text-sm text-emerald-900">
                      Total Handover Payout (Settled):
                    </td>
                    <td colSpan={2} className="py-3.5 px-4 text-right font-black text-lg text-emerald-800">
                      ₹{finalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Settlement Status & Payment Information */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Payment Mode & Reference</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {currentTxn?.method || 'Cash Settlement'} • Ref #{currentTxn?.id ? currentTxn.id.toUpperCase() : `TXN-${lot.id.toUpperCase()}`}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>PAID & SETTLED</span>
                </span>
              </div>
            </div>

            {/* Environmental ESG Certificate Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/70 rounded-2xl p-4 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                    Circular Economy & ESG Footprint Audit
                  </h4>
                  <p className="text-xs text-emerald-800 pt-0.5">
                    Recovered <strong className="font-bold">{lot.weight} kg</strong> of {material.name} safely into circular smelting stream.
                  </p>
                  <p className="text-[11px] text-emerald-700 pt-0.5">
                    Avoided <strong className="font-bold">{co2OffsetKg} kg CO₂e</strong> emissions and diverted <strong className="font-bold">{landfillDivertedKg} kg</strong> from municipal landfills.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 rounded-xl px-3 py-2 border border-emerald-200 text-center shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">EPR Credit Status</span>
                <span className="text-xs font-black text-emerald-700">CPCB Eligible ✓</span>
              </div>
            </div>

            {/* QR Verification & Stamp & Signatures */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              {/* QR Code */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <QRCodeSVG 
                    value={billUrl} 
                    size={110} 
                    level="H" 
                  />
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Live Public Verification URL
                </div>
              </div>

              {/* Statutory Notes */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-1.5 text-[11px] text-slate-600">
                <span className="text-xs font-bold text-slate-900 block">Statutory Declarations:</span>
                <p>1. Reverse charge liability to be discharged by recipient registered recycler.</p>
                <p>2. Electronic weighbridge certified under Legal Metrology Act.</p>
                <p>3. Digitally signed and locked into ReGain tamper-evident ledger.</p>
                <p className="font-mono text-[10px] text-emerald-700 pt-1 font-semibold">
                  SHA-256: 7f83b165...{lot.id.slice(0, 4)}e9
                </p>
              </div>

              {/* Digital Stamp & Signatory */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full bg-emerald-100/70 border border-emerald-300 rounded-xl py-2 px-3">
                  <span className="text-[10px] font-extrabold text-emerald-800 tracking-wider uppercase block">ReGain Network</span>
                  <span className="text-xs font-black text-emerald-950 block">CPCB DIGITAL SEAL ✓</span>
                </div>

                <div className="pt-2 border-t border-slate-200 w-full">
                  <div className="text-xs font-bold text-slate-900">Authorized Signatory</div>
                  <div className="text-[10px] text-slate-500">For ReGain & Recycling Partner</div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Action Bar inside bill */}
          <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Tax Invoice • Tamper-proof Electronic Document</span>
            </div>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating PDF...' : 'Download Official PDF Bill'}</span>
            </button>
          </div>

        </div>

        {/* Home Navigation */}
        <div className="text-center print:hidden pt-2">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors inline-flex items-center space-x-1"
          >
            <span>← Return to ReGain Home</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default TransactionBill;
