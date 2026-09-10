export interface Material {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
  unit: string;
}

export interface Recycler {
  id: string;
  name: string;
  authorized: boolean;
  distance: number;
  rating: number;
  address: string;
  acceptedMaterials: string[];
  pickup: boolean;
  offers: Record<string, number>;
}

export interface Transaction {
  id: string;
  lotId: string;
  materialId: string;
  weight: number;
  amount: number;
  date: string;
  status: 'Pending' | 'Paid';
  method?: 'Cash' | 'UPI';
}

export interface Lot {
  id: string;
  materialId: string;
  weight: number;
  condition: string;
  source: string;
  estimatedValueRange: [number, number];
  status: 'Created' | 'Offer Accepted' | 'Handover Completed';
  createdAt: string;
  collectorId: string;
  recyclerId?: string;
  finalPrice?: number;
}

export const mockMaterials: Material[] = [
  { id: 'm1', name: 'CRT', icon: '🖥️', basePrice: 40, unit: 'kg' },
  { id: 'm2', name: 'LCD', icon: '📺', basePrice: 60, unit: 'kg' },
  { id: 'm3', name: 'PCB', icon: '🔌', basePrice: 220, unit: 'kg' },
  { id: 'm4', name: 'Battery', icon: '🔋', basePrice: 95, unit: 'kg' },
  { id: 'm5', name: 'Copper Cable', icon: '🔗', basePrice: 580, unit: 'kg' },
  { id: 'm6', name: 'Motor', icon: '⚙️', basePrice: 150, unit: 'kg' },
  { id: 'm7', name: 'Magnet Assembly', icon: '🧲', basePrice: 110, unit: 'kg' },
  { id: 'm8', name: 'Mixed Plastic', icon: '🧴', basePrice: 35, unit: 'kg' },
];

export const mockRecyclers: Recycler[] = [
  {
    id: 'r1',
    name: 'GreenCycle Recycling',
    authorized: true,
    distance: 8.5,
    rating: 4.7,
    address: 'Pune Industrial Area, Sector 4',
    acceptedMaterials: ['m1', 'm3', 'm4', 'm5'],
    pickup: true,
    offers: { 'm3': 230, 'm5': 590, 'm1': 45 }
  },
  {
    id: 'r2',
    name: 'EcoTech E-Waste',
    authorized: true,
    distance: 12.2,
    rating: 4.5,
    address: 'Hinjewadi Phase 2, Pune',
    acceptedMaterials: ['m2', 'm3', 'm6', 'm8'],
    pickup: false,
    offers: { 'm3': 225, 'm2': 65, 'm6': 155 }
  },
  {
    id: 'r3',
    name: 'ScrapPro',
    authorized: false,
    distance: 3.1,
    rating: 3.8,
    address: 'Shivaji Nagar, Pune',
    acceptedMaterials: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'],
    pickup: true,
    offers: { 'm3': 210, 'm5': 550, 'm4': 90 }
  }
];

export const mockTransactions: Transaction[] = [
  { id: 't1', lotId: 'l1', materialId: 'm3', weight: 8.2, amount: 1900, date: '2026-09-10T12:00:00Z', status: 'Paid', method: 'Cash' },
  { id: 't2', lotId: 'l2', materialId: 'm5', weight: 15, amount: 8850, date: '2026-09-08T10:30:00Z', status: 'Paid', method: 'UPI' },
  { id: 't3', lotId: 'l3', materialId: 'm4', weight: 20, amount: 1900, date: '2026-09-05T14:15:00Z', status: 'Pending' },
];

export const mockLots: Lot[] = [
  { id: 'l1', materialId: 'm3', weight: 8.2, condition: 'Mixed', source: 'Shop', estimatedValueRange: [1750, 1950], status: 'Handover Completed', createdAt: '2026-09-10T11:00:00Z', collectorId: 'COL-1028', recyclerId: 'r1', finalPrice: 1900 },
  { id: 'l2', materialId: 'm5', weight: 15, condition: 'Good', source: 'Industrial', estimatedValueRange: [8500, 8900], status: 'Handover Completed', createdAt: '2026-09-08T09:00:00Z', collectorId: 'COL-1028', recyclerId: 'r1', finalPrice: 8850 },
  { id: 'l3', materialId: 'm4', weight: 20, condition: 'Used', source: 'Household', estimatedValueRange: [1800, 2000], status: 'Offer Accepted', createdAt: '2026-09-05T13:00:00Z', collectorId: 'COL-1028', recyclerId: 'r2' },
];
