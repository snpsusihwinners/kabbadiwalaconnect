export interface Material {
  id: string;
  name: string;
  category: 'e-waste' | 'metals' | 'batteries' | 'plastics';
  grade: string;
  hsnCode: string;
  tagHindi: string;
  tagMarathi: string;
  icon: string;
  basePrice: number;
  unit: string;
  trend: number; // percentage change in last 24h
  purityBenchmark: string;
  minLotKg: number;
}

export interface Recycler {
  id: string;
  name: string;
  legalEntity: string;
  cpcbReg: string;
  authorized: boolean;
  distance: number;
  rating: number;
  reviewsCount: number;
  address: string;
  city: string;
  acceptedMaterials: string[];
  pickup: boolean;
  offers: Record<string, number>;
  dailyCapacityTons: number;
  weighbridgeCertified: boolean;
  phone: string;
}

export interface Transaction {
  id: string;
  ticketNo: string;
  lotId: string;
  materialId: string;
  grossWeight: number;
  tareWeight: number;
  weight: number; // Net weight
  ratePerKg: number;
  amount: number;
  date: string;
  status: 'Pending' | 'Paid';
  method?: 'Cash' | 'UPI' | 'IMPS';
  utrRef?: string;
}

export interface Lot {
  id: string;
  manifestNo: string;
  materialId: string;
  grossWeight?: number;
  tareWeight?: number;
  weight: number;
  condition: 'Good' | 'Used' | 'Damaged' | 'Mixed';
  source: 'Household' | 'Commercial' | 'Industrial' | 'Mandi Collection';
  estimatedValueRange: [number, number];
  status: 'Created' | 'Offer Accepted' | 'Handover Completed';
  createdAt: string;
  collectorId: string;
  collectorName: string;
  recyclerId?: string;
  finalPrice?: number;
  ratePerKg?: number;
  gpsLocation?: string;
  vehicleNo?: string;
}

export const mockMaterials: Material[] = [
  {
    id: 'm1',
    name: 'Printed Circuit Board (PCB)',
    category: 'e-waste',
    grade: 'Class-A (Motherboard / Telecom)',
    hsnCode: '8548.10.10',
    tagHindi: 'मदरबोर्ड / आईसी प्लेट',
    tagMarathi: 'मदरबोर्ड / आयसी प्लेट',
    icon: 'circuit-board',
    basePrice: 240,
    unit: 'kg',
    trend: 3.4,
    purityBenchmark: 'High Gold/Cu Contact Assay',
    minLotKg: 2,
  },
  {
    id: 'm2',
    name: 'Bright Copper Cable',
    category: 'metals',
    grade: 'Millberry 99.9% Stripped',
    hsnCode: '7404.00.12',
    tagHindi: 'शुद्ध तांबा वायर',
    tagMarathi: 'शुद्ध तांबे वायर',
    icon: 'zap',
    basePrice: 620,
    unit: 'kg',
    trend: 1.8,
    purityBenchmark: 'Electrolytic Grade A (No PVC)',
    minLotKg: 5,
  },
  {
    id: 'm3',
    name: 'Li-Ion Battery Packs',
    category: 'batteries',
    grade: 'NMC / LFP Pouch & Cylindrical',
    hsnCode: '8506.90.00',
    tagHindi: 'लिथियम आयन बैटरी',
    tagMarathi: 'लिथियम आयन बॅटरी',
    icon: 'battery-charging',
    basePrice: 110,
    unit: 'kg',
    trend: -0.5,
    purityBenchmark: 'Cobalt/Nickel Recovery Grade',
    minLotKg: 5,
  },
  {
    id: 'm4',
    name: 'Electric Motor Scrap',
    category: 'metals',
    grade: 'Heavy Stator Core with Cu Winding',
    hsnCode: '7204.49.00',
    tagHindi: 'तांबा मोटर वाइंडिंग',
    tagMarathi: 'मोटर वाइंडिंग भंगार',
    icon: 'cog',
    basePrice: 165,
    unit: 'kg',
    trend: 0.0,
    purityBenchmark: 'Cu Content > 14% Net',
    minLotKg: 10,
  },
  {
    id: 'm5',
    name: 'LCD & LED Panels',
    category: 'e-waste',
    grade: 'CCFL / LED Backlit Screens',
    hsnCode: '8529.90.90',
    tagHindi: 'एलईडी / एलसीडी स्क्रीन',
    tagMarathi: 'एलईडी / एलसीडी स्क्रीन',
    icon: 'tv',
    basePrice: 65,
    unit: 'kg',
    trend: -2.1,
    purityBenchmark: 'Glass & Diffuser Intact',
    minLotKg: 5,
  },
  {
    id: 'm6',
    name: 'CRT Monitor Glass & Chassis',
    category: 'e-waste',
    grade: 'Funnel & Panel Leaded Glass',
    hsnCode: '8540.11.00',
    tagHindi: 'पुराना मॉनिटर सीआरटी',
    tagMarathi: 'जुन्या मॉनिटर सीआरटी',
    icon: 'monitor',
    basePrice: 38,
    unit: 'kg',
    trend: 0.0,
    purityBenchmark: 'CPCB Haz-Safe Neutralized',
    minLotKg: 15,
  },
  {
    id: 'm7',
    name: 'Neodymium Magnet Assemblies',
    category: 'metals',
    grade: 'NdFeB Hard Drive / Speaker Rotor',
    hsnCode: '8505.11.10',
    tagHindi: 'दुर्लभ चुंबक स्क्रैप',
    tagMarathi: 'चुंबक असेंब्ली',
    icon: 'magnet',
    basePrice: 130,
    unit: 'kg',
    trend: 4.2,
    purityBenchmark: 'Rare Earth Concentrated',
    minLotKg: 1,
  },
  {
    id: 'm8',
    name: 'Engineered Rigid Plastics (ABS/PC)',
    category: 'plastics',
    grade: 'Computer Casing & Polycarbonate',
    hsnCode: '3915.90.90',
    tagHindi: 'कड़ा प्लास्टिक (एबीएस/पीसी)',
    tagMarathi: 'कठिण प्लास्टिक',
    icon: 'shield',
    basePrice: 42,
    unit: 'kg',
    trend: 0.8,
    purityBenchmark: 'Flame Retardant Sorted',
    minLotKg: 20,
  },
];

export const mockRecyclers: Recycler[] = [
  {
    id: 'r1',
    name: 'GreenCycle Circular Technologies',
    legalEntity: 'GreenCycle Eco Solutions Pvt. Ltd.',
    cpcbReg: 'CPCB/E-WASTE/2024/MH-0814',
    authorized: true,
    distance: 4.8,
    rating: 4.9,
    reviewsCount: 142,
    address: 'Plot 42, Bhosari MIDC, Sector 7',
    city: 'Pune',
    acceptedMaterials: ['m1', 'm2', 'm3', 'm4', 'm7'],
    pickup: true,
    offers: { 'm1': 250, 'm2': 635, 'm3': 118, 'm4': 172, 'm7': 135 },
    dailyCapacityTons: 18.5,
    weighbridgeCertified: true,
    phone: '+91 98220 14890',
  },
  {
    id: 'r2',
    name: 'EcoTech Industrial E-Waste Refiners',
    legalEntity: 'EcoTech Green Recovery LLP',
    cpcbReg: 'CPCB/HW/2023/MH-0291',
    authorized: true,
    distance: 11.2,
    rating: 4.6,
    reviewsCount: 88,
    address: 'Survey 104, Phase 2, Hinjewadi IT Corridor',
    city: 'Pune',
    acceptedMaterials: ['m1', 'm3', 'm5', 'm8'],
    pickup: false,
    offers: { 'm1': 245, 'm3': 112, 'm5': 68, 'm8': 45 },
    dailyCapacityTons: 12.0,
    weighbridgeCertified: true,
    phone: '+91 98901 55210',
  },
  {
    id: 'r3',
    name: 'MahaScrap Apex Hub',
    legalEntity: 'MahaScrap Reclamation Co-Op',
    cpcbReg: 'SPCB/PUN/FORM6/2025-1102',
    authorized: true,
    distance: 2.9,
    rating: 4.3,
    reviewsCount: 215,
    address: 'Ganj Peth Scrap Yard, Timber Market Road',
    city: 'Pune',
    acceptedMaterials: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'],
    pickup: true,
    offers: { 'm1': 235, 'm2': 610, 'm3': 105, 'm4': 160, 'm5': 62, 'm6': 36, 'm7': 125, 'm8': 40 },
    dailyCapacityTons: 25.0,
    weighbridgeCertified: true,
    phone: '+91 94223 90812',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    ticketNo: 'KP-2026-0910-41',
    lotId: 'l1',
    materialId: 'm1',
    grossWeight: 9.4,
    tareWeight: 1.2,
    weight: 8.2,
    ratePerKg: 250,
    amount: 2050,
    date: '2026-09-10T12:00:00Z',
    status: 'Paid',
    method: 'UPI',
    utrRef: 'UPI/62541098231/YESB',
  },
  {
    id: 't2',
    ticketNo: 'KP-2026-0908-19',
    lotId: 'l2',
    materialId: 'm2',
    grossWeight: 15.6,
    tareWeight: 0.6,
    weight: 15.0,
    ratePerKg: 630,
    amount: 9450,
    date: '2026-09-08T10:30:00Z',
    status: 'Paid',
    method: 'Cash',
  },
  {
    id: 't3',
    ticketNo: 'KP-2026-0905-82',
    lotId: 'l3',
    materialId: 'm3',
    grossWeight: 21.0,
    tareWeight: 1.0,
    weight: 20.0,
    ratePerKg: 115,
    amount: 2300,
    date: '2026-09-05T14:15:00Z',
    status: 'Pending',
  },
];

export const mockLots: Lot[] = [
  {
    id: 'l1',
    manifestNo: 'FORM-6/MH/2026/8841',
    materialId: 'm1',
    grossWeight: 9.4,
    tareWeight: 1.2,
    weight: 8.2,
    condition: 'Mixed',
    source: 'Commercial',
    estimatedValueRange: [1950, 2150],
    status: 'Handover Completed',
    createdAt: '2026-09-10T11:00:00Z',
    collectorId: 'COL-1028',
    collectorName: 'Raju Scrap Co.',
    recyclerId: 'r1',
    finalPrice: 2050,
    ratePerKg: 250,
    gpsLocation: '18.5204° N, 73.8567° E (Pune Central)',
    vehicleNo: 'MH-12-QB-4819',
  },
  {
    id: 'l2',
    manifestNo: 'FORM-6/MH/2026/8710',
    materialId: 'm2',
    grossWeight: 15.6,
    tareWeight: 0.6,
    weight: 15.0,
    condition: 'Good',
    source: 'Industrial',
    estimatedValueRange: [9200, 9600],
    status: 'Handover Completed',
    createdAt: '2026-09-08T09:00:00Z',
    collectorId: 'COL-1028',
    collectorName: 'Raju Scrap Co.',
    recyclerId: 'r1',
    finalPrice: 9450,
    ratePerKg: 630,
    gpsLocation: '18.6298° N, 73.7997° E (Bhosari)',
    vehicleNo: 'MH-14-AX-1022',
  },
  {
    id: 'l3',
    manifestNo: 'FORM-6/MH/2026/8604',
    materialId: 'm3',
    grossWeight: 21.0,
    tareWeight: 1.0,
    weight: 20.0,
    condition: 'Used',
    source: 'Household',
    estimatedValueRange: [2100, 2400],
    status: 'Offer Accepted',
    createdAt: '2026-09-05T13:00:00Z',
    collectorId: 'COL-1028',
    collectorName: 'Raju Scrap Co.',
    recyclerId: 'r2',
    finalPrice: 2300,
    ratePerKg: 115,
    gpsLocation: '18.5913° N, 73.7389° E (Hinjewadi)',
  },
  {
    id: 'l4',
    manifestNo: 'FORM-6/MH/2026/8912',
    materialId: 'm4',
    grossWeight: 42.5,
    tareWeight: 2.5,
    weight: 40.0,
    condition: 'Used',
    source: 'Industrial',
    estimatedValueRange: [6400, 6800],
    status: 'Created',
    createdAt: '2026-09-10T16:20:00Z',
    collectorId: 'COL-1028',
    collectorName: 'Raju Scrap Co.',
    gpsLocation: '18.5089° N, 73.8612° E (Swargate Mandi)',
  }
];

