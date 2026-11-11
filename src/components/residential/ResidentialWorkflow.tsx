import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EnquiryRecord, EnquiryStatus } from '../../types';
import { 
  Home, 
  Columns3, 
  List, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const RESIDENTIAL_STAGES: { id: EnquiryStatus; label: string; countColor: string }[] = [
  { id: 'New Enquiry', label: 'New Enquiries', countColor: 'text-[#F5B82E]' },
  { id: 'Awaiting Information', label: 'Awaiting Photos / Info', countColor: 'text-amber-400' },
  { id: 'Awaiting Assessment', label: 'Awaiting Assessment', countColor: 'text-sky-400' },
  { id: 'Quote Preparation', label: 'Quote Preparation', countColor: 'text-purple-400' },
  { id: 'Quote Sent', label: 'Quote Sent', countColor: 'text-blue-400' },
  { id: 'Follow-up Due', label: 'Follow-up Due', countColor: 'text-amber-400' },
  { id: 'Booked', label: 'Booked & Scheduled', countColor: 'text-emerald-400' },
  { id: 'Completed', label: 'Completed', countColor: 'text-slate-400' }
];

export const ResidentialWorkflow: React.FC = () => {
  const { enquiries, updateEnquiryStatus, setSelectedEnquiryId } = useApp();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Filter strictly residential jobs
  const residentialEnquiries = enquiries.filter(e => e.division === 'residential');

  const handleMoveStage = (enquiryId: string, currentStatus: EnquiryStatus, direction: 'next' | 'prev') => {
    const currentIndex = RESIDENTIAL_STAGES.findIndex(s => s.id === currentStatus);
    if (currentIndex === -1) return;

    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < RESIDENTIAL_STAGES.length) {
      updateEnquiryStatus(enquiryId, RESIDENTIAL_STAGES[nextIndex].id, `Moved to ${RESIDENTIAL_STAGES[nextIndex].label} via Residential Kanban`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#14243C] to-[#0B1424] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Residential Cleaning Pipeline
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">{residentialEnquiries.length} Active Records</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Domestic Roofs, Gutters, Patios & Exterior Care
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Managing domestic inquiries across Hampshire, Surrey & West Sussex. Every roof and render job undergoes human assessment to confirm the gentle softwash technique.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center p-1 bg-[#0B1424] rounded-lg border border-white/5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-[#1E3557] text-[#F5B82E]' : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <Columns3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#1E3557] text-[#F5B82E]' : 'text-slate-400 hover:text-white'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Human Assessment Notice */}
      <div className="p-3.5 rounded-lg bg-[#14243C] border border-white/8 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-4 h-4 text-[#F5B82E] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Human Engineering Standard:</strong> Traditional residential cleaning uses specialized ground-based telescopic vacuum systems (SkyVac), gentle wire scrapers from ridge ladders, and biocide treatments. Never promise high-pressure blasting on delicate roof tiles or historic masonry.
        </p>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 items-start min-h-[600px]">
          {RESIDENTIAL_STAGES.map((stage, idx) => {
            const stageItems = residentialEnquiries.filter(e => e.status === stage.id);

            return (
              <div
                key={stage.id}
                className="w-72 shrink-0 bg-[#0E1A2D] rounded-xl border border-white/8 flex flex-col max-h-[750px]"
              >
                {/* Stage Header */}
                <div className="p-3 border-b border-white/8 flex items-center justify-between bg-[#14243C] rounded-t-xl">
                  <span className="font-semibold text-xs text-white truncate">
                    {stage.label}
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#0B1424] ${stage.countColor}`}>
                    {stageItems.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                  {stageItems.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-500 italic">
                      No jobs in this stage
                    </div>
                  ) : (
                    stageItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedEnquiryId(item.id)}
                        className="p-3 rounded-lg bg-[#14243C] border border-white/5 hover:border-[#F5B82E]/40 transition-all cursor-pointer group shadow-sm space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-[#F5B82E] font-medium">{item.id}</span>
                          <span className="text-slate-400">{item.contactMethod}</span>
                        </div>

                        <div>
                          <span className="font-bold text-white text-xs block group-hover:text-[#F5B82E] transition-colors">
                            {item.customerName}
                          </span>
                          <span className="text-[11px] text-slate-300 font-medium block truncate">
                            {item.service}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>

                        {item.sampleQuoteAmount && (
                          <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
                            Sample Quote: £{item.sampleQuoteAmount}
                          </div>
                        )}

                        {/* Move stage controls */}
                        <div 
                          className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {idx > 0 ? (
                            <button
                              onClick={() => handleMoveStage(item.id, item.status, 'prev')}
                              className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-[#0B1424] transition-colors cursor-pointer"
                            >
                              ← Back
                            </button>
                          ) : <div />}

                          {idx < RESIDENTIAL_STAGES.length - 1 && (
                            <button
                              onClick={() => handleMoveStage(item.id, item.status, 'next')}
                              className="text-[#F5B82E] hover:text-[#ffd56b] font-semibold px-2 py-0.5 rounded bg-[#0B1424] hover:bg-[#1E3557] transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>Next Stage</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl bg-[#14243C] border border-white/8 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0E1A2D] text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3.5 font-semibold">ID</th>
                <th className="py-3 px-3.5 font-semibold">Customer</th>
                <th className="py-3 px-3.5 font-semibold">Service</th>
                <th className="py-3 px-3.5 font-semibold">Property</th>
                <th className="py-3 px-3.5 font-semibold">Location</th>
                <th className="py-3 px-3.5 font-semibold">Current Stage</th>
                <th className="py-3 px-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {residentialEnquiries.map(item => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedEnquiryId(item.id)}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3.5 font-mono text-[#F5B82E]">{item.id}</td>
                  <td className="py-3 px-3.5 font-bold text-white">{item.customerName}</td>
                  <td className="py-3 px-3.5 text-slate-200">{item.service}</td>
                  <td className="py-3 px-3.5 text-slate-400">{item.propertyType}</td>
                  <td className="py-3 px-3.5 text-slate-300">{item.location}</td>
                  <td className="py-3 px-3.5">
                    <span className="text-xs text-white font-medium bg-[#0B1424] px-2 py-0.5 rounded border border-white/5">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEnquiryId(item.id);
                      }}
                      className="text-xs text-[#F5B82E] hover:underline"
                    >
                      Open Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
