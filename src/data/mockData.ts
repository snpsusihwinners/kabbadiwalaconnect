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
  { id: 't2', lotId: 'l2', materialId: 'm5', weight: 15.0, amount: 8850, date: '2026-09-08T10:30:00Z', status: 'Paid', method: 'UPI' },
  { id: 't3', lotId: 'l3', materialId: 'm4', weight: 20.0, amount: 1900, date: '2026-09-05T14:15:00Z', status: 'Pending' },
  { id: 't4', lotId: 'l4', materialId: 'm1', weight: 35.0, amount: 1400, date: '2026-08-28T09:45:00Z', status: 'Paid', method: 'UPI' },
  { id: 't5', lotId: 'l5', materialId: 'm3', weight: 12.0, amount: 2760, date: '2026-08-22T16:20:00Z', status: 'Paid', method: 'Cash' },
  { id: 't6', lotId: 'l6', materialId: 'm5', weight: 8.5, amount: 5015, date: '2026-08-16T11:10:00Z', status: 'Paid', method: 'UPI' },
  { id: 't7', lotId: 'l7', materialId: 'm6', weight: 18.0, amount: 2700, date: '2026-08-10T15:30:00Z', status: 'Paid', method: 'Cash' },
  // Historical past year transactions
  { id: 't8', lotId: 'l8', materialId: 'm4', weight: 25.0, amount: 2375, date: '2026-07-25T13:00:00Z', status: 'Paid', method: 'UPI' },
  { id: 't9', lotId: 'l9', materialId: 'm3', weight: 14.0, amount: 3220, date: '2026-07-14T10:15:00Z', status: 'Paid', method: 'UPI' },
  { id: 't10', lotId: 'l10', materialId: 'm5', weight: 22.0, amount: 12980, date: '2026-06-29T17:40:00Z', status: 'Paid', method: 'UPI' },
  { id: 't11', lotId: 'l11', materialId: 'm8', weight: 45.0, amount: 1575, date: '2026-06-12T11:50:00Z', status: 'Paid', method: 'Cash' },
  { id: 't12', lotId: 'l12', materialId: 'm7', weight: 16.0, amount: 1760, date: '2026-05-20T14:25:00Z', status: 'Paid', method: 'UPI' },
  { id: 't13', lotId: 'l13', materialId: 'm3', weight: 10.5, amount: 2415, date: '2026-05-04T09:10:00Z', status: 'Paid', method: 'Cash' },
  { id: 't14', lotId: 'l14', materialId: 'm2', weight: 28.0, amount: 1680, date: '2026-04-18T16:00:00Z', status: 'Paid', method: 'UPI' },
  { id: 't15', lotId: 'l15', materialId: 'm5', weight: 12.0, amount: 7080, date: '2026-04-02T12:35:00Z', status: 'Paid', method: 'UPI' },
  { id: 't16', lotId: 'l16', materialId: 'm4', weight: 30.0, amount: 2850, date: '2026-03-21T10:45:00Z', status: 'Paid', method: 'Cash' },
  { id: 't17', lotId: 'l17', materialId: 'm3', weight: 9.0, amount: 2070, date: '2026-02-15T15:20:00Z', status: 'Paid', method: 'UPI' },
  { id: 't18', lotId: 'l18', materialId: 'm6', weight: 24.0, amount: 3600, date: '2026-01-28T11:00:00Z', status: 'Paid', method: 'UPI' },
  { id: 't19', lotId: 'l19', materialId: 'm5', weight: 18.0, amount: 10620, date: '2026-01-10T14:30:00Z', status: 'Paid', method: 'UPI' },
  { id: 't20', lotId: 'l20', materialId: 'm1', weight: 40.0, amount: 1600, date: '2025-12-19T09:15:00Z', status: 'Paid', method: 'Cash' },
  { id: 't21', lotId: 'l21', materialId: 'm3', weight: 15.0, amount: 3450, date: '2025-11-25T13:40:00Z', status: 'Paid', method: 'UPI' },
  { id: 't22', lotId: 'l22', materialId: 'm4', weight: 18.0, amount: 1710, date: '2025-11-08T10:00:00Z', status: 'Paid', method: 'Cash' },
  { id: 't23', lotId: 'l23', materialId: 'm5', weight: 14.0, amount: 8260, date: '2025-10-14T16:15:00Z', status: 'Paid', method: 'UPI' }
];

export const mockLots: Lot[] = [
  { id: 'l1', materialId: 'm3', weight: 8.2, condition: 'Mixed', source: 'Shop', estimatedValueRange: [1750, 1950], status: 'Handover Completed', createdAt: '2026-09-10T11:00:00Z', collectorId: 'COL-1028', recyclerId: 'r1', finalPrice: 1900 },
  { id: 'l2', materialId: 'm5', weight: 15.0, condition: 'Good', source: 'Industrial', estimatedValueRange: [8500, 8900], status: 'Handover Completed', createdAt: '2026-09-08T09:00:00Z', collectorId: 'COL-1028', recyclerId: 'r1', finalPrice: 8850 },
  { id: 'l3', materialId: 'm4', weight: 20.0, condition: 'Used', source: 'Household', estimatedValueRange: [1800, 2000], status: 'Offer Accepted', createdAt: '2026-09-05T13:00:00Z', collectorId: 'COL-1028', recyclerId: 'r2' },
  { id: 'l4', materialId: 'm1', weight: 35.0, condition: 'Fair', source: 'Service Center', estimatedValueRange: [1300, 1500], status: 'Handover Completed', createdAt: '2026-08-28T09:00:00Z', collectorId: 'COL-1028', recyclerId: 'r1', finalPrice: 1400 },
  { id: 'l5', materialId: 'm3', weight: 12.0, condition: 'Grade A', source: 'Shop', estimatedValueRange: [2600, 2900], status: 'Handover Completed', createdAt: '2026-08-22T15:00:00Z', collectorId: 'COL-1028', recyclerId: 'r2', finalPrice: 2760 },
  { id: 'l6', materialId: 'm5', weight: 8.5, condition: 'Bright', source: 'Contractor', estimatedValueRange: [4800, 5200], status: 'Handover Completed', createdAt: '2026-08-16T10:00:00Z', collectorId: 'COL-1028', recyclerId: 'r1', finalPrice: 5015 },
  { id: 'l7', materialId: 'm6', weight: 18.0, condition: 'Heavy', source: 'Workshop', estimatedValueRange: [2500, 2800], status: 'Handover Completed', createdAt: '2026-08-10T14:00:00Z', collectorId: 'COL-1028', recyclerId: 'r2', finalPrice: 2700 }
];
