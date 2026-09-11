import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  textClassName?: string;
  subtitle?: string;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  textClassName = '',
  subtitle,
  light = false,
}) => {
  const sizeMap = {
    xs: { img: 'w-6 h-6 rounded-md', text: 'text-sm' },
    sm: { img: 'w-8 h-8 rounded-lg', text: 'text-base' },
    md: { img: 'w-9 h-9 rounded-xl', text: 'text-lg' },
    lg: { img: 'w-12 h-12 rounded-2xl', text: 'text-2xl' },
    xl: { img: 'w-16 h-16 rounded-2xl', text: 'text-3xl' },
  };

  const { img: imgSize, text: textSize } = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* Official ReGain Icon */}
      <div className={`${imgSize} overflow-hidden shadow-sm flex-shrink-0 bg-emerald-800`}>
        <img
          src="/logo.png"
          alt="ReGain Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight leading-none ${textSize} ${textClassName}`}>
            <span className="text-emerald-600">Re</span>
            <span className={light ? 'text-white' : 'text-slate-900'}>Gain</span>
          </div>
          {subtitle && (
            <p className={`text-[11px] font-medium leading-tight mt-0.5 ${light ? 'text-slate-400' : 'text-slate-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
