import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockMaterials, mockRecyclers, mockTransactions, mockLots } from '../data/mockData';
import type { Material, Recycler, Transaction, Lot } from '../data/mockData';

export type Role = 'collector' | 'recycler' | null;
export type Language = 'en' | 'hi' | 'mr';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  isSpeaking: boolean;
  speak: (text: string, overrideLang?: Language) => void;
  stopSpeaking: () => void;
  materials: Material[];
  updateMaterialPrice: (id: string, newPrice: number) => void;
  recyclers: Recycler[];
  updateRecyclerOffer: (recyclerId: string, materialId: string, price: number) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  lots: Lot[];
  addLot: (lot: Lot) => void;
  updateLot: (id: string, updates: Partial<Lot>) => void;
  syncQueue: any[];
  addToSyncQueue: (action: any) => void;
  processSyncQueue: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isOnline, setIsOnline] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [recyclers, setRecyclers] = useState<Recycler[]>(mockRecyclers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [lots, setLots] = useState<Lot[]>(mockLots);
  
  const [syncQueue, setSyncQueue] = useState<any[]>([]);

  const speak = (text: string, overrideLang?: Language) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = overrideLang || language;
    if (targetLang === 'hi') utterance.lang = 'hi-IN';
    else if (targetLang === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';
    
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const updateMaterialPrice = (id: string, newPrice: number) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, basePrice: newPrice } : m));
  };

  const updateRecyclerOffer = (recyclerId: string, materialId: string, price: number) => {
    setRecyclers(prev => prev.map(r => {
      if (r.id === recyclerId) {
        return {
          ...r,
          offers: { ...r.offers, [materialId]: price }
        };
      }
      return r;
    }));
  };

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
      setTimeout(() => {
        setSyncQueue([]);
      }, 1200);
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
      isSpeaking, speak, stopSpeaking,
      materials, updateMaterialPrice,
      recyclers, updateRecyclerOffer,
      transactions, addTransaction,
      lots, addLot, updateLot,
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

