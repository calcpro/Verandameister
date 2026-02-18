
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Plus, Check, X, Trash2, ShoppingBag, Loader2, FileText, Receipt } from 'lucide-react';
import { Article, MainCategory, Quote, QuoteStatus, QuoteItem } from '../types';

interface QuoteGeneratorProps {
  quote?: Quote | null;
  catalog: MainCategory[];
  nextQuoteNumber?: string;
  onBack: () => void;
  onSave: (quote: Quote) => void;
}

const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({ quote, catalog, nextQuoteNumber, onBack, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Helper to format date as DD-MM-YYYY
  const formatDateStr = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  // Helper to add one month to a DD-MM-YYYY string
  const addOneMonth = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
      const year = parseInt(parts[2], 10);
      
      const date = new Date(year, month, day);
      date.setMonth(date.getMonth() + 1);
      
      return formatDateStr(date);
    } catch (e) {
      return dateStr;
    }
  };
  
  const today = formatDateStr(new Date());

  // State initialization
  const [formData, setFormData] = useState({
    fullName: quote?.customerName || '',
    address: quote?.customerAddress || '',
    postcode: quote?.customerPostcode || '',
    city: quote?.customerCity || '',
    email: quote?.customerEmail || '',
    phone: quote?.customerPhone || '',
    quoteNumber: quote?.quoteNumber.replace('#', '') || nextQuoteNumber || '',
    quoteDate: quote?.date.replace(/\./g, '-') || today,
    validUntil: quote?.validUntil?.replace(/\./g, '-') || addOneMonth(quote?.date.replace(/\./g, '-') || today),
    slogan: quote?.slogan || 'Ihre Terrasse, unser Meisterwerk',
    isInvoiceMode: quote?.isInvoice || false
  });

  const [selectedItems, setSelectedItems] = useState<QuoteItem[]>(quote?.items || []);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activeMainId, setActiveMainId] = useState<string>(catalog[0]?.id || '');
  const [activeSubId, setActiveSubId] = useState<string | null>(catalog[0]?.subCategories[0]?.id || null);

  useEffect(() => {
    if (quote) {
      const qDate = quote.date.replace(/\./g, '-');
      setFormData({
        fullName: quote.customerName,
        address: quote.customerAddress || '',
        postcode: quote.customerPostcode || '',
        city: quote.customerCity || '',
        email: quote.customerEmail || '',
        phone: quote.customerPhone || '',
        quoteNumber: quote.quoteNumber.replace('#', ''),
        quoteDate: qDate,
        validUntil: quote.validUntil?.replace(/\./g, '-') || addOneMonth(qDate),
        slogan: quote.slogan || 'Ihre Terrasse, unser Meisterwerk',
        isInvoiceMode: quote.isInvoice || false
      });
      setSelectedItems(quote.items || []);
    } else if (nextQuoteNumber) {
      setFormData(prev => ({ ...prev, quoteNumber: nextQuoteNumber }));
    }
  }, [quote, nextQuoteNumber]);

  // Handle offer date change and auto-update validity date
  const handleQuoteDateChange = (newDate: string) => {
    setFormData(prev => ({
      ...prev,
      quoteDate: newDate,
      validUntil: addOneMonth(newDate)
    }));
  };

  const activeMain = useMemo(() => catalog.find(m => m.id === activeMainId), [catalog, activeMainId]);
  const activeSub = useMemo(() => activeMain?.subCategories.find(s => s.id === activeSubId), [activeMain, activeSubId]);

  const subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = subtotal * 0.19;
  const total = subtotal + vat;

  const handleSave = () => {
    if (!formData.fullName.trim()) {
      alert("Voer a.u.b. de naam van de klant in.");
      return;
    }
    
    setIsSaving(true);
    
    setTimeout(() => {
      const savedQuote: Quote = {
        id: quote?.id || Date.now().toString(),
        customerName: formData.fullName,
        customerAddress: formData.address,
        customerPostcode: formData.postcode,
        customerCity: formData.city,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        slogan: formData.slogan,
        quoteNumber: formData.quoteNumber,
        status: quote?.status || QuoteStatus.AANGEMAAKT,
        amount: total,
        date: formData.quoteDate,
        validUntil: formData.validUntil,
        items: selectedItems,
        isInvoice: formData.isInvoiceMode
      };
      
      onSave(savedQuote);
      setIsSaving(false);
    }, 1000);
  };

  const addItemFromCatalog = (article: Article) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.id === article.id && !i.isManual);
      if (existing) {
        return prev.map(i => i.id === article.id && !i.isManual ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...article, quantity: 1 }];
    });
  };

  const addManualItem = () => {
    const newItem: QuoteItem = {
      id: `manual-${Date.now()}`,
      title: 'NIEUW ARTIKEL',
      details: 'Voer hier de beschrijving in...',
      price: 0,
      quantity: 1,
      isManual: true
    };
    setSelectedItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setSelectedItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const updateQuantity = (id: string, delta: number) => {
    setSelectedItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const labelStyle = "text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1";
  const inputStyle = "w-full bg-[#F8F9FA] border-none rounded-xl p-3 text-[11px] font-medium text-gray-600 outline-none focus:ring-1 focus:ring-[#C5A021] transition-all placeholder:text-gray-300";

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <header className="flex items-center justify-between mb-8 sticky top-0 bg-[#F8F9FA] z-20 py-4">
        <h1 className="text-sm font-black tracking-widest text-gray-800 uppercase">
          {quote ? 'Document Bewerken' : 'Nieuw Document'}
        </h1>
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="px-6 py-2 bg-[#F0F0F0] text-gray-500 rounded-lg text-[11px] font-bold hover:bg-gray-200 transition-colors">Annuleren</button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-[#28A745] text-white rounded-lg text-[11px] font-bold flex items-center space-x-2 hover:bg-[#218838] shadow-sm disabled:opacity-70 transition-all"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            <span>{isSaving ? 'Opslaan...' : (quote ? 'Wijzigingen Opslaan' : 'Opslaan')}</span>
          </button>
          <button className="px-6 py-2 bg-black text-white rounded-lg text-[11px] font-bold hover:bg-gray-800 shadow-sm">PDF / Print</button>
        </div>
      </header>

      <div className="space-y-8 max-w-5xl mx-auto">
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C5A021]"></div>
          <div className="p-10">
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-10 h-10 rounded-full border-2 border-[#C5A021]/20 flex items-center justify-center text-[#C5A021] font-bold italic text-sm">01</div>
              <h2 className="text-[13px] font-black tracking-widest uppercase text-gray-800">Klantgegevens</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className={labelStyle}>Volledige naam</label>
                <input type="text" placeholder="Bijv. Jan Janssen" className={inputStyle} value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className={labelStyle}>Adres</label>
                <input type="text" placeholder="Straat en huisnummer" className={inputStyle} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className={labelStyle}>Postcode</label>
                  <input type="text" placeholder="1234 AB" className={inputStyle} value={formData.postcode} onChange={(e) => setFormData({...formData, postcode: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelStyle}>Stad</label>
                  <input type="text" placeholder="Woonplaats" className={inputStyle} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className={labelStyle}>E-mailadres</label>
                  <input type="email" placeholder="klant@voorbeeld.nl" className={inputStyle} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelStyle}>Telefoonnummer</label>
                  <input type="text" placeholder="06 12345678" className={inputStyle} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C5A021]"></div>
          <div className="p-10">
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-10 h-10 rounded-full border-2 border-[#C5A021]/20 flex items-center justify-center text-[#C5A021] font-bold italic text-sm">02</div>
              <h2 className="text-[13px] font-black tracking-widest uppercase text-gray-800">Documentgegevens</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className={labelStyle}>Documentnummer</label>
                  <input type="text" className={inputStyle} value={formData.quoteNumber} onChange={(e) => setFormData({...formData, quoteNumber: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelStyle}>Documentdatum</label>
                  <input type="text" className={inputStyle} value={formData.quoteDate} onChange={(e) => handleQuoteDateChange(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelStyle}>Gültig bis / Fälligkeitsdatum</label>
                  <input type="text" className={inputStyle} value={formData.validUntil} onChange={(e) => setFormData({...formData, validUntil: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelStyle}>Slogan (Duits)</label>
                  <input type="text" className={inputStyle} value={formData.slogan} onChange={(e) => setFormData({...formData, slogan: e.target.value})} />
                </div>
              </div>

              {/* Toggle voor Factuur modus */}
              <div className="flex justify-end pt-4">
                <div className="flex items-center bg-[#F8F9FA] p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                  <button 
                    onClick={() => setFormData({...formData, isInvoiceMode: false})}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${!formData.isInvoiceMode ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <FileText size={14} />
                    <span>Angebot</span>
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, isInvoiceMode: true})}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${formData.isInvoiceMode ? 'bg-[#C5A021] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Receipt size={14} />
                    <span>Rechnung</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C5A021]"></div>
          <div className="p-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full border-2 border-[#C5A021]/20 flex items-center justify-center text-[#C5A021] font-bold italic text-sm">03</div>
                <h2 className="text-[13px] font-black tracking-widest uppercase text-gray-800">Artikelen</h2>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => setIsCatalogOpen(true)} className="px-7 py-3 bg-black text-white rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center space-x-3 shadow-md hover:bg-gray-800 transition-all active:scale-95">
                  <span>CATALOGUS</span><ChevronDown size={14} />
                </button>
                <button onClick={addManualItem} className="px-7 py-3 bg-[#C5A021] text-white rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center space-x-2 shadow-md hover:bg-[#B08F1E] transition-all active:scale-95">
                  <Plus size={14} /><span>HANDMATIG</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {selectedItems.map((item) => (
                <div key={item.id} className="bg-[#F9FAFB]/30 rounded-[2.5rem] border border-gray-100 p-8 animate-in slide-in-from-bottom-2">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-5 px-2">
                      <input className="w-full text-sm font-black text-gray-800 bg-transparent border-none focus:ring-0 outline-none uppercase tracking-widest" value={item.title} onChange={(e) => updateItem(item.id, 'title', e.target.value)} />
                      <div className="bg-white rounded-3xl p-6 border border-gray-100 relative min-h-[140px] shadow-sm">
                        <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#C5A021] rounded-full"></div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-2">Artikelbeschrijving / Details:</p>
                        <textarea className="w-full text-[11px] text-gray-500 font-medium bg-transparent border-none focus:ring-0 outline-none resize-none leading-relaxed h-28 pl-2" value={item.details} onChange={(e) => updateItem(item.id, 'details', e.target.value)} />
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center justify-between md:justify-start md:w-64 gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-8">
                      <div className="flex items-center bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold hover:text-black transition-colors">-</button>
                        <span className="w-10 text-center text-[11px] font-black">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold hover:text-black transition-colors">+</button>
                      </div>
                      <div className="bg-white rounded-2xl p-4 py-3 w-full text-center shadow-sm border border-gray-50">
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">PRIJS PER STUK</p>
                        <div className="flex items-center justify-center text-xl font-black text-gray-900">
                          <span className="mr-1 text-sm">€</span>
                          <input type="number" className="w-24 bg-transparent text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={item.price} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} />
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="w-full py-2.5 rounded-xl text-[9px] font-black tracking-widest uppercase bg-[#FFF2F2] text-[#FF4D4D] hover:bg-[#FF4D4D] hover:text-white transition-all shadow-sm">VERWIJDEREN</button>
                    </div>
                  </div>
                </div>
              ))}

              {selectedItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300"><ShoppingBag size={48} className="opacity-10 mb-4" /><p className="text-[10px] font-bold uppercase tracking-widest">Geen artikelen geselecteerd</p></div>
              )}
            </div>

            {selectedItems.length > 0 && (
              <div className="mt-20 pt-10 border-t border-gray-50">
                <div className="flex justify-end">
                  <div className="w-full max-sm:max-w-full max-w-sm space-y-3 bg-[#F8F9FA]/50 p-8 rounded-[2rem] border border-gray-50">
                    <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span>Subtotaal</span>
                      <span className="text-gray-900">€ {subtotal.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span>BTW (19%)</span>
                      <span className="text-gray-900">€ {vat.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="pt-4 border-t border-white flex justify-between items-baseline">
                      <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Totaalbedrag</span>
                      <span className="text-2xl font-black text-[#C5A021]">€ {total.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {isCatalogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCatalogOpen(false)}></div>
          <div className="relative bg-[#F8F9FA] w-full max-w-6xl h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-white px-10 py-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">SELECTEER ARTIKELEN</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">CATALOGUS VERANDAMEISTER</p>
              </div>
              <button 
                onClick={() => setIsCatalogOpen(false)}
                className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-black transition-all hover:scale-110 active:scale-95"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-80 bg-white border-r border-gray-100 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                {catalog.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveMainId(cat.id); setActiveSubId(cat.subCategories[0]?.id || null); }}
                    className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${
                      activeMainId === cat.id 
                        ? 'bg-black text-white shadow-xl' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${activeMainId === cat.id ? 'bg-[#C5A021]' : 'bg-gray-200'}`}></div>
                    <span className="text-[11px] font-black uppercase tracking-[0.05em] text-left leading-relaxed">{cat.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-gray-50/20 relative">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C5A021]/10"></div>
                
                {activeMain && (
                  <div className="space-y-12">
                    <div className="flex flex-wrap gap-4">
                      {activeMain.subCategories.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setActiveSubId(sub.id)}
                          className={`px-10 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeSubId === sub.id 
                              ? 'bg-[#C5A021] text-white shadow-lg shadow-yellow-600/20' 
                              : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300 shadow-sm'
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                      {activeSub?.articles.map(article => (
                        <div key={article.id} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col min-h-[220px]">
                          <div className="flex flex-col flex-1">
                            <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-800 leading-relaxed mb-4 min-h-[3rem]">{article.title}</h4>
                            <div className="flex items-baseline space-x-1 mb-8">
                                <span className="text-[10px] font-black text-[#C5A021] opacity-60">€</span>
                                <span className="text-[#C5A021] font-black text-2xl tracking-tight">{article.price.toLocaleString('nl-NL')}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => addItemFromCatalog(article)}
                            className="w-full flex items-center justify-center space-x-3 bg-[#F8F9FA] group-hover:bg-[#28A745] text-gray-400 group-hover:text-white py-4.5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.15em] border border-transparent group-hover:shadow-lg group-hover:shadow-green-600/10"
                          >
                            <Plus size={16} />
                            <span>SELECTEREN</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white px-12 py-10 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-[#F8F9FA] rounded-2xl flex items-center justify-center text-[#C5A021] border border-gray-100 shadow-sm">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">WINKELWAGEN</p>
                  <p className="text-xl font-black text-gray-900">{selectedItems.length} Producten</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCatalogOpen(false)}
                className="bg-black text-white px-16 py-5 rounded-[1.5rem] text-[12px] font-black tracking-[0.15em] uppercase shadow-2xl shadow-black/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                TERUG NAAR DOCUMENT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteGenerator;
