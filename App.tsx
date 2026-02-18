
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import QuoteGenerator from './components/QuoteGenerator';
import Catalog from './components/Catalog';
import Preview from './components/Preview';
import Login from './components/Login';
import { ViewType, Quote, MainCategory } from './types';
import { MOCK_QUOTES, INITIAL_CATALOG } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
  const [catalog, setCatalog] = useState<MainCategory[]>(INITIAL_CATALOG);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('vm_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const nextQuoteNumber = useMemo(() => {
    if (quotes.length === 0) return "2026261";
    const nums = quotes
      .map(q => parseInt(q.quoteNumber.replace('#', '').trim(), 10))
      .filter(n => !isNaN(n));
    if (nums.length === 0) return "2026261";
    return (Math.max(...nums) + 1).toString();
  }, [quotes]);

  const handleSaveQuote = (savedQuote: Quote) => {
    setQuotes(prev => {
      const exists = prev.find(q => q.id === savedQuote.id);
      if (exists) {
        return prev.map(q => q.id === savedQuote.id ? savedQuote : q);
      }
      return [savedQuote, ...prev];
    });
    setSelectedQuote(savedQuote);
    setCurrentView('dashboard');
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    if (selectedQuote?.id === id) setSelectedQuote(null);
  };

  const handleStatusChange = (id: string, newStatus: any) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
  };

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setCurrentView('preview');
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setCurrentView('new-quote');
  };

  const handleNewQuoteClick = () => {
    setSelectedQuote(null);
    setCurrentView('new-quote');
  };

  const handleUpdateCatalog = (newCatalog: MainCategory[]) => {
    setCatalog(newCatalog);
  };

  const handleLogout = () => {
    localStorage.removeItem('vm_auth');
    setIsAuthenticated(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            quotes={quotes} 
            onNewQuote={handleNewQuoteClick} 
            onDelete={handleDeleteQuote}
            onStatusChange={handleStatusChange}
            onView={handleViewQuote}
            onEdit={handleEditQuote}
          />
        );
      case 'new-quote':
        return (
          <QuoteGenerator 
            quote={selectedQuote}
            catalog={catalog}
            nextQuoteNumber={nextQuoteNumber}
            onBack={() => setCurrentView('dashboard')} 
            onSave={handleSaveQuote}
          />
        );
      case 'catalog':
        return <Catalog catalog={catalog} onUpdate={handleUpdateCatalog} />;
      case 'preview':
        return <Preview quote={selectedQuote} onBack={() => setCurrentView('dashboard')} />;
      default:
        return (
          <Dashboard 
            quotes={quotes} 
            onNewQuote={handleNewQuoteClick} 
            onDelete={handleDeleteQuote}
            onStatusChange={handleStatusChange}
            onView={handleViewQuote}
            onEdit={handleEditQuote}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar 
        activeView={currentView} 
        onNavigate={(view) => {
          if (view === 'new-quote') setSelectedQuote(null);
          setCurrentView(view);
        }} 
        onLogout={handleLogout}
      />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-screen custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
