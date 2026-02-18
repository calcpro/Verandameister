import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import QuoteGenerator from './components/QuoteGenerator';
import Catalog from './components/Catalog';
import Preview from './components/Preview';
import Login from './components/Login';
import { ViewType, Quote, MainCategory } from './types';
import { 
  fetchQuotes, 
  fetchCatalog, 
  saveQuote, 
  saveCatalog, 
  deleteQuote, 
  updateQuoteStatus 
} from './lib/database';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [catalog, setCatalog] = useState<MainCategory[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('vm_auth');
    setIsAuthenticated(auth === 'true');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    const [quotesData, catalogData] = await Promise.all([
      fetchQuotes(),
      fetchCatalog()
    ]);
    setQuotes(quotesData);
    setCatalog(catalogData);
  };

  const nextQuoteNumber = useMemo(() => {
    if (quotes.length === 0) return "2026261";
    const nums = quotes
      .map(q => parseInt(q.quoteNumber.replace('#', ''), 10))
      .filter(n => !isNaN(n));
    return nums.length === 0 ? "2026261" : (Math.max(...nums) + 1).toString();
  }, [quotes]);

  const handleSaveQuote = async (savedQuote: Quote) => {
    await saveQuote(savedQuote);
    await loadData();
    setSelectedQuote(savedQuote);
    setCurrentView('dashboard');
  };

  const handleDeleteQuote = async (id: string) => {
    await deleteQuote(id);
    await loadData();
    if (selectedQuote?.id === id) setSelectedQuote(null);
  };

  const handleStatusChange = async (id: string, newStatus: any) => {
    await updateQuoteStatus(id, newStatus);
    await loadData();
  };

  const handleUpdateCatalog = async (newCatalog: MainCategory[]) => {
    await saveCatalog(newCatalog);
    await loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#C5A021] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
        onLogout={() => {
          localStorage.removeItem('vm_auth');
          setIsAuthenticated(false);
        }}
      />
      <main className="flex-1 p-4 lg:p-8 pt-20 md:pt-4 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {currentView === 'dashboard' && (
            <Dashboard 
              quotes={quotes} 
              onNewQuote={() => { setSelectedQuote(null); setCurrentView('new-quote'); }}
              onDelete={handleDeleteQuote}
              onStatusChange={handleStatusChange}
              onView={(q) => { setSelectedQuote(q); setCurrentView('preview'); }}
              onEdit={(q) => { setSelectedQuote(q); setCurrentView('new-quote'); }}
            />
          )}
          {currentView === 'new-quote' && (
            <QuoteGenerator 
              quote={selectedQuote}
              catalog={catalog}
              nextQuoteNumber={nextQuoteNumber}
              onBack={() => setCurrentView('dashboard')}
              onSave={handleSaveQuote}
            />
          )}
          {currentView === 'catalog' && (
            <Catalog catalog={catalog} onUpdate={handleUpdateCatalog} />
          )}
          {currentView === 'preview' && (
            <Preview quote={selectedQuote} onBack={() => setCurrentView('dashboard')} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;


// import React, { useState, useMemo, useEffect } from 'react';
// import Sidebar from './components/Sidebar';
// import Dashboard from './components/Dashboard';
// import QuoteGenerator from './components/QuoteGenerator';
// import Catalog from './components/Catalog';
// import Preview from './components/Preview';
// import Login from './components/Login';
// import { ViewType, Quote, MainCategory } from './types';
// import { MOCK_QUOTES, INITIAL_CATALOG } from './constants';

// const App: React.FC = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [currentView, setCurrentView] = useState<ViewType>('dashboard');
//   const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
//   const [catalog, setCatalog] = useState<MainCategory[]>(INITIAL_CATALOG);
//   const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

//   useEffect(() => {
//     const auth = localStorage.getItem('vm_auth');
//     if (auth === 'true') {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const nextQuoteNumber = useMemo(() => {
//     if (quotes.length === 0) return "2026261";
//     const nums = quotes
//       .map(q => parseInt(q.quoteNumber.replace('#', '').trim(), 10))
//       .filter(n => !isNaN(n));
//     if (nums.length === 0) return "2026261";
//     return (Math.max(...nums) + 1).toString();
//   }, [quotes]);

//   const handleSaveQuote = (savedQuote: Quote) => {
//     setQuotes(prev => {
//       const exists = prev.find(q => q.id === savedQuote.id);
//       if (exists) {
//         return prev.map(q => q.id === savedQuote.id ? savedQuote : q);
//       }
//       return [savedQuote, ...prev];
//     });
//     setSelectedQuote(savedQuote);
//     setCurrentView('dashboard');
//   };

//   const handleDeleteQuote = (id: string) => {
//     setQuotes(prev => prev.filter(q => q.id !== id));
//     if (selectedQuote?.id === id) setSelectedQuote(null);
//   };

//   const handleStatusChange = (id: string, newStatus: any) => {
//     setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
//   };

//   const handleViewQuote = (quote: Quote) => {
//     setSelectedQuote(quote);
//     setCurrentView('preview');
//   };

//   const handleEditQuote = (quote: Quote) => {
//     setSelectedQuote(quote);
//     setCurrentView('new-quote');
//   };

//   const handleNewQuoteClick = () => {
//     setSelectedQuote(null);
//     setCurrentView('new-quote');
//   };

//   const handleUpdateCatalog = (newCatalog: MainCategory[]) => {
//     setCatalog(newCatalog);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('vm_auth');
//     setIsAuthenticated(false);
//   };

//   const renderContent = () => {
//     switch (currentView) {
//       case 'dashboard':
//         return (
//           <Dashboard 
//             quotes={quotes} 
//             onNewQuote={handleNewQuoteClick} 
//             onDelete={handleDeleteQuote}
//             onStatusChange={handleStatusChange}
//             onView={handleViewQuote}
//             onEdit={handleEditQuote}
//           />
//         );
//       case 'new-quote':
//         return (
//           <QuoteGenerator 
//             quote={selectedQuote}
//             catalog={catalog}
//             nextQuoteNumber={nextQuoteNumber}
//             onBack={() => setCurrentView('dashboard')} 
//             onSave={handleSaveQuote}
//           />
//         );
//       case 'catalog':
//         return <Catalog catalog={catalog} onUpdate={handleUpdateCatalog} />;
//       case 'preview':
//         return <Preview quote={selectedQuote} onBack={() => setCurrentView('dashboard')} />;
//       default:
//         return (
//           <Dashboard 
//             quotes={quotes} 
//             onNewQuote={handleNewQuoteClick} 
//             onDelete={handleDeleteQuote}
//             onStatusChange={handleStatusChange}
//             onView={handleViewQuote}
//             onEdit={handleEditQuote}
//           />
//         );
//     }
//   };

//   if (!isAuthenticated) {
//     return <Login onLogin={() => setIsAuthenticated(true)} />;
//   }

//   return (
//     <div className="flex min-h-screen bg-[#F8F9FA]">
//       <Sidebar 
//         activeView={currentView} 
//         onNavigate={(view) => {
//           if (view === 'new-quote') setSelectedQuote(null);
//           setCurrentView(view);
//         }} 
//         onLogout={handleLogout}
//       />
//       <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-screen custom-scrollbar">
//         <div className="max-w-7xl mx-auto">
//           {renderContent()}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default App;
