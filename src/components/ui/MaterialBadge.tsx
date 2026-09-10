import React from 'react';
import { Cpu, Zap, BatteryCharging, Cog, Tv, Monitor, Magnet, Layers, Box } from 'lucide-react';

interface MaterialBadgeProps {
  iconKey?: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const MaterialBadge: React.FC<MaterialBadgeProps> = ({
  iconKey,
  category = 'e-waste',
  size = 'md',
  className = ''
}) => {
  const getIcon = () => {
    switch (iconKey) {
      case 'circuit-board':
        return <Cpu className="w-full h-full text-emerald-700" />;
      case 'zap':
        return <Zap className="w-full h-full text-amber-600" />;
      case 'battery-charging':
        return <BatteryCharging className="w-full h-full text-emerald-600" />;
      case 'cog':
        return <Cog className="w-full h-full text-slate-700" />;
      case 'tv':
        return <Tv className="w-full h-full text-indigo-600" />;
      case 'monitor':
        return <Monitor className="w-full h-full text-blue-600" />;
      case 'magnet':
        return <Magnet className="w-full h-full text-rose-600" />;
      case 'shield':
        return <Layers className="w-full h-full text-teal-600" />;
      default:
        return <Box className="w-full h-full text-emerald-700" />;
    }
  };

  const getBgStyle = () => {
    switch (category) {
      case 'metals':
        return 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 text-amber-800 shadow-sm';
      case 'batteries':
        return 'bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-200 text-emerald-800 shadow-sm';
      case 'plastics':
        return 'bg-gradient-to-br from-cyan-50 to-sky-100 border-cyan-200 text-cyan-800 shadow-sm';
      case 'e-waste':
      default:
        return 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 text-emerald-900 shadow-sm';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 p-1.5 rounded-lg';
      case 'lg':
        return 'w-14 h-14 p-3 rounded-2xl';
      case 'xl':
        return 'w-16 h-16 p-3.5 rounded-3xl';
      case 'md':
      default:
        return 'w-11 h-11 p-2.5 rounded-xl';
    }
  };

  return (
    <div className={`inline-flex items-center justify-center border shrink-0 ${getBgStyle()} ${getSizeStyle()} ${className}`}>
      {getIcon()}
    </div>
  );
};
