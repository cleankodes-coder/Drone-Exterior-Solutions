import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EnquiryRecord, EnquiryStatus, ServiceDivision } from '../../types';
import { EnquiryDetailModal } from './EnquiryDetailModal';
import { NewEnquiryModal } from './NewEnquiryModal';
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpDown, 
  ChevronRight, 
  SlidersHorizontal,
  Home,
  Building2,
  Crosshair,
  Sparkles,
  Bot,
  FileText
} from 'lucide-react';

interface EnquiryListProps {
  onOpenAssistantForEnquiry: (enquiryId: string) => void;
  onCreateQuoteForEnquiry: (enquiry: EnquiryRecord) => void;
}

export const EnquiryList: React.FC<EnquiryListProps> = ({
  onOpenAssistantForEnquiry,
  onCreateQuoteForEnquiry
}) => {
  const { 
    enquiries, 
    selectedEnquiryId, 
    setSelectedEnquiryId,
    selectedEnquiry 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Filtered & sorted list
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(enq => {
      // Search matching
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesName = enq.customerName.toLowerCase().includes(query);
        const matchesCompany = enq.companyName?.toLowerCase().includes(query);
        const matchesId = enq.id.toLowerCase().includes(query);
        const matchesLocation = enq.location.toLowerCase().includes(query);
        const matchesService = enq.service.toLowerCase().includes(query);
        if (!matchesName && !matchesCompany && !matchesId && !matchesLocation && !matchesService) {
          return false;
        }
      }

      // Division filter
      if (divisionFilter !== 'all') {
        if (divisionFilter === 'residential' && enq.division !== 'residential') return false;
        if (divisionFilter === 'commercial' && enq.division !== 'commercial') return false;
        if (divisionFilter === 'drone_specialist' && enq.division !== 'drone_specialist') return false;
      }

      // Status filter
      if (statusFilter !== 'all' && enq.status !== statusFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.dateReceived).getTime() - new Date(b.dateReceived).getTime();
      }
      if (sortBy === 'priority') {
        const weight = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      }
      return 0;
    });
  }, [enquiries, searchQuery, divisionFilter, statusFilter, sortBy]);

  const allStatuses: EnquiryStatus[] = [
    'New Enquiry',
    'Awaiting Information',
    'Awaiting Assessment',
    'Remote Survey Pending',
    'Survey Under Review',
    'Quote Preparation',
    'Quote Sent',
    'Follow-up Due',
    'Booked',
    'In Progress',
    'Completed'
  ];

  return (
    <div className="space-y-4">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Enquiry Management</span>
            <span className="text-xs font-mono text-slate-400 bg-[#14243C] px-2 py-0.5 rounded border border-white/10">
              {filteredEnquiries.length} of {enquiries.length} records
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Triaged customer requests across Hampshire, Surrey and West Sussex
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-3.5 py-2 bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] font-bold text-xs rounded-lg transition-all shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Enquiry</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-3.5 rounded-xl bg-[#14243C] border border-white/8 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter customer, location, service..."
              className="w-full bg-[#0B1424] text-xs text-slate-200 placeholder-slate-400 pl-8 pr-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E]"
            />
          </div>

          {/* Division Filter */}
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="bg-[#0B1424] text-xs text-slate-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E] cursor-pointer"
          >
            <option value="all">All Divisions (Residential & Commercial)</option>
            <option value="residential">Residential Exterior Cleaning</option>
            <option value="commercial">Commercial & Specialist</option>
            <option value="drone_specialist">Commercial Drone Cleaning</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0B1424] text-xs text-slate-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E] cursor-pointer"
          >
            <option value="all">All Enquiry Statuses</option>
            {allStatuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0B1424] text-xs text-slate-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E] cursor-pointer"
          >
            <option value="newest">Sort: Newest Received First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="priority">Sort: Highest Priority</option>
          </select>
        </div>
      </div>

      {/* Main Table / Desktop View */}
      <div className="rounded-xl bg-[#14243C] border border-white/8 overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0E1A2D] text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3.5 font-semibold">Customer</th>
                <th className="py-3 px-3.5 font-semibold">Service</th>
                <th className="py-3 px-3.5 font-semibold hidden md:table-cell">Property Type</th>
                <th className="py-3 px-3.5 font-semibold">Location</th>
                <th className="py-3 px-3.5 font-semibold hidden lg:table-cell">Source</th>
                <th className="py-3 px-3.5 font-semibold">Status</th>
                <th className="py-3 px-3.5 font-semibold hidden sm:table-cell">Received</th>
                <th className="py-3 px-3.5 font-semibold">Priority</th>
                <th className="py-3 px-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No enquiries match the selected filters or search query.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => {
                  const isDrone = enq.division === 'drone_specialist';
                  const isCommercial = enq.division === 'commercial';

                  return (
                    <tr
                      key={enq.id}
                      onClick={() => setSelectedEnquiryId(enq.id)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[#F5B82E] font-medium">
                            {enq.id}
                          </span>
                        </div>
                        <span className="font-bold text-white group-hover:text-[#F5B82E] transition-colors block text-sm">
                          {enq.customerName}
                        </span>
                        {enq.companyName && (
                          <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                            {enq.companyName}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="font-medium text-slate-200 block">
                          {enq.service}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {isDrone ? 'Specialist Drone' : isCommercial ? 'Commercial' : 'Residential'}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 hidden md:table-cell text-slate-300 max-w-[180px] truncate">
                        {enq.propertyType}
                      </td>

                      <td className="py-3 px-3.5 text-slate-300 whitespace-nowrap">
                        {enq.location}
                      </td>

                      <td className="py-3 px-3.5 hidden lg:table-cell text-slate-400">
                        {enq.contactMethod}
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="text-xs text-slate-200 block font-medium">
                          {enq.status}
                        </span>
                        {enq.droneSurvey && (
                          <span className="text-[10px] text-[#F5B82E] font-mono block">
                            Survey: {enquiryShortDecision(enq.droneSurvey.suitabilityDecision)}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3.5 hidden sm:table-cell text-slate-400 whitespace-nowrap">
                        {new Date(enq.dateReceived).toLocaleDateString('en-GB')}
                      </td>

                      <td className="py-3 px-3.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          enq.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300' :
                          enq.priority === 'High' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {enq.priority}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEnquiryId(enq.id);
                          }}
                          className="px-2.5 py-1 text-xs bg-[#1E3557] hover:bg-[#25426c] text-[#F5B82E] rounded border border-white/10 transition-colors font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Enquiry Detail Modal */}
      {selectedEnquiry && (
        <EnquiryDetailModal
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiryId(null)}
          onOpenAssistantForEnquiry={onOpenAssistantForEnquiry}
          onCreateQuoteForEnquiry={onCreateQuoteForEnquiry}
        />
      )}

      {/* New Enquiry Modal */}
      {isNewModalOpen && (
        <NewEnquiryModal onClose={() => setIsNewModalOpen(false)} />
      )}
    </div>
  );
};

function enquiryShortDecision(decision: string): string {
  if (decision === 'Approved by Team') return 'Approved';
  if (decision === 'In Progress') return 'Assessing';
  if (decision === 'Awaiting Review') return 'Review Due';
  if (decision === 'Not Suitable') return 'Ground Only';
  return 'Not Started';
}
