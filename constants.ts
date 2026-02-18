
import { Quote, QuoteStatus, Article, MainCategory } from './types';

// Export Article interface for other components to use
export type { Article };

export const COLORS = {
  primary: '#C5A021', // Gold from logo
  dark: '#1A1A1A',    // Black from logo
  bg: '#F8F9FA',
  cardBg: '#FFFFFF',
};

export const MOCK_QUOTES: Quote[] = [
  { id: '1', customerName: 'Alexanda Schäfer', quoteNumber: '#2026257', status: QuoteStatus.AANGEMAAKT, amount: 30110, date: '8-2-2025' },
  { id: '2', customerName: 'Michaela Kolbe', quoteNumber: '#2026256', status: QuoteStatus.AANGEMAAKT, amount: 8986, date: '8-2-2025' },
  { id: '3', customerName: 'Tim', quoteNumber: '#2026255', status: QuoteStatus.AANGEMAAKT, amount: 18604, date: '8-2-2025' },
  { id: '4', customerName: 'Silke Bernhardt', quoteNumber: '#2026254', status: QuoteStatus.AANGEMAAKT, amount: 19654, date: '8-2-2025' },
  { id: '5', customerName: 'Stephan Jäger', quoteNumber: '#2026253', status: QuoteStatus.AANGEMAAKT, amount: 24248, date: '8-2-2025' },
  { id: '6', customerName: 'Heiko Schumacher', quoteNumber: '#2026252', status: QuoteStatus.AANGEMAAKT, amount: 13883, date: '8-2-2025' },
  { id: '7', customerName: 'Daniel Müller', quoteNumber: '#2026251', status: QuoteStatus.AANGEMAAKT, amount: 15732, date: '8-2-2025' },
  { id: '8', customerName: 'Thomas Schmidt', quoteNumber: '#2025413', status: QuoteStatus.AANGEMAAKT, amount: 9122, date: '6-2-2025' },
];

/**
 * Initial catalog data used by both QuoteGenerator and Catalog components
 */
export const INITIAL_CATALOG: MainCategory[] = [
  {
    id: '1',
    name: 'VERANDA POLYCARBONAAT',
    subCategories: [
      {
        id: '1-1',
        name: '3 Meter',
        articles: [
          {
            id: 'a1',
            title: 'Premium Aluminium Terrassenüberdachung 300 × 200',
            details: '- Dacheindeckung: Verbundglas 44.2 – Opal (Sicherheitsglas)\n- Pulverbeschichtung: Anthrazit (RAL 7016), 80M-Qualität\n- Afmetingen: 604 cm x 301 cm',
            price: 1580
          },
          {
            id: 'a2',
            title: 'Premium Aluminium Terrassenüberdachung 300 × 250',
            details: '- Dacheindeckung: Verbundglas 44.2 – Opal (Sicherheitsglas)\n- Pulverbeschichtung: Anthrazit (RAL 7016), 80M-Qualität\n- Afmetingen: 604 cm x 301 cm',
            price: 1930
          }
        ]
      },
      { id: '1-2', name: '4 Meter', articles: [] },
      { id: '1-3', name: '5 Meter', articles: [] },
      { id: '1-4', name: '6 Meter', articles: [] },
      { id: '1-5', name: '7 Meter', articles: [] }
    ]
  },
  { id: '2', name: 'GLAZENSCHUIFWAND VOOR', subCategories: [] },
  { id: '3', name: 'KEIL', subCategories: [] },
  { id: '4', name: 'SONNENSCHUTZ', subCategories: [] },
  { id: '5', name: 'EXTRAS', subCategories: [] },
  { id: '6', name: 'SCHIEBETUR', subCategories: [] },
  { id: '7', name: 'ZIJWAND', subCategories: [] }
];

export const DEFAULT_COMPANY = {
  name: "VerandaMeister",
  address: "Kraanstraat",
  zipCode: "6541 EJ",
  city: "Nijmegen",
  phone: "+49 178 2917922",
  email: "kontakt@verandameister.de",
  website: "www.verandameister.de"
};