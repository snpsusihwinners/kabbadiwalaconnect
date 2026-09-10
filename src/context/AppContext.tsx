import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockMaterials, mockRecyclers, mockTransactions, mockLots } from '../data/mockData';
import type { Material, Recycler, Transaction, Lot } from '../data/mockData';

type Role = 'collector' | 'recycler' | null;
type Language = 'en' | 'hi' | 'mr';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  materials: Material[];
  recyclers: Recycler[];
  transactions: Transaction[];
  lots: Lot[];
  addLot: (lot: Lot) => void;
  updateLot: (id: string, updates: Partial<Lot>) => void;
  addTransaction: (transaction: Transaction) => void;
  syncQueue: any[];
  addToSyncQueue: (action: any) => void;
  processSyncQueue: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isOnline, setIsOnline] = useState(true);
  
  const [materials] = useState<Material[]>(mockMaterials);
  const [recyclers] = useState<Recycler[]>(mockRecyclers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [lots, setLots] = useState<Lot[]>(mockLots);
  
  const [syncQueue, setSyncQueue] = useState<any[]>([]);

  const addLot = (lot: Lot) => {
    setLots(prev => [lot, ...prev]);
  };

  const updateLot = (id: string, updates: Partial<Lot>) => {
    setLots(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const addToSyncQueue = (action: any) => {
    setSyncQueue(prev => [...prev, action]);
  };

  const processSyncQueue = () => {
    if (syncQueue.length > 0) {
      // Simulate sync delay
      setTimeout(() => {
        setSyncQueue([]);
        alert(`${syncQueue.length} items synced successfully!`);
      }, 1500);
    }
  };

  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      processSyncQueue();
    }
  }, [isOnline]);

  return (
    <AppContext.Provider value={{
      role, setRole,
      language, setLanguage,
      isOnline, setIsOnline,
      materials, recyclers, transactions, lots,
      addLot, updateLot, addTransaction,
      syncQueue, addToSyncQueue, processSyncQueue
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
