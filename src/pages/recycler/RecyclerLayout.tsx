import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Inbox, FileCheck, IndianRupee, Map, Settings, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const RecyclerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setRole } = useAppContext();

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/recycler' },
    { id: 'lots', icon: Inbox, label: 'Incoming Lots', path: '/recycler/lots' },
    { id: 'offers', icon: FileCheck, label: 'My Offers', path: '/recycler/offers' },
    { id: 'traceability', icon: Map, label: 'Traceability', path: '/recycler/traceability' },
    { id: 'prices', icon: IndianRupee, label: 'Price Management', path: '/recycler/prices' },
    { id: 'settings', icon: Settings, label: 'Facility Profile', path: '/recycler/settings' },
  ];

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-700 tracking-tight">ECOSETU</h2>
          <p className="text-sm text-gray-500 mt-1">Recycler Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/recycler' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {sidebarItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">GreenCycle Recycling</p>
              <p className="text-xs text-green-600">Authorized Partner ✓</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
              GC
            </div>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RecyclerLayout;
