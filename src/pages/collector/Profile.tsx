import React from 'react';
import { User, LogOut, ShieldAlert, Volume2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { setRole } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  const safetyItems = [
    { icon: '🔥', title: 'Do not burn wires', desc: 'Burning releases toxic fumes.' },
    { icon: '☣️', title: 'No acid recovery', desc: 'Acid is dangerous and illegal.' },
    { icon: '🔋', title: 'Do not break batteries', desc: 'Avoid leaks and explosions.' },
    { icon: '🧤', title: 'Use gloves', desc: 'Protect hands from sharp objects.' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      <div className="bg-white p-4 border-b border-gray-100 flex items-center shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Profile & Safety</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-green-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Raju Scrap Co.</h2>
          <p className="text-gray-500 font-medium">ID: COL-1028</p>
          <div className="w-full mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded-2xl">
              <p className="text-xs text-gray-500">Area</p>
              <p className="font-bold text-gray-900">Pune</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl">
              <p className="text-xs text-gray-500">Transactions</p>
              <p className="font-bold text-gray-900">42</p>
            </div>
          </div>
        </div>

        {/* Safety Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <ShieldAlert className="w-5 h-5 text-orange-500 mr-2" /> Stay Safe
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {safetyItems.map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center text-center space-y-2 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-green-600">
                  <Volume2 className="w-4 h-4" />
                </button>
                <div className="text-4xl">{item.icon}</div>
                <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-white text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 border border-red-100 active:scale-95 transition-transform"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
