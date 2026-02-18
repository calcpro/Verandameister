import { supabase, isConfigured } from './supabase';
import { Quote, MainCategory } from '../types';

// Helper functie om fallback te gebruiken
const useLocalStorage = (key: string, fallback: any) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};


// Quotes ophalen
export const fetchQuotes = async (): Promise<Quote[]> => {
  if (!isConfigured()) {
    const stored = localStorage.getItem('vm_quotes');
    return stored ? JSON.parse(stored) : [];
  }

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Database error:', error);
    const stored = localStorage.getItem('vm_quotes');
    // return stored ? JSON.parse(stored) : [];
    return useLocalStorage('vm_quotes', []);
  }

  return data.map(row => ({
    id: row.id,
    customerName: row.customer_name,
    customerAddress: row.customer_address,
    customerPostcode: row.customer_postcode,
    customerCity: row.customer_city,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    slogan: row.slogan,
    quoteNumber: row.quote_number,
    status: row.status,
    amount: parseFloat(row.amount),
    date: row.date,
    validUntil: row.valid_until,
    items: row.items,
    isInvoice: row.is_invoice
  }));
};

// Quote opslaan
export const saveQuote = async (quote: Quote): Promise<void> => {
  if (!isConfigured()) {
    const quotes = await fetchQuotes();
    const updated = quotes.find(q => q.id === quote.id)
      ? quotes.map(q => q.id === quote.id ? quote : q)
      : [quote, ...quotes];
    localStorage.setItem('vm_quotes', JSON.stringify(updated));
    return;
  }

  await supabase.from('quotes').upsert({
    id: quote.id,
    customer_name: quote.customerName,
    customer_address: quote.customerAddress,
    customer_postcode: quote.customerPostcode,
    customer_city: quote.customerCity,
    customer_email: quote.customerEmail,
    customer_phone: quote.customerPhone,
    slogan: quote.slogan,
    quote_number: quote.quoteNumber,
    status: quote.status,
    amount: quote.amount,
    date: quote.date,
    valid_until: quote.validUntil,
    items: quote.items,
    is_invoice: quote.isInvoice,
    updated_at: new Date().toISOString()
  });
};

// Quote verwijderen
export const deleteQuote = async (id: string): Promise<void> => {
  if (!isConfigured()) {
    const quotes = await fetchQuotes();
    localStorage.setItem('vm_quotes', JSON.stringify(quotes.filter(q => q.id !== id)));
    return;
  }

  await supabase.from('quotes').delete().eq('id', id);
};

// Status updaten
export const updateQuoteStatus = async (id: string, status: string): Promise<void> => {
  if (!isConfigured()) {
    const quotes = await fetchQuotes();
    localStorage.setItem('vm_quotes', JSON.stringify(
      quotes.map(q => q.id === id ? { ...q, status } : q)
    ));
    return;
  }

  await supabase.from('quotes').update({ status }).eq('id', id);
};

// Catalog ophalen
export const fetchCatalog = async (): Promise<MainCategory[]> => {
  if (!isConfigured()) {
    const stored = localStorage.getItem('vm_catalog');
    return stored ? JSON.parse(stored) : [];
  }

  const { data } = await supabase.from('catalog').select('*');
  
  if (!data || data.length === 0) return [];

  return data.map(row => ({
    id: row.id,
    name: row.name,
    subCategories: row.sub_categories
  }));
};

// Catalog opslaan
export const saveCatalog = async (catalog: MainCategory[]): Promise<void> => {
  if (!isConfigured()) {
    localStorage.setItem('vm_catalog', JSON.stringify(catalog));
    return;
  }

  await supabase.from('catalog').delete().neq('id', '');
  
  const rows = catalog.map(cat => ({
    id: cat.id,
    name: cat.name,
    sub_categories: cat.subCategories
  }));

  await supabase.from('catalog').insert(rows);
};