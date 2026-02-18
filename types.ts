
export enum QuoteStatus {
  AANGEMAAKT = 'AANGEMAAKT',
  VERSTUURD = 'VERSTUURD',
  GEACCEPTEERD = 'GEACCEPTEERD',
}

export interface Article {
  id: string;
  title: string;
  details: string;
  price: number;
}

export interface QuoteItem extends Article {
  quantity: number;
  isManual?: boolean;
}

export interface Quote {
  id: string;
  customerName: string;
  customerAddress?: string;
  customerPostcode?: string;
  customerCity?: string;
  customerEmail?: string;
  customerPhone?: string;
  slogan?: string;
  quoteNumber: string;
  status: QuoteStatus;
  amount: number;
  date: string;
  validUntil?: string;
  items?: QuoteItem[];
  isInvoice?: boolean;
}

export interface Stat {
  label: string;
  value: string | number;
  type: 'count' | 'currency';
}

export type ViewType = 'dashboard' | 'new-quote' | 'catalog' | 'preview';

export interface SubCategory {
  id: string;
  name: string;
  articles: Article[];
}

export interface MainCategory {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

export interface ClientData {
  name: string;
  address: string;
  zipCode: string;
  city: string;
  email: string;
  phone: string;
}

export interface QuotationMetadata {
  number: string;
  vatId: string;
  date: string;
  validUntil: string;
  logoUrl?: string;
  slogan?: string;
  isInvoice?: boolean;
}

export const convertQuoteToPDF = (quote: Quote) => {
  const client: ClientData = {
    name: quote.customerName || '',
    address: quote.customerAddress || '',
    zipCode: quote.customerPostcode || '',
    city: quote.customerCity || '',
    email: quote.customerEmail || '',
    phone: quote.customerPhone || ''
  };

  const metadata: QuotationMetadata = {
    number: quote.quoteNumber,
    vatId: '', // Vul in als je dit hebt
    date: quote.date,
    validUntil: quote.validUntil || '',
    slogan: quote.slogan,
    isInvoice: quote.isInvoice
  };

  // Zet QuoteItem[] om naar het format dat de PDF verwacht
  const items = (quote.items || []).map(item => ({
    id: item.id,
    title: item.title,
    description: item.details,
    quantity: item.quantity,
    pricePerUnit: item.price,
    vatRate: 19 // Standaard BTW, pas aan als je dit opslaat per item
  }));

  return { client, metadata, items };
};

