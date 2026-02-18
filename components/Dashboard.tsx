
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, Eye, Pencil, CheckCircle2, Send, Clock } from 'lucide-react';
import { QuoteStatus, Quote } from '../types';
import Logo from './Logo';

interface DashboardProps {
  quotes: Quote[];
  onNewQuote: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: QuoteStatus) => void;
  onView: (quote: Quote) => void;
  onEdit: (quote: Quote) => void;
}

const StatusDropdown: React.FC<{ 
  status: QuoteStatus; 
  onChange: (status: QuoteStatus) => void 
}> = ({ status, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusStyles = (s: QuoteStatus) => {
    switch (s) {
      case QuoteStatus.AANGEMAAKT:
        return { bg: 'bg-[#FFF9E6]', text: 'text-[#C5A021]', dot: 'bg-[#C5A021]', icon: <Clock size={12} /> };
      case QuoteStatus.VERSTUURD:
        return { bg: 'bg-[#E6F0FF]', text: 'text-[#0066FF]', dot: 'bg-[#0066FF]', icon: <Send size={12} /> };
      case QuoteStatus.GEACCEPTEERD:
        return { bg: 'bg-[#E6F9F0]', text: 'text-[#28A745]', dot: 'bg-[#28A745]', icon: <CheckCircle2 size={12} /> };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-500', icon: <Clock size={12} /> };
    }
  };

  const current = getStatusStyles(status);

  return (
    <div className="relative" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${current.bg} ${current.text} transition-all active:scale-95 border border-transparent hover:border-current/10`}
      >
        <span className="flex-shrink-0">{current.icon}</span>
        <span className="text-[9px] font-black tracking-[0.1em] uppercase whitespace-nowrap">{status}</span>
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          {Object.values(QuoteStatus).map((s) => {
            const style = getStatusStyles(s);
            return (
              <button
                key={s}
                onClick={() => {
                  onChange(s);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left ${status === s ? 'bg-gray-50/50' : ''}`}
              >
                <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${status === s ? 'text-black' : 'text-gray-400'}`}>
                  {s}
                </span>
                {status === s && <CheckCircle2 size={14} className="ml-auto text-[#28A745]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ quotes, onNewQuote, onDelete, onStatusChange, onView, onEdit }) => {
  const [filter, setFilter] = useState<'ALLE' | QuoteStatus>('ALLE');

  const filteredQuotes = filter === 'ALLE' 
    ? quotes 
    : quotes.filter(q => q.status === filter);

  const totalValue = quotes.reduce((acc, q) => acc + q.amount, 0);
  const sentValue = quotes.filter(q => q.status === QuoteStatus.VERSTUURD).reduce((acc, q) => acc + q.amount, 0);
  const acceptedValue = quotes.filter(q => q.status === QuoteStatus.GEACCEPTEERD).reduce((acc, q) => acc + q.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-end items-center">
        <button 
          onClick={onNewQuote}
          className="bg-[#C5A021] hover:bg-[#B08F1E] transition-all duration-300 px-7 py-3.5 rounded-2xl text-white shadow-xl shadow-yellow-600/20 flex items-center space-x-3 group active:scale-95"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-black text-[11px] tracking-[0.15em] uppercase">Nieuwe Offerte</span>
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="PROJECTEN" value={quotes.length.toString()} />
        <StatCard label="PORTFOLIO WAARDE" value={`€ ${totalValue.toLocaleString('nl-NL')}`} />
        <StatCard label="VERSTUURD WAARDE" value={`€ ${sentValue.toLocaleString('nl-NL')}`} />
        <StatCard label="GEACCEPTEERD WAARDE" value={`€ ${acceptedValue.toLocaleString('nl-NL')}`} />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-visible">
        <div className="p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tight">Recent beheer</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Overzicht van alle lopende offertes</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-1.5 rounded-2xl">
              <FilterButton label="ALLE" active={filter === 'ALLE'} onClick={() => setFilter('ALLE')} />
              <FilterButton label="AANGEMAAKT" active={filter === QuoteStatus.AANGEMAAKT} onClick={() => setFilter(QuoteStatus.AANGEMAAKT)} />
              <FilterButton label="VERSTUURD" active={filter === QuoteStatus.VERSTUURD} onClick={() => setFilter(QuoteStatus.VERSTUURD)} />
              <FilterButton label="GEACCEPTEERD" active={filter === QuoteStatus.GEACCEPTEERD} onClick={() => setFilter(QuoteStatus.GEACCEPTEERD)} />
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div 
                key={quote.id} 
                className="group flex items-center justify-between p-5 bg-white hover:bg-[#F9FAFB] transition-all duration-300 rounded-[1.5rem] border border-gray-100 hover:border-[#C5A021]/20 hover:shadow-xl hover:shadow-yellow-600/5 cursor-pointer"
                onClick={() => onView(quote)}
              >
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#F8F9FA] border border-gray-100 flex items-center justify-center text-[#C5A021] font-black text-xl shadow-sm group-hover:bg-[#C5A021] group-hover:text-white transition-all">
                    {quote.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-base">{quote.customerName}</h3>
                    <div className="flex items-center space-x-3 mt-1.5">
                      <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">{quote.quoteNumber}</span>
                      <span className="text-gray-200 text-xs">|</span>
                      <StatusDropdown 
                        status={quote.status} 
                        onChange={(newStatus) => onStatusChange(quote.id, newStatus)} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right mr-4">
                    <p className="font-black text-gray-900 text-lg">€ {quote.amount.toLocaleString('nl-NL')}</p>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{quote.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onView(quote); }}
                      className="p-3 text-gray-400 hover:text-[#C5A021] hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100" 
                      title="Bekijken"
                    >
                      <Eye size={20} />
                    </button>
                    {quote.status === QuoteStatus.AANGEMAAKT && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(quote); }}
                        className="p-3 text-gray-400 hover:text-blue-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100" 
                        title="Bewerken"
                      >
                        <Pencil size={20} />
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(quote.id); }}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100"
                      title="Verwijderen"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredQuotes.length === 0 && (
              <div className="py-24 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                <p className="text-gray-300 font-black uppercase tracking-[0.2em] text-[10px]">Geen resultaten gevonden</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-center min-h-[140px] hover:shadow-md transition-shadow">
    <p className="text-[10px] font-black text-gray-300 tracking-[0.2em] mb-4 uppercase">{label}</p>
    <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
  </div>
);

const FilterButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 uppercase ${
      active 
        ? 'bg-white text-[#C5A021] shadow-md border border-gray-100' 
        : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    {label}
  </button>
);

export default Dashboard;
