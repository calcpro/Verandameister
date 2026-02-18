
import React, { useState, useMemo, useEffect } from 'react';
import { Check, Plus, X, Loader2 } from 'lucide-react';
import { MainCategory, SubCategory, Article } from '../types';

interface CatalogProps {
  catalog: MainCategory[];
  onUpdate: (newCatalog: MainCategory[]) => void;
}

const Catalog: React.FC<CatalogProps> = ({ catalog: initialCatalog, onUpdate }) => {
  const [localCatalog, setLocalCatalog] = useState<MainCategory[]>(initialCatalog);
  const [activeMainId, setActiveMainId] = useState<string>(initialCatalog[0]?.id || '');
  const [activeSubId, setActiveSubId] = useState<string | null>(initialCatalog[0]?.subCategories[0]?.id || null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showAddMain, setShowAddMain] = useState(false);
  const [newMainName, setNewMainName] = useState('');
  const [showAddSub, setShowAddSub] = useState(false);
  const [newSubName, setNewSubName] = useState('');

  // Sync with initialCatalog if it changes from outside
  useEffect(() => {
    setLocalCatalog(initialCatalog);
    if (!activeMainId && initialCatalog.length > 0) {
      setActiveMainId(initialCatalog[0].id);
      setActiveSubId(initialCatalog[0].subCategories[0]?.id || null);
    }
  }, [initialCatalog]);

  const activeMain = useMemo(() => localCatalog.find(m => m.id === activeMainId), [localCatalog, activeMainId]);
  const activeSub = useMemo(() => activeMain?.subCategories.find(s => s.id === activeSubId), [activeMain, activeSubId]);

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate(localCatalog);
      setIsSaving(false);
    }, 800);
  };

  const handleAddMain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMainName.trim()) return;
    const newId = Date.now().toString();
    const newCat: MainCategory = { id: newId, name: newMainName.trim().toUpperCase(), subCategories: [] };
    setLocalCatalog(prev => [...prev, newCat]);
    setActiveMainId(newId);
    setActiveSubId(null);
    setNewMainName('');
    setShowAddMain(false);
  };

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !activeMainId) return;
    const newId = Date.now().toString();
    const newSub: SubCategory = { id: newId, name: newSubName.trim(), articles: [] };
    setLocalCatalog(prev => prev.map(m => m.id === activeMainId ? { ...m, subCategories: [...m.subCategories, newSub] } : m));
    setActiveSubId(newId);
    setNewSubName('');
    setShowAddSub(false);
  };

  const deleteMainCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Hoofdcategorie en alle inhoud verwijderen?')) return;
    const newCatalogList = localCatalog.filter(c => c.id !== id);
    setLocalCatalog(newCatalogList);
    if (activeMainId === id && newCatalogList.length > 0) {
      setActiveMainId(newCatalogList[0].id);
      setActiveSubId(newCatalogList[0].subCategories[0]?.id || null);
    }
  };

  const deleteSubCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Subcategorie verwijderen?')) return;
    setLocalCatalog(prev => prev.map(m => m.id === activeMainId ? { ...m, subCategories: m.subCategories.filter(s => s.id !== id) } : m));
    if (activeSubId === id) setActiveSubId(null);
  };

  const addArticle = () => {
    if (!activeSubId) return;
    const newArticle: Article = {
      id: Date.now().toString(),
      title: 'Premium Aluminium Terrassenüberdachung',
      details: '- Dacheindeckung: ...\n- Pulverbeschichtung: ...\n- Afmetingen: ...',
      price: 0
    };
    setLocalCatalog(prev => prev.map(m => ({
      ...m,
      subCategories: m.subCategories.map(s => s.id === activeSubId ? { ...s, articles: [...s.articles, newArticle] } : s)
    })));
  };

  const updateArticle = (id: string, field: keyof Article, value: any) => {
    setLocalCatalog(prev => prev.map(m => ({
      ...m,
      subCategories: m.subCategories.map(s => ({
        ...s,
        articles: s.articles.map(a => (a.id === id ? { ...a, [field]: value } : a))
      }))
    })));
  };

  const deleteArticle = (id: string) => {
    if (!confirm('Artikel verwijderen?')) return;
    setLocalCatalog(prev => prev.map(m => ({
      ...m,
      subCategories: m.subCategories.map(s => ({
        ...s,
        articles: s.articles.filter(a => a.id !== id)
      }))
    })));
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 pt-4">
        <h1 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Catalog</h1>
        <button 
          onClick={handleSaveChanges}
          className="bg-[#28A745] hover:bg-[#218838] text-white px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center space-x-2 transition-all shadow-sm active:scale-95"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          <span>{isSaving ? 'Opslaan...' : 'Wijzigingen Opslaan'}</span>
        </button>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-gray-900 uppercase">1. Hoofdcategorieën</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selecteer om te beheren</p>
            </div>
            <button 
              onClick={() => setShowAddMain(!showAddMain)}
              className="bg-[#C5A021] text-white px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase flex items-center space-x-2 shadow-sm hover:bg-[#B08F1E] transition-colors"
            >
              <Plus size={14} />
              <span>Hoofdkop</span>
            </button>
          </div>
          
          {showAddMain && (
            <form onSubmit={handleAddMain} className="mb-4 flex items-center space-x-2 animate-in slide-in-from-top-2 duration-200">
              <input 
                autoFocus
                type="text"
                placeholder="Nieuwe hoofdcategorie..."
                className="bg-white border border-gray-100 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:ring-1 focus:ring-[#C5A021] flex-1 max-w-xs shadow-sm"
                value={newMainName}
                onChange={(e) => setNewMainName(e.target.value)}
              />
              <button type="submit" className="p-2 bg-black text-white rounded-lg"><Check size={16} /></button>
              <button type="button" onClick={() => setShowAddMain(false)} className="p-2 bg-gray-100 text-gray-400 rounded-lg"><X size={16} /></button>
            </form>
          )}

          <div className="flex flex-wrap gap-3">
            {localCatalog.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveMainId(cat.id); setActiveSubId(cat.subCategories[0]?.id || null); }}
                className={`group relative flex items-center space-x-3 px-6 py-3 rounded-2xl border transition-all duration-200 ${
                  activeMainId === cat.id ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${activeMainId === cat.id ? 'bg-[#C5A021]' : 'bg-yellow-500'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                {localCatalog.length > 1 && (
                  <X 
                    size={12} 
                    className={`ml-2 transition-opacity ${activeMainId === cat.id ? 'text-white/40 hover:text-white' : 'text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100'}`} 
                    onClick={(e) => deleteMainCategory(cat.id, e)}
                  />
                )}
              </button>
            ))}
          </div>
        </section>

        <section className={!activeMainId ? 'opacity-30 pointer-events-none' : ''}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-gray-900 uppercase">2. Subcategorieën</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest uppercase">In geselecteerde hoofdcategorie</p>
            </div>
            <button 
              onClick={() => setShowAddSub(!showAddSub)}
              className="bg-white border border-[#C5A021] text-[#C5A021] px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase flex items-center space-x-2 hover:bg-yellow-50 shadow-sm transition-colors"
            >
              <Plus size={14} />
              <span>Subcategorie</span>
            </button>
          </div>

          {showAddSub && (
            <form onSubmit={handleAddSub} className="mb-4 flex items-center space-x-2 animate-in slide-in-from-top-2 duration-200">
              <input 
                autoFocus
                type="text"
                placeholder="Nieuwe subcategorie..."
                className="bg-white border border-gray-100 rounded-lg px-4 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-[#C5A021] flex-1 max-w-xs shadow-sm"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
              />
              <button type="submit" className="p-2 bg-[#C5A021] text-white rounded-lg"><Check size={16} /></button>
              <button type="button" onClick={() => setShowAddSub(false)} className="p-2 bg-gray-100 text-gray-400 rounded-lg"><X size={16} /></button>
            </form>
          )}

          <div className="flex flex-wrap gap-2">
            {activeMain?.subCategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubId(sub.id)}
                className={`group flex items-center justify-between min-w-[140px] px-6 py-2.5 rounded-xl border transition-all duration-200 ${
                  activeSubId === sub.id ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-widest">{sub.name}</span>
                <X 
                  size={14} 
                  className={`ml-4 transition-opacity ${activeSubId === sub.id ? 'opacity-40 hover:opacity-100' : 'opacity-0 group-hover:opacity-40 hover:opacity-100'}`} 
                  onClick={(e) => deleteSubCategory(sub.id, e)} 
                />
              </button>
            ))}
          </div>
        </section>

        <section className={!activeSubId ? 'opacity-30 pointer-events-none' : ''}>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-gray-900 uppercase">3. ARTIKELEN</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest uppercase">In subcategorie: {activeSub?.name || '...'}</p>
            </div>
            <button 
              onClick={addArticle}
              className="text-[#C5A021] text-[10px] font-black uppercase tracking-widest flex items-center space-x-1 hover:underline"
            >
              <Plus size={14} />
              <span>Artikel Toevoegen</span>
            </button>
          </div>

          <div className="space-y-6">
            {activeSub?.articles.map(article => (
              <div key={article.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow animate-in fade-in duration-300">
                <div className="flex-1 p-8 pr-12">
                  <input 
                    className="text-lg font-black text-gray-900 bg-transparent border-b border-transparent hover:border-gray-100 focus:border-[#C5A021] outline-none w-full mb-6 py-1"
                    value={article.title}
                    onChange={(e) => updateArticle(article.id, 'title', e.target.value)}
                  />

                  <div className="flex flex-col md:flex-row gap-6 items-stretch ml-2">
                    <div className="flex-1 bg-gray-50/50 rounded-2xl p-6 py-5 relative group/desc hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                      <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#C5A021] rounded-full"></div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-2">Artikelbeschrijving / Details:</p>
                      <textarea 
                        className="w-full text-[11px] font-medium text-gray-600 bg-transparent border-none focus:ring-0 outline-none resize-none leading-relaxed h-28 pl-2"
                        value={article.details}
                        onChange={(e) => updateArticle(article.id, 'details', e.target.value)}
                        placeholder="Voer hier alle details in, inclusief afmetingen..."
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64 p-8 flex flex-col items-center justify-center bg-[#F9FAFB] border-l border-gray-50">
                  <div className="bg-white rounded-2xl p-4 py-3 w-full text-center shadow-sm border border-gray-50 mb-6 transition-colors">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Prijs (€)</p>
                    <input 
                      type="number"
                      className="text-4xl font-black text-gray-900 bg-transparent w-full text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={article.price}
                      onChange={(e) => updateArticle(article.id, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <button 
                    onClick={() => deleteArticle(article.id)}
                    className="w-full py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase bg-[#FFF2F2] text-[#FF4D4D] hover:bg-[#FF4D4D] hover:text-white transition-all transform active:scale-95 shadow-sm"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            ))}

            {activeSub && activeSub.articles.length === 0 && (
              <div className="py-24 bg-white/50 border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-gray-300">
                <Plus size={48} className="mb-4 opacity-5" />
                <p className="text-[10px] font-black uppercase tracking-widest">Geen artikelen in deze sectie</p>
                <button onClick={addArticle} className="mt-4 text-[#C5A021] text-[10px] font-black uppercase tracking-widest hover:underline">
                  Artikel toevoegen
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Catalog;
