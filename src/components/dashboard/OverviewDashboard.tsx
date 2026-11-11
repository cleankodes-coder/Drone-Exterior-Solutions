import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Inbox, 
  Clock, 
  Crosshair, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles, 
  Home, 
  Building2, 
  ChevronRight,
  ShieldAlert,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const { 
    enquiries, 
    quotes, 
    followUps, 
    appointments, 
    setSelectedEnquiryId, 
    setActiveTab, 
    setIsSimulatorOpen 
  } = useApp();

  const [activeChartTab, setActiveChartTab] = useState<'weekly' | 'category'>('weekly');

  // KPI calculations directly from demo state
  const totalCount = enquiries.length;
  const newCount = enquiries.filter(e => e.status === 'New Enquiry').length;
  const awaitingAssessmentCount = enquiries.filter(e => 
    e.status === 'Awaiting Assessment' || e.status === 'Awaiting Information'
  ).length;
  const surveysRequiredCount = enquiries.filter(e => 
    e.droneSurvey && (e.droneSurvey.suitabilityDecision === 'In Progress' || e.droneSurvey.suitabilityDecision === 'Awaiting Review' || e.status === 'Remote Survey Pending' || e.status === 'Survey Under Review')
  ).length;
  const quotesSentCount = enquiries.filter(e => e.status === 'Quote Sent').length;
  const followUpsDueCount = followUps.filter(f => f.status === 'Pending').length;
  const bookedCount = enquiries.filter(e => e.status === 'Booked' || e.status === 'In Progress' || e.status === 'Completed').length;

  // Breakdown by division
  const residentialCount = enquiries.filter(e => e.division === 'residential').length;
  const commercialCount = enquiries.filter(e => e.division === 'commercial' || e.division === 'drone_specialist').length;
  const droneSpecificCount = enquiries.filter(e => e.division === 'drone_specialist').length;

  // Lead source counts
  const sourceStats = {
    website: enquiries.filter(e => e.contactMethod === 'Website Form').length,
    whatsapp: enquiries.filter(e => e.contactMethod === 'WhatsApp').length,
    email: enquiries.filter(e => e.contactMethod === 'Email').length,
    phone: enquiries.filter(e => e.contactMethod === 'Phone').length,
  };

  // Recent enquiries sorted by date
  const recentEnquiries = [...enquiries]
    .sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime())
    .slice(0, 6);

  // Urgent pending follow-ups
  const pendingFollowUps = followUps.filter(f => f.status === 'Pending').slice(0, 4);

  // Service categories breakdown
  const categoryCounts: { [key: string]: number } = {};
  enquiries.forEach(e => {
    let cat = 'Other Cleaning';
    if (e.service.includes('Roof') || e.service.includes('Moss')) cat = 'Roofs & Moss';
    else if (e.service.includes('Drone')) cat = 'Commercial Drone';
    else if (e.service.includes('Cladding') || e.service.includes('Warehouse')) cat = 'Cladding & Warehouses';
    else if (e.service.includes('Gutter') || e.service.includes('Fascia')) cat = 'Gutters & Fascias';
    else if (e.service.includes('Solar')) cat = 'Solar Arrays';
    else if (e.service.includes('Driveway') || e.service.includes('Patio')) cat = 'Driveways & Patios';
    else if (e.service.includes('Glazing') || e.service.includes('Atria')) cat = 'High-Level Glazing';
    else if (e.service.includes('Render') || e.service.includes('Wall')) cat = 'Render Softwashing';

    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome & Operations Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-[#14243C] via-[#0E1A2D] to-[#0B1424] border border-white/10 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-[#F5B82E]">
              Operational Overview
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Hampshire, Surrey & West Sussex</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Exterior Cleaning & Drone Operations Command
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Real-time pipeline monitoring for residential enquiries, high-level commercial tenders, and CAA-authorised drone cleaning surveys.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="px-4 py-2 bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] font-bold text-xs rounded-lg transition-all shadow-md shadow-[#F5B82E]/10 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulate Customer Enquiry</span>
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className="px-3.5 py-2 bg-[#1E3557]/80 hover:bg-[#1E3557] text-white font-medium text-xs rounded-lg border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (7 metrics calculated from live records) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total Enquiries */}
        <div 
          onClick={() => setActiveTab('enquiries')}
          className="p-3.5 rounded-xl bg-[#14243C] border border-white/8 hover:border-[#F5B82E]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Inquiries</span>
            <Inbox className="w-4 h-4 text-slate-400 group-hover:text-[#F5B82E] transition-colors" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>{residentialCount} res · {commercialCount} com</span>
          </div>
        </div>

        {/* New Enquiries */}
        <div 
          onClick={() => setActiveTab('enquiries')}
          className="p-3.5 rounded-xl bg-[#14243C] border border-white/8 hover:border-[#F5B82E]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">New Enquiries</span>
            <div className="w-2 h-2 rounded-full bg-[#F5B82E] animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-[#F5B82E] tabular-nums tracking-tight">
            {newCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Awaiting response
          </div>
        </div>

        {/* Awaiting Assessment */}
        <div 
          onClick={() => setActiveTab('enquiries')}
          className="p-3.5 rounded-xl bg-[#14243C] border border-white/8 hover:border-[#F5B82E]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Awaiting Assessment</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
            {awaitingAssessmentCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Photo / satellite checks
          </div>
        </div>

        {/* Surveys Required */}
        <div 
          onClick={() => setActiveTab('surveys')}
          className="p-3.5 rounded-xl bg-[#14243C] border border-white/8 hover:border-[#F5B82E]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Surveys Required</span>
            <Crosshair className="w-4 h-4 text-[#F5B82E]" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
            {surveysRequiredCount}
          </div>
          <div className="text-[11px] text-[#F5B82E] font-medium mt-1">
            CAA / RAMS pending
          </div>
        </div>

        {/* Quotes Sent */}
        <div 
          onClick={() => setActiveTab('quotes')}
          className="p-3.5 rounded-xl bg-[#14243C] border border-white/8 hover:border-[#F5B82E]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Quotes Sent</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
            {quotesSentCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Active proposals
          </div>
        </div>

        {/* Follow-ups Due */}
        <div 
          onClick={() => setActiveTab('followups')}
          className="p-3.5 rounded-xl bg-[#14243C] border border-white/8 hover:border-[#F5B82E]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Follow-ups Due</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tabular-nums tracking-tight">
            {followUpsDueCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Requires action
          </div>
        </div>

        {/* Jobs Booked */}
        <div 
          onClick={() => setActiveTab('calendar')}
          className="p-3.5 rounded-xl bg-[#14243C] border border-white/8 hover:border-[#F5B82E]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Jobs Booked</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums tracking-tight">
            {bookedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Confirmed & active
          </div>
        </div>
      </div>

      {/* Middle Row: Operational Pipeline Chart & Division Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pipeline Visualisation & Service Breakdown */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#14243C] border border-white/8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/8 pb-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Operations & Service Distribution
              </h2>
              <p className="text-xs text-slate-400">
                Live volume distribution across residential, commercial and specialist drone sectors
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#0B1424] rounded-lg border border-white/5">
              <button
                onClick={() => setActiveChartTab('weekly')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeChartTab === 'weekly'
                    ? 'bg-[#1E3557] text-[#F5B82E] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Division Ratios
              </button>
              <button
                onClick={() => setActiveChartTab('category')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeChartTab === 'category'
                    ? 'bg-[#1E3557] text-[#F5B82E] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Service Breakdown
              </button>
            </div>
          </div>

          {activeChartTab === 'weekly' ? (
            <div className="space-y-4 pt-2">
              {/* Division Ratio Visual Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span>Residential ({Math.round((residentialCount / totalCount) * 100)}%)</span>
                  <span>Commercial ({Math.round(((commercialCount - droneSpecificCount) / totalCount) * 100)}%)</span>
                  <span className="text-[#F5B82E]">Specialist Drone ({Math.round((droneSpecificCount / totalCount) * 100)}%)</span>
                </div>
                <div className="h-3.5 w-full bg-[#0B1424] rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${(residentialCount / totalCount) * 100}%` }}
                    className="bg-blue-500 h-full transition-all duration-500"
                    title={`Residential: ${residentialCount}`}
                  />
                  <div 
                    style={{ width: `${((commercialCount - droneSpecificCount) / totalCount) * 100}%` }}
                    className="bg-sky-400 h-full transition-all duration-500"
                    title={`Commercial Traditional: ${commercialCount - droneSpecificCount}`}
                  />
                  <div 
                    style={{ width: `${(droneSpecificCount / totalCount) * 100}%` }}
                    className="bg-[#F5B82E] h-full transition-all duration-500"
                    title={`Specialist Drone: ${droneSpecificCount}`}
                  />
                </div>
              </div>

              {/* 3 Division Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-lg bg-[#0B1424]/60 border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5 text-blue-400">
                    <Home className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Residential</span>
                  </div>
                  <div className="text-xl font-bold text-white tabular-nums">{residentialCount} jobs</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Roofs, moss, gutters, patios, render & conservatories
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0B1424]/60 border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5 text-sky-400">
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Commercial</span>
                  </div>
                  <div className="text-xl font-bold text-white tabular-nums">{commercialCount - droneSpecificCount} projects</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Warehouses, schools, industrial cladding & contracts
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0B1424]/60 border border-[#F5B82E]/20">
                  <div className="flex items-center gap-2 mb-1.5 text-[#F5B82E]">
                    <Crosshair className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Drone Specialist</span>
                  </div>
                  <div className="text-xl font-bold text-[#F5B82E] tabular-nums">{droneSpecificCount} surveys</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    High-level glass, multi-MW solar arrays, high-bays
                  </p>
                </div>
              </div>

              {/* Verified Operational Rule Callout */}
              <div className="p-3 rounded-lg bg-[#1E3557]/30 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
                <ShieldAlert className="w-4 h-4 text-[#F5B82E] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-white">Professional Operating Rule:</strong> Drone cleaning is deployed only where remote survey confirms height, surface and CAA safety suitability. Standard residential jobs utilize proven ground-based poles, softwashing and manual scraping.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 pt-2">
              {Object.entries(categoryCounts).map(([catName, count]) => {
                const pct = Math.round((count / totalCount) * 100);
                return (
                  <div key={catName} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-200 font-medium">{catName}</span>
                      <span className="text-slate-400 tabular-nums">{count} enquiries ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-[#0B1424] rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${pct}%` }}
                        className="bg-[#F5B82E] h-full rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Lead Channel Distribution & Urgent Follow-ups */}
        <div className="space-y-4">
          {/* Lead Source Box */}
          <div className="p-4 rounded-xl bg-[#14243C] border border-white/8 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Inbound Lead Sources
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#0B1424] border border-white/5">
                <span className="text-slate-400 block text-[11px]">Website Form</span>
                <span className="text-base font-bold text-white tabular-nums">{sourceStats.website}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0B1424] border border-white/5">
                <span className="text-slate-400 block text-[11px]">WhatsApp</span>
                <span className="text-base font-bold text-emerald-400 tabular-nums">{sourceStats.whatsapp}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0B1424] border border-white/5">
                <span className="text-slate-400 block text-[11px]">Direct Email</span>
                <span className="text-base font-bold text-sky-400 tabular-nums">{sourceStats.email}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0B1424] border border-white/5">
                <span className="text-slate-400 block text-[11px]">Phone Inbound</span>
                <span className="text-base font-bold text-amber-400 tabular-nums">{sourceStats.phone}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Demonstrates simulated aggregation from existing website forms and WhatsApp widget.
            </p>
          </div>

          {/* Urgent Follow-ups Widget */}
          <div className="p-4 rounded-xl bg-[#14243C] border border-white/8 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Action Items Due ({pendingFollowUps.length})
              </h3>
              <button 
                onClick={() => setActiveTab('followups')}
                className="text-xs text-[#F5B82E] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-2">
              {pendingFollowUps.map(f => (
                <div 
                  key={f.id}
                  onClick={() => {
                    setSelectedEnquiryId(f.enquiryId);
                    setActiveTab('enquiries');
                  }}
                  className="p-2.5 rounded-lg bg-[#0B1424] border border-white/5 hover:border-amber-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate max-w-[160px]">{f.customerName}</span>
                    <span className="text-[10px] text-amber-400 font-medium px-1.5 py-0.5 rounded bg-amber-400/10">
                      {f.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-1">
                    {f.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Enquiries Table (Real Interactive Rows) */}
      <div className="p-5 rounded-xl bg-[#14243C] border border-white/8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Latest Enquiries & Operations Queue
            </h2>
            <p className="text-xs text-slate-400">
              Click any record to inspect site survey details, drone RAMS, or prepare quotation
            </p>
          </div>
          <button
            onClick={() => setActiveTab('enquiries')}
            className="text-xs text-[#F5B82E] hover:text-[#ffd56b] font-medium flex items-center gap-1 transition-colors"
          >
            <span>Open All Enquiries</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">ID</th>
                <th className="py-2.5 px-3 font-semibold">Customer / Site</th>
                <th className="py-2.5 px-3 font-semibold">Division</th>
                <th className="py-2.5 px-3 font-semibold">Service</th>
                <th className="py-2.5 px-3 font-semibold">Location</th>
                <th className="py-2.5 px-3 font-semibold">Channel</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentEnquiries.map((enq) => (
                <tr
                  key={enq.id}
                  onClick={() => {
                    setSelectedEnquiryId(enq.id);
                    setActiveTab('enquiries');
                  }}
                  className="hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-mono font-medium text-[#F5B82E]">
                    {enq.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-white group-hover:text-[#F5B82E] transition-colors block">
                      {enq.customerName}
                    </span>
                    {enq.companyName && (
                      <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                        {enq.companyName}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-300 font-medium">
                      {enq.division === 'drone_specialist' ? 'Drone Spec.' : enq.division === 'commercial' ? 'Commercial' : 'Residential'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-[200px] truncate">
                    {enq.service}
                  </td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                    {enq.location}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {enq.contactMethod}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs text-slate-200">
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[#F5B82E] font-medium group-hover:underline">
                      <span>Open</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
