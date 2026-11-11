import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  History, 
  Filter, 
  ChevronRight, 
  FileText, 
  Inbox, 
  Crosshair, 
  Clock, 
  CheckCircle2,
  Calendar,
  MessageSquare
} from 'lucide-react';

export const ActivityLogView: React.FC = () => {
  const { enquiries, setSelectedEnquiryId, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  // Flatten and sort all activity events across all enquiries
  const allEvents = enquiries.flatMap(enquiry => 
    enquiry.activityHistory.map(hist => ({
      ...hist,
      enquiryId: enquiry.id,
      customerName: enquiry.customerName,
      service: enquiry.service,
      location: enquiry.location
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredEvents = allEvents.filter(ev => {
    if (filterType === 'all') return true;
    if (filterType === 'quotes' && (ev.action.toLowerCase().includes('quote') || ev.action.toLowerCase().includes('pricing'))) return true;
    if (filterType === 'surveys' && (ev.action.toLowerCase().includes('survey') || ev.action.toLowerCase().includes('drone') || ev.action.toLowerCase().includes('airspace'))) return true;
    if (filterType === 'notes' && (ev.action.toLowerCase().includes('note') || ev.action.toLowerCase().includes('internal'))) return true;
    if (filterType === 'status' && ev.action.toLowerCase().includes('status')) return true;
    return false;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#14243C] to-[#0B1424] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-4 h-4 text-[#F5B82E]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5B82E]">
              Operational Audit Trail
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">{allEvents.length} Recorded Milestones</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Activity Log & Operations Timeline
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Immutable chronological record of client submissions, drone airspace assessments, quotations dispatched, and follow-up completions.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0B1424] rounded-lg border border-white/5 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterType === 'all' ? 'bg-[#1E3557] text-[#F5B82E]' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilterType('surveys')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterType === 'surveys' ? 'bg-[#1E3557] text-[#F5B82E]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Drone Surveys
          </button>
          <button
            onClick={() => setFilterType('quotes')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterType === 'quotes' ? 'bg-[#1E3557] text-[#F5B82E]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quotes
          </button>
          <button
            onClick={() => setFilterType('status')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterType === 'status' ? 'bg-[#1E3557] text-[#F5B82E]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Status Updates
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="rounded-xl bg-[#14243C] border border-white/8 p-5 space-y-4">
        <div className="space-y-4">
          {filteredEvents.map((item, idx) => {
            const isSurvey = item.action.toLowerCase().includes('survey') || item.action.toLowerCase().includes('drone');
            const isQuote = item.action.toLowerCase().includes('quote');

            return (
              <div 
                key={item.id}
                onClick={() => {
                  setSelectedEnquiryId(item.enquiryId);
                  setActiveTab('enquiries');
                }}
                className="flex items-start gap-4 p-3 rounded-lg bg-[#0B1424]/60 border border-white/5 hover:border-[#F5B82E]/30 transition-all cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-[#14243C] text-[#F5B82E] shrink-0 mt-0.5">
                  {isSurvey ? <Crosshair className="w-4 h-4" /> : isQuote ? <FileText className="w-4 h-4" /> : <History className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white group-hover:text-[#F5B82E] transition-colors text-sm">
                      {item.action}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px] shrink-0">
                      {new Date(item.timestamp).toLocaleDateString('en-GB')} {new Date(item.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 mt-1 flex-wrap">
                    <span className="font-mono text-[#F5B82E]">{item.enquiryId}</span>
                    <span>·</span>
                    <span className="text-slate-300 font-semibold">{item.customerName}</span>
                    <span>·</span>
                    <span>{item.service}</span>
                    <span>·</span>
                    <span className="text-slate-500">By {item.actor}</span>
                  </div>

                  {item.details && (
                    <p className="mt-1.5 text-slate-300 bg-[#14243C] p-2.5 rounded text-[11px] leading-relaxed">
                      {item.details}
                    </p>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#F5B82E] shrink-0 self-center transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
