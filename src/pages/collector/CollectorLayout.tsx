import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, IndianRupee, Recycle, FileText, User, WifiOff } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const CollectorLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOnline, syncQueue } = useAppContext();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/collector' },
    { id: 'prices', icon: IndianRupee, label: 'Prices', path: '/collector/prices' },
    { id: 'recyclers', icon: Recycle, label: 'Recyclers', path: '/collector/recyclers' },
    { id: 'earnings', icon: FileText, label: 'Earnings', path: '/collector/earnings' },
    { id: 'profile', icon: User, label: 'Profile', path: '/collector/profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 md:max-w-md md:mx-auto md:border-x md:shadow-2xl overflow-hidden relative">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-red-500 text-white px-4 py-2 flex items-center justify-between text-sm font-medium z-50">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4" />
            <span>Offline Mode</span>
          </div>
          {syncQueue.length > 0 && (
            <span className="bg-red-600 px-2 py-0.5 rounded-full text-xs">
              {syncQueue.length} items waiting to sync
            </span>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/collector' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-2 rounded-xl transition-colors min-w-[64px] ${isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-500'}`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-green-100' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CollectorLayout;
