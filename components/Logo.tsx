
import React from 'react';

interface LogoProps {
  className?: string;
  showSlogan?: boolean;
  variant?: 'standard' | 'small' | 'document';
}

const Logo: React.FC<LogoProps> = ({ className = "", showSlogan = true, variant = 'standard' }) => {
  // Verfijnde configuratie voor verschillende contexten
  const configs = {
    standard: {
      svgWidth: 120,
      svgHeight: 80,
      titleSize: 'text-[32px]',
      sloganSize: 'text-[16px]',
      spacing: 'space-y-0',
      iconStroke: 1.5,
    },
    small: {
      svgWidth: 60,
      svgHeight: 40,
      titleSize: 'text-[16px]',
      sloganSize: 'text-[8px]',
      spacing: 'space-y-0',
      iconStroke: 1.2,
    },
    document: {
      // Formaat voor PDF iets vergroot t.o.v. de vorige versie voor betere balans
      svgWidth: 110,
      svgHeight: 75,
      titleSize: 'text-[28px]',
      sloganSize: 'text-[14px]',
      spacing: 'space-y-0',
      iconStroke: 1.4,
    }
  };

  const config = configs[variant];
  const isStartAligned = className.includes('items-start');
  
  // Marges aanpassen op basis van variant om de verhoudingen goed te houden
  const iconMarginTop = variant === 'document' ? '-mt-8' : '-mt-10';
  const textMarginTop = variant === 'document' ? '-mt-5' : '-mt-6';
  const iconRightShift = variant === 'document' ? 'ml-20' : 'ml-24';
  const iconCenterShift = variant === 'document' ? 'translate-x-10' : 'translate-x-12';

  return (
    <div className={`flex flex-col ${isStartAligned ? 'items-start' : 'items-center'} ${config.spacing} ${className}`}>
      
      {/* 1. Het Icoon: Met de opgegeven verschuivingen en marges */}
      <div className={`flex transition-transform duration-300 ${iconMarginTop} ${isStartAligned ? `justify-start ${iconRightShift}` : `justify-center ${iconCenterShift}`}`}>
        <svg 
          width={config.svgWidth} 
          height={config.svgHeight} 
          viewBox="0 0 160 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Het grijze vlak */}
          <rect x="68" y="38" width="22" height="38" fill="#BDBDBD" />
          
          {/* De gouden constructielijnen */}
          <g stroke="#C5A021" strokeWidth={config.iconStroke} strokeLinecap="butt" strokeLinejoin="miter">
            <path d="M40 78H120" />
            <path d="M73 24V78" />
            <path d="M92 24V78" />
            <path d="M73 24H92" />
            <path d="M50 62V78" />
            <path d="M50 62L73 44" />
            <path d="M62 53V78" />
            <path d="M112 62V78" />
            <path d="M112 62L92 44" />
            <path d="M100 53V78" />
            <path d="M50 62H112" />
          </g>
        </svg>
      </div>

      {/* 2. Tekstgedeelte: Dikte aangepast naar semibold voor een modernere look */}
      <div className={`flex flex-col ${isStartAligned ? 'items-start' : 'items-center'} leading-none ${textMarginTop}`}>
        <h1 className={`font-logo ${config.titleSize} font-semibold tracking-tight uppercase flex`}>
          <span className="text-[#1A1A1A]">VERANDA</span>
          <span className="text-[#C5A021]">MEISTER</span>
        </h1>
        
        {/* 3. Slogan: Dikte aangepast naar medium */}
        {showSlogan && (
          <div className="w-full flex justify-center mt-1">
            <p className={`font-logo ${config.sloganSize} text-[#C5A021] font-medium tracking-tight whitespace-nowrap opacity-100 text-center`}>
              Ihre Terrasse, unser Meisterwerk
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
