
import React from 'react';
import { Home, FilePlus, BookOpen, Eye, LogOut } from 'lucide-react';
import { ViewType } from '../types';
import Logo from './Logo';

interface SidebarProps {
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'new-quote', label: 'Nieuwe Offerte', icon: FilePlus },
    { id: 'catalog', label: 'Catalogus', icon: BookOpen },
    { id: 'preview', label: 'Voorbeeld', icon: Eye },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="mb-10 flex flex-col pl-2">
          <div className="cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <Logo variant="small" />
          </div>
          <p className="text-[9px] uppercase text-gray-300 font-black tracking-[0.2em] mt-3 pl-1">
            Partner Portal
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ViewType)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeView === item.id
                  ? 'bg-[#C5A021] text-white shadow-lg shadow-yellow-600/20'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-[#C5A021]'
              }`}
            >
              <item.icon size={18} />
              <span className="font-bold text-[11px] uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 text-gray-300 hover:text-red-500 transition-colors group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Uitloggen</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
