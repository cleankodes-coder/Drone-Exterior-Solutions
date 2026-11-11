import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Quotation, QuoteLineItem } from '../../types';
import { 
  FileText, 
  Plus, 
  Send, 
  Printer, 
  CheckCircle2, 
  Clock, 
  X, 
  Trash2, 
  ShieldCheck, 
  Eye, 
  Edit3,
  ExternalLink,
  Receipt
} from 'lucide-react';

interface QuotationManagerProps {
  initialQuoteToEdit?: Quotation | null;
}

export const QuotationManager: React.FC<QuotationManagerProps> = ({ initialQuoteToEdit }) => {
  const { quotes, enquiries, addQuote, updateQuote, simulateSendQuote, deleteQuote } = useApp();

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'preview'>('list');
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(initialQuoteToEdit || quotes[0] || null);

  // Quote Creation / Editing Form State
  const [targetEnquiryId, setTargetEnquiryId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [service, setService] = useState('');
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([
    { id: 'li-1', description: 'Exterior Wash & Biocide Softwash Application', quantity: 1, unit: 'Job', unitPrice: 850, total: 850 },
    { id: 'li-2', description: 'Gutter Clearance & Downpipe Inspection', quantity: 1, unit: 'Service', unitPrice: 120, total: 120 }
  ]);
  const [applyVat, setApplyVat] = useState(false);
  const [notesAndExclusions, setNotesAndExclusions] = useState('Payment terms: 14 days from completion. Access to external mains water supply required on site. Quotation valid for 30 days. Fictional demo quote.');

  // Subtotal and Total math
  const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const vatRate = 0.20;
  const vatAmount = applyVat ? Math.round(subtotal * vatRate * 100) / 100 : 0;
  const totalAmount = subtotal + vatAmount;

  const handleSelectEnquiryForQuote = (enqId: string) => {
    setTargetEnquiryId(enqId);
    const enq = enquiries.find(e => e.id === enqId);
    if (enq) {
      setCustomerName(enq.customerName);
      setCompanyName(enq.companyName || '');
      setSiteAddress(`${enq.propertyType}, ${enq.location}`);
      setService(enq.service);
      setApplyVat(enq.division === 'commercial' || enq.division === 'drone_specialist');
    }
  };

  const handleAddLineItem = () => {
    setLineItems(prev => [
      ...prev,
      {
        id: `li-${Date.now()}`,
        description: 'Additional exterior cleaning service',
        quantity: 1,
        unit: 'Unit',
        unitPrice: 150,
        total: 150
      }
    ]);
  };

  const handleUpdateLineItem = (id: string, field: keyof QuoteLineItem, value: any) => {
    setLineItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        updated.total = updated.quantity * updated.unitPrice;
      }
      return updated;
    }));
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(prev => prev.filter(i => i.id !== id));
  };

  const handleSaveQuote = (status: Quotation['status'] = 'Draft') => {
    if (!customerName.trim() || lineItems.length === 0) return;

    const daysValid = new Date();
    daysValid.setDate(daysValid.getDate() + 30);

    const created = addQuote({
      enquiryId: targetEnquiryId || `ENQ-GEN-${Date.now()}`,
      quoteNumber: `DES-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      companyName: companyName || undefined,
      siteAddress,
      service,
      division: service.includes('Commercial') || service.includes('Drone') ? 'commercial' : 'residential',
      validUntil: daysValid.toISOString(),
      status,
      lineItems,
      subtotal,
      applyVat,
      vatRate,
      vatAmount,
      totalAmount,
      notesAndExclusions,
      approvedBy: 'Scott P.'
    });

    setSelectedQuote(created);
    setActiveTab('preview');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#14243C] to-[#0B1424] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-4 h-4 text-[#F5B82E]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5B82E]">
              Commercial & Domestic Quotations
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">{quotes.length} Formal Proposals</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Quotation Management & PDF Generator
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Human-approved itemised quotations with optional VAT toggle, custom line items, and simulated client dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('create')}
            className="px-3.5 py-2 bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] font-bold text-xs rounded-lg transition-all shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Quote</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs between List and Builder */}
      <div className="flex border-b border-white/10 text-xs">
        <button
          onClick={() => setActiveTab('list')}
          className={`py-2.5 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'list'
              ? 'border-[#F5B82E] text-[#F5B82E]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          All Quotations ({quotes.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`py-2.5 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'create'
              ? 'border-[#F5B82E] text-[#F5B82E]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Quote Builder
        </button>
        {selectedQuote && (
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2.5 px-4 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'border-[#F5B82E] text-[#F5B82E]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Preview ({selectedQuote.quoteNumber})
          </button>
        )}
      </div>

      {/* VIEW: QUOTATIONS LIST */}
      {activeTab === 'list' && (
        <div className="rounded-xl bg-[#14243C] border border-white/8 overflow-hidden shadow">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0E1A2D] text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3.5 font-semibold">Quote #</th>
                <th className="py-3 px-3.5 font-semibold">Client / Company</th>
                <th className="py-3 px-3.5 font-semibold">Service</th>
                <th className="py-3 px-3.5 font-semibold">Total Amount</th>
                <th className="py-3 px-3.5 font-semibold">VAT</th>
                <th className="py-3 px-3.5 font-semibold">Status</th>
                <th className="py-3 px-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {quotes.map((q) => (
                <tr
                  key={q.id}
                  onClick={() => {
                    setSelectedQuote(q);
                    setActiveTab('preview');
                  }}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3.5 font-mono text-[#F5B82E] font-medium">
                    {q.quoteNumber}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="font-bold text-white block">{q.customerName}</span>
                    {q.companyName && (
                      <span className="text-[11px] text-slate-400 block truncate">{q.companyName}</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-slate-300">
                    {q.service}
                  </td>
                  <td className="py-3 px-3.5 font-mono font-bold text-white">
                    £{q.totalAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3.5 text-slate-400">
                    {q.applyVat ? 'Inc. 20% VAT' : 'No VAT'}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      q.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-300' :
                      q.status === 'Sent' ? 'bg-blue-500/20 text-blue-300' :
                      q.status === 'Draft' ? 'bg-slate-700/50 text-slate-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {q.status !== 'Sent' && q.status !== 'Accepted' && (
                        <button
                          onClick={() => simulateSendQuote(q.id)}
                          className="px-2 py-1 text-[11px] bg-[#1E3557] hover:bg-[#25426c] text-[#F5B82E] font-medium rounded transition-colors flex items-center gap-1 cursor-pointer"
                          title="Simulate sending quote to customer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Simulate Send</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedQuote(q);
                          setActiveTab('preview');
                        }}
                        className="px-2 py-1 text-[11px] bg-white/5 hover:bg-white/10 text-white rounded transition-colors"
                      >
                        Preview
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW: QUOTE BUILDER FORM */}
      {activeTab === 'create' && (
        <div className="p-5 rounded-xl bg-[#14243C] border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">Create Sample Quotation</h2>
              <p className="text-xs text-slate-400">
                Manually configurable line items. No arbitrary unapproved AI pricing.
              </p>
            </div>
            <span className="text-xs text-[#F5B82E] font-medium">
              Demo calculation engine
            </span>
          </div>

          {/* Optional Pre-fill from Enquiry */}
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-semibold block">
              Pre-fill from Existing Enquiry (Optional)
            </label>
            <select
              value={targetEnquiryId}
              onChange={(e) => handleSelectEnquiryForQuote(e.target.value)}
              className="w-full bg-[#0B1424] text-xs text-white p-2.5 rounded-lg border border-white/10 focus:border-[#F5B82E]"
            >
              <option value="">-- Choose an enquiry to populate client details --</option>
              {enquiries.map(e => (
                <option key={e.id} value={e.id}>
                  {e.id} · {e.customerName} ({e.service})
                </option>
              ))}
            </select>
          </div>

          {/* Client & Address Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Customer Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Richard Thornton"
                className="w-full bg-[#0B1424] text-white p-2.5 rounded-lg border border-white/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Company / Estate Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Optional commercial trading name"
                className="w-full bg-[#0B1424] text-white p-2.5 rounded-lg border border-white/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Service Specification</label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g. Roof Softwash & Gutter Clearance"
                className="w-full bg-[#0B1424] text-white p-2.5 rounded-lg border border-white/10"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-300 font-medium block">Site Address / Property Location</label>
            <input
              type="text"
              value={siteAddress}
              onChange={(e) => setSiteAddress(e.target.value)}
              placeholder="e.g. 14 Highfield Close, Winchester, SO22 5RT"
              className="w-full bg-[#0B1424] text-white p-2.5 rounded-lg border border-white/10"
            />
          </div>

          {/* Line Items Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Itemised Works & Schedule of Rates
              </span>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="px-2.5 py-1 text-xs bg-[#1E3557] text-[#F5B82E] font-medium rounded hover:bg-[#25426c] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {lineItems.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-[#0B1424] p-2.5 rounded-lg text-xs">
                  <div className="col-span-6 sm:col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full bg-transparent text-white border-b border-white/10 focus:border-[#F5B82E] py-1"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleUpdateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                      className="w-full bg-transparent text-white border-b border-white/10 text-right py-1"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">£</span>
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent text-white border-b border-white/10 text-right py-1"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 text-right font-mono font-semibold text-white">
                    £{(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(item.id)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotals & VAT Toggle */}
          <div className="bg-[#0B1424] p-4 rounded-xl border border-white/5 space-y-2 text-xs max-w-sm ml-auto">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-white">£{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-t border-b border-white/5">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyVat}
                  onChange={(e) => setApplyVat(e.target.checked)}
                  className="rounded bg-[#14243C] border-white/20 text-[#F5B82E]"
                />
                <span>Apply Standard VAT (20%)</span>
              </label>
              <span className="font-mono text-slate-400">£{vatAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm font-bold text-white pt-1">
              <span>Total Quotation:</span>
              <span className="font-mono text-[#F5B82E]">£{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSaveQuote('Draft')}
              className="px-4 py-2 text-xs bg-[#1E3557] hover:bg-[#25426c] text-white font-semibold rounded-lg cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSaveQuote('Sent')}
              className="px-4 py-2 text-xs bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] font-bold rounded-lg cursor-pointer"
            >
              Save & Preview
            </button>
          </div>
        </div>
      )}

      {/* VIEW: POLISHED PRINTABLE QUOTE PREVIEW */}
      {activeTab === 'preview' && selectedQuote && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#14243C] p-3 rounded-lg border border-white/10 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-[#F5B82E]">{selectedQuote.quoteNumber}</span>
              <span className="text-slate-400">Status: <strong className="text-white">{selectedQuote.status}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-[#1E3557] hover:bg-[#25426c] text-white rounded font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              {selectedQuote.status !== 'Sent' && selectedQuote.status !== 'Accepted' && (
                <button
                  onClick={() => simulateSendQuote(selectedQuote.id)}
                  className="px-3.5 py-1.5 bg-[#F5B82E] text-[#0B1424] font-bold rounded flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simulate Send to Client</span>
                </button>
              )}
            </div>
          </div>

          {/* Printable Document Sheet */}
          <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl max-w-4xl mx-auto font-sans">
            {/* Header Lockup */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[#0B1424] text-[#F5B82E] font-black flex items-center justify-center text-sm">
                    DES
                  </div>
                  <span className="text-xl font-bold tracking-tight text-slate-900">
                    Drone Exterior Solutions Ltd
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Specialist External Cleaning & Commercial Drone Operations
                  <br />Hampshire, Surrey & West Sussex
                  <br />Tel: 07406 387071 · info@droneexteriorsolutions.co.uk
                </p>
              </div>

              <div className="text-right sm:self-start">
                <span className="text-2xl font-bold uppercase tracking-wider text-slate-800 block">
                  QUOTATION
                </span>
                <span className="font-mono text-sm font-bold text-slate-900 block mt-1">
                  {selectedQuote.quoteNumber}
                </span>
                <span className="text-xs text-slate-500 block">
                  Date: {new Date(selectedQuote.createdAt).toLocaleDateString('en-GB')}
                </span>
                <span className="text-xs text-slate-500 block">
                  Valid until: {new Date(selectedQuote.validUntil).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-8 my-8 text-xs">
              <div>
                <span className="uppercase font-bold text-slate-400 block tracking-wider text-[10px] mb-1">
                  CLIENT DETAILS
                </span>
                <p className="font-bold text-sm text-slate-900">{selectedQuote.customerName}</p>
                {selectedQuote.companyName && (
                  <p className="text-slate-600 font-medium">{selectedQuote.companyName}</p>
                )}
                <p className="text-slate-600 mt-1">{selectedQuote.siteAddress}</p>
              </div>

              <div>
                <span className="uppercase font-bold text-slate-400 block tracking-wider text-[10px] mb-1">
                  SERVICE SPECIFICATION
                </span>
                <p className="font-bold text-sm text-slate-900">{selectedQuote.service}</p>
                <p className="text-slate-600 mt-1">
                  Division: {selectedQuote.division === 'commercial' ? 'Commercial & Specialist' : 'Residential Exterior'}
                </p>
                <p className="text-slate-500 text-[11px]">
                  Approved by: {selectedQuote.approvedBy || 'Scott P. (Operations)'}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left border-collapse text-xs my-6">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-700 uppercase tracking-wider text-[10px]">
                  <th className="py-2 font-bold">Item Description</th>
                  <th className="py-2 text-right font-bold w-16">Qty</th>
                  <th className="py-2 text-right font-bold w-24">Unit Rate</th>
                  <th className="py-2 text-right font-bold w-28">Total (GBP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedQuote.lineItems.map((li) => (
                  <tr key={li.id}>
                    <td className="py-3 text-slate-800 pr-4">
                      <span className="font-semibold block">{li.description}</span>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-700">
                      {li.quantity}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-700">
                      £{li.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900">
                      £{(li.quantity * li.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Subtotal & Totals Box */}
            <div className="flex justify-end my-6 text-xs">
              <div className="w-64 space-y-1.5 border-t border-slate-200 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">£{selectedQuote.subtotal.toFixed(2)}</span>
                </div>
                {selectedQuote.applyVat && (
                  <div className="flex justify-between text-slate-600">
                    <span>VAT (20%):</span>
                    <span className="font-mono font-semibold">£{selectedQuote.vatAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t-2 border-slate-900">
                  <span>Total Amount:</span>
                  <span className="font-mono">£{selectedQuote.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="border-t border-slate-200 pt-6 mt-6 text-[11px] text-slate-500 space-y-2">
              <p>
                <strong className="text-slate-800">Operational Notes:</strong> {selectedQuote.notesAndExclusions}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                * Note: This document is a sales-concept demonstration for Drone Exterior Solutions Ltd. No live contract or financial liability is created.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
