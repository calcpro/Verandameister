import React from 'react';
import { ClientData, QuotationMetadata } from '../../types';
import { DEFAULT_COMPANY } from '../../constants';

interface Props {
  items: PDFItem[];
  client: ClientData;
  metadata: QuotationMetadata;
  hideButtons?: boolean;
}

const QuotationPreview: React.FC<Props> = ({ items, client, metadata, hideButtons = false }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);
  };

  const isInvoice = metadata.isInvoice;
  const docTitle = isInvoice ? "RECHNUNG" : "ANGEBOT";
  const numLabel = isInvoice ? "Rechnungsnummer" : "Angebotsnummer";
  const dateLabel = isInvoice ? "Rechnungsdatum" : "Angebotsdatum";

  const totalInkl = items.reduce((acc, item) => acc + (item.pricePerUnit * item.quantity), 0);
  const totalExkl = items.reduce((acc, item) => acc + ((item.pricePerUnit * item.quantity) / (1 + item.vatRate / 100)), 0);
  const totalVat = totalInkl - totalExkl;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center print:block print:w-full print:bg-white">
      {/* Floating Action Bar */}
      {!hideButtons && (
        <div className="no-print sticky top-4 z-[200] flex gap-3 mb-6">
           <button 
             onClick={handlePrint}
             className="px-8 py-3 bg-[#c5a02c] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(197,160,44,0.4)] flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
             Document genereren (PDF / Print)
           </button>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white w-[210mm] print:w-full min-h-screen print:min-h-0 mx-auto pt-[10mm] px-[20mm] print:pt-0 print:px-0 pb-[20mm] text-[10pt] leading-relaxed text-gray-900 shadow-xl print:shadow-none font-sans relative overflow-hidden">
        
        {/* Logo Section */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex flex-col items-center">
            {/* Logo Icon */}
            <div className="mb-2 relative h-16 w-28 flex items-center justify-center">
               <div className="absolute w-7 h-10 bg-gray-200 left-9 bottom-2 z-0"></div>
               <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 50 H90" stroke="#c5a02c" strokeWidth="1.5" />
                  <path d="M20 50 V40 L35 30 L50 40 V50" stroke="#c5a02c" strokeWidth="1.5" />
                  <path d="M35 50 V20 H50 V30 L65 45 V50" stroke="#c5a02c" strokeWidth="1.5" />
                  <path d="M50 50 V35 L65 25 L80 35 V50" stroke="#c5a02c" strokeWidth="1.5" />
               </svg>
            </div>
            {/* Text part */}
            <div className="text-center">
              <h1 className="text-[18pt] font-bold tracking-[0.12em] leading-tight flex justify-center">
                 <span className="text-black uppercase">VERANDA</span>
                 <span className="text-[#c5a02c] uppercase">MEISTER</span>
              </h1>
              <p className="text-[#c5a02c] text-[9pt] font-medium tracking-wide mt-0.5 italic">
                {metadata.slogan || "Ihre Terrasse, unser Meisterwerk"}
              </p>
            </div>
          </div>

          {/* Company Details */}
          <div className="text-right text-[8pt] leading-[1.5] text-gray-600 flex flex-col items-end pt-2">
            <p className="font-bold text-gray-900 text-[9pt] mb-1">VerandaMeister</p>
            <p>{DEFAULT_COMPANY.address}</p>
            <p>{DEFAULT_COMPANY.zipCode} {DEFAULT_COMPANY.city}</p>
            <p><span className="font-bold text-gray-800">Tel:</span> {DEFAULT_COMPANY.phone}</p>
            <p><span className="font-bold text-gray-800">Email:</span> {DEFAULT_COMPANY.email}</p>
            <p><span className="font-bold text-gray-800">Web:</span> {DEFAULT_COMPANY.website}</p>
          </div>
        </div>

        {/* Document Title */}
        <div className="mb-6">
          <h2 className="text-[16pt] font-black text-gray-900 tracking-tight uppercase border-l-4 border-[#c5a02c] pl-4">{docTitle}</h2>
        </div>

        {/* Client Address */}
        <div className="mb-10">
          <p className="text-[11pt] font-bold text-gray-900 mb-0.5">{client.name}</p>
          <p>{client.address}</p>
          <p>{client.zipCode} {client.city}</p>
          {client.email && <p className="text-gray-500">{client.email}</p>}
        </div>

        {/* Info Bar */}
        <div className="bg-gray-50 flex justify-between px-6 py-4 rounded-xl mb-10 border border-gray-100">
          <div>
            <p className="text-[7.5pt] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">{numLabel}</p>
            <p className="font-bold text-gray-800">{metadata.number}</p>
          </div>
          <div>
            <p className="text-[7.5pt] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">{dateLabel}</p>
            <p className="font-bold text-gray-800">{metadata.date}</p>
          </div>
          {!isInvoice && (
            <div>
              <p className="text-[7.5pt] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">Gültig bis</p>
              <p className="font-bold text-gray-800">{metadata.validUntil}</p>
            </div>
          )}
        </div>

        {/* Content Table */}
        <div className="mb-10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black uppercase text-[7.5pt] tracking-widest font-bold text-left">
                <th className="py-3 pr-2 w-[40px]">Pos.</th>
                <th className="py-3 pr-4">Beschreibung</th>
                <th className="py-3 pr-4 text-right w-[110px]">Preis (inkl.)</th>
                <th className="py-3 pr-4 text-right w-[110px]">Gesamt</th>
                <th className="py-3 text-right w-[50px]">MwSt.</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-100 align-top">
                  <td className="py-6 pr-2 text-gray-400 font-bold">{idx + 1}</td>
                  <td className="py-6 pr-4">
                    <p className="font-bold text-[11pt] text-gray-900 mb-2">
                      {item.title}
                    </p>
                    <div className="whitespace-pre-wrap text-[9pt] leading-[1.6] text-gray-600 font-normal">
                      {item.description}
                    </div>
                  </td>
                  <td className="py-6 pr-4 text-right font-medium">{formatCurrency(item.pricePerUnit)}</td>
                  <td className="py-6 pr-4 text-right font-bold text-gray-900">{formatCurrency(item.pricePerUnit * item.quantity)}</td>
                  <td className="py-6 text-right text-gray-400">{item.vatRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary */}
        <div className="flex justify-end pt-4 break-inside-avoid">
          <div className="w-[280px] bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center py-1 text-gray-500 text-[9pt]">
              <span>Netto Summe</span>
              <span>{formatCurrency(totalExkl)}</span>
            </div>
            <div className="flex justify-between items-center py-1 text-gray-500 text-[9pt]">
              <span>MwSt. Betrag</span>
              <span>{formatCurrency(totalVat)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-gray-200 font-bold text-[13pt] mt-3 text-gray-900">
              <span>GESAMT</span>
              <span className="text-[#c5a02c]">{formatCurrency(totalInkl)}</span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-16 pt-10 border-t border-gray-100 space-y-8 break-inside-avoid">
          {!isInvoice && (
            <div className="bg-[#c5a02c]/5 p-4 rounded-xl border-l-4 border-[#c5a02c]">
                <p className="font-bold text-gray-900 text-[9.5pt] mb-1">Vertrauensgarantie:</p>
                <p className="text-gray-700 text-[9pt] italic leading-snug">Keine Anzahlung – Sie zahlen erst nach der vollständigen und fachgerechten Montage vor Ort.</p>
            </div>
          )}
          
          <div className="flex justify-between items-end">
              <div className="max-w-[400px]">
                  <p className="text-[8.5pt] leading-relaxed text-gray-500">
                    {isInvoice 
                      ? "Bitte begleichen Sie den Rechnungsbetrag innerhalb van 14 Tagen ohne Abzug. Vielen Dank für Ihren Auftrag!"
                      : `Dieses Angebot ist freibleibend und bis zum ${metadata.validUntil} gültig. Wir freuen uns auf Ihre Rückmeldung.`
                    }
                  </p>
                  <div className="mt-4 text-[7.5pt] text-gray-400">
                    <p>VerandaMeister - {DEFAULT_COMPANY.address} - {DEFAULT_COMPANY.zipCode} {DEFAULT_COMPANY.city}</p>
                    <p>{DEFAULT_COMPANY.website} | {DEFAULT_COMPANY.email}</p>
                  </div>
              </div>
              {!isInvoice && (
                <div className="w-48 h-12 border-b border-gray-300 relative">
                    <p className="absolute -top-6 left-0 text-[7.5pt] text-gray-400 uppercase tracking-widest font-bold">Unterschrift / Annahme</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPreview;