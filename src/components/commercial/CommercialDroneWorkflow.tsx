import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EnquiryRecord, DroneSuitabilityDecision, DroneSurveyDetails } from '../../types';
import { 
  Building2, 
  Crosshair, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileCheck, 
  Sparkles, 
  ArrowRight,
  Plane,
  Eye,
  Camera,
  Layers,
  MapPin,
  ChevronRight,
  Shield,
  Clock
} from 'lucide-react';

const COMMERCIAL_STAGES = [
  'New Enquiry',
  'Remote Survey Pending',
  'Survey Under Review',
  'Suitability Decision Required',
  'Planning / Documentation',
  'Quote Preparation',
  'Quote Sent',
  'Booked',
  'In Progress',
  'Completed'
];

const FIVE_STEPS = [
  { step: 1, title: 'Remote Survey', desc: 'Photos, satellite & building specs evaluated' },
  { step: 2, title: 'Suitability & Permissions', desc: 'CAA airspace check, landowner consent & risk analysis' },
  { step: 3, title: 'Flight & Method Planning', desc: 'Site-specific RAMS, water supply, cordon planning' },
  { step: 4, title: 'Controlled Cleaning', desc: 'Tethered drone softwash & pure water rinse' },
  { step: 5, title: 'Photos & Report', desc: 'Before/after aerial photography & compliance sign-off' }
];

export const CommercialDroneWorkflow: React.FC = () => {
  const { enquiries, updateDroneSurvey, updateEnquiryStatus, setSelectedEnquiryId } = useApp();

  // Filter commercial & drone projects
  const commercialProjects = enquiries.filter(e => 
    e.division === 'commercial' || e.division === 'drone_specialist'
  );

  // Selected survey for in-depth inspection
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    const defaultDrone = commercialProjects.find(e => e.droneSurvey);
    return defaultDrone ? defaultDrone.id : commercialProjects[0]?.id || '';
  });

  const [activeTab, setActiveTab] = useState<'surveys' | 'pipeline'>('surveys');

  const selectedProject = commercialProjects.find(p => p.id === selectedProjectId) || commercialProjects[0];
  const survey = selectedProject?.droneSurvey;

  // Handlers for interactive human decisions in the demo
  const handleDecisionChange = (decision: DroneSuitabilityDecision) => {
    if (!selectedProject) return;
    updateDroneSurvey(selectedProject.id, { suitabilityDecision: decision });

    if (decision === 'Approved by Team') {
      updateEnquiryStatus(selectedProject.id, 'Planning / Documentation', 'Drone suitability formally approved by Scott P.');
    } else if (decision === 'Not Suitable') {
      updateEnquiryStatus(selectedProject.id, 'Quote Preparation', 'Drone flight deemed not suitable. Reverting to traditional cherry picker / pole access.');
    }
  };

  const handleAirspaceStatusChange = (status: DroneSurveyDetails['airspaceReviewStatus']) => {
    if (!selectedProject) return;
    updateDroneSurvey(selectedProject.id, { airspaceReviewStatus: status });
  };

  const handleRamsStatusChange = (status: DroneSurveyDetails['ramsStatus']) => {
    if (!selectedProject) return;
    updateDroneSurvey(selectedProject.id, { ramsStatus: status });
  };

  const handleStepStageChange = (stage: 1 | 2 | 3 | 4 | 5) => {
    if (!selectedProject) return;
    updateDroneSurvey(selectedProject.id, { fiveStepStage: stage });
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#14243C] via-[#0E1A2D] to-[#0B1424] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#F5B82E]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5B82E]">
              CAA Authorised Commercial Operations
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Warehouses, Schools & Specialist Facades</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Commercial Projects & Drone Survey Console
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Drone cleaning eliminates costly scaffolding, reduces working-at-height risk, and speeds up commercial washing. All flight corridors, airspace NOTAMs, and RAMS are strictly reviewed by human personnel.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-[#0B1424] rounded-lg border border-white/5 shrink-0">
          <button
            onClick={() => setActiveTab('surveys')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'surveys'
                ? 'bg-[#1E3557] text-[#F5B82E]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Drone Survey Detail</span>
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'bg-[#1E3557] text-[#F5B82E]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Commercial Pipeline</span>
          </button>
        </div>
      </div>

      {/* Critical Operating Safety Rule Callout */}
      <div className="p-3.5 rounded-lg bg-[#14243C] border border-[#F5B82E]/30 flex items-start gap-3 text-xs text-slate-300">
        <ShieldAlert className="w-4 h-4 text-[#F5B82E] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Strict CAA Operational Protocol:</strong> Drone cleaning is never automatically approved. AI/software flags site parameters and airspace proximity, but final flight authorization, RAMS sign-off, and method suitability decisions are 100% human-controlled.
        </p>
      </div>

      {activeTab === 'surveys' ? (
        /* SURVEY DETAIL VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Project Selector List (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Commercial Sites & Surveys ({commercialProjects.length})
            </h3>

            <div className="space-y-2">
              {commercialProjects.map((proj) => {
                const isSelected = proj.id === selectedProjectId;
                const hasSurvey = !!proj.droneSurvey;

                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E3557] border-[#F5B82E] shadow-md'
                        : 'bg-[#14243C] border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-[#F5B82E] font-medium">{proj.id}</span>
                      <span className="text-slate-400">{proj.location}</span>
                    </div>

                    <h4 className="font-bold text-white text-xs leading-snug">
                      {proj.customerName}
                    </h4>
                    {proj.companyName && (
                      <p className="text-[11px] text-slate-300 font-medium truncate">
                        {proj.companyName}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px]">
                      <span className="text-slate-400 truncate max-w-[150px]">{proj.service}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        hasSurvey ? 'bg-[#F5B82E]/15 text-[#F5B82E]' : 'bg-slate-700/50 text-slate-300'
                      }`}>
                        {hasSurvey ? `Stage ${proj.droneSurvey?.fiveStepStage}/5` : 'Standard'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Comprehensive Drone Survey Inspection Panel (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedProject && survey ? (
              <div className="p-5 rounded-xl bg-[#14243C] border border-white/10 space-y-5">
                {/* Survey Title & Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/8 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#F5B82E] font-bold bg-[#F5B82E]/10 px-2 py-0.5 rounded border border-[#F5B82E]/20">
                        {selectedProject.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        Assigned Reviewer: <strong className="text-white">{survey.assignedReviewer}</strong>
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white mt-1">
                      {survey.companyName || selectedProject.customerName}
                    </h2>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{survey.siteAddress}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Suitability Decision</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg mt-1 ${
                      survey.suitabilityDecision === 'Approved by Team' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      survey.suitabilityDecision === 'In Progress' ? 'bg-[#F5B82E]/20 text-[#F5B82E] border border-[#F5B82E]/30' :
                      survey.suitabilityDecision === 'Not Suitable' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      'bg-slate-700/40 text-slate-300'
                    }`}>
                      {survey.suitabilityDecision}
                    </span>
                  </div>
                </div>

                {/* 5-Step Operational Process Tracker */}
                <div className="p-4 rounded-xl bg-[#0B1424] border border-white/8 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F5B82E] uppercase tracking-wider">
                      5-Step Drone Operations Workflow
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Click step to update operational progression
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {FIVE_STEPS.map((st) => {
                      const isCompleted = survey.fiveStepStage > st.step;
                      const isCurrent = survey.fiveStepStage === st.step;

                      return (
                        <button
                          key={st.step}
                          onClick={() => handleStepStageChange(st.step as any)}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-[#1E3557] border-[#F5B82E] shadow-sm ring-1 ring-[#F5B82E]/50'
                              : isCompleted
                              ? 'bg-[#14243C] border-emerald-500/30 text-emerald-300'
                              : 'bg-[#14243C]/40 border-white/5 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold font-mono">
                              Step 0{st.step}
                            </span>
                            {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          </div>
                          <p className="font-semibold text-white text-xs leading-tight truncate">
                            {st.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                            {st.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Technical Site Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#0B1424] border border-white/5">
                    <span className="text-slate-400 block text-[11px]">Building Height</span>
                    <span className="text-xl font-bold text-white tabular-nums">
                      {survey.approximateHeightMeters}m
                    </span>
                    <span className="text-[10px] text-slate-500 block">Approx. {Math.round(survey.approximateHeightMeters / 3.5)} storeys</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0B1424] border border-white/5">
                    <span className="text-slate-400 block text-[11px]">Surface Area</span>
                    <span className="text-xl font-bold text-white tabular-nums">
                      {survey.approximateAreaSqMeters.toLocaleString()} m²
                    </span>
                    <span className="text-[10px] text-slate-500 block">Exterior facade</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0B1424] border border-white/5">
                    <span className="text-slate-400 block text-[11px]">Building Category</span>
                    <span className="text-xs font-bold text-white truncate block mt-1">
                      {survey.buildingCategory}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0B1424] border border-white/5">
                    <span className="text-slate-400 block text-[11px]">Operational Access</span>
                    <span className="text-xs font-bold text-[#F5B82E] truncate block mt-1">
                      {survey.operationalAssessmentStatus}
                    </span>
                  </div>
                </div>

                {/* Surface, Access & Airspace Restrictions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#0B1424] border border-white/5 space-y-2">
                    <h4 className="font-bold text-white text-xs">Facade & Ground Access</h4>
                    <p className="text-slate-300">
                      <strong className="text-slate-400">Surface Type:</strong> {survey.surfaceType}
                    </p>
                    <p className="text-slate-300">
                      <strong className="text-slate-400">Ground Apron:</strong> {survey.siteAccessNotes}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#0B1424] border border-white/5 space-y-2">
                    <h4 className="font-bold text-white text-xs">Aviation & Proximity Hazards</h4>
                    <p className="text-slate-300">
                      <strong className="text-slate-400">Restrictions:</strong> {survey.nearbyRestrictions}
                    </p>
                    <p className="text-slate-300">
                      <strong className="text-slate-400">Customer Imagery:</strong>{' '}
                      {survey.customerPhotosProvided ? 'Received & Mapped' : 'Pending aerial photos'}
                    </p>
                  </div>
                </div>

                {/* Airspace, RAMS & Permission Controls */}
                <div className="p-4 rounded-xl bg-[#0E1A2D] border border-white/8 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Regulatory & Compliance Controls (CAA GBR)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Airspace Status */}
                    <div className="space-y-1">
                      <label className="text-slate-400 block text-[11px]">Airspace Authorization</label>
                      <select
                        value={survey.airspaceReviewStatus}
                        onChange={(e) => handleAirspaceStatusChange(e.target.value as any)}
                        className="w-full bg-[#14243C] text-white p-2 rounded-lg border border-white/10 text-xs cursor-pointer focus:border-[#F5B82E]"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="Clear / Open Category">Clear / Open Category</option>
                        <option value="Specific Authorisation Required">Specific Authorisation Required</option>
                        <option value="Checked & Approved">Checked & Approved</option>
                      </select>
                    </div>

                    {/* RAMS Status */}
                    <div className="space-y-1">
                      <label className="text-slate-400 block text-[11px]">Site-Specific RAMS</label>
                      <select
                        value={survey.ramsStatus}
                        onChange={(e) => handleRamsStatusChange(e.target.value as any)}
                        className="w-full bg-[#14243C] text-white p-2 rounded-lg border border-white/10 text-xs cursor-pointer focus:border-[#F5B82E]"
                      >
                        <option value="Not Prepared">Not Prepared</option>
                        <option value="Drafting">Drafting</option>
                        <option value="Completed & Signed">Completed & Signed</option>
                        <option value="Not Applicable">Not Applicable</option>
                      </select>
                    </div>

                    {/* Suitability Decision Action Buttons */}
                    <div className="space-y-1">
                      <label className="text-slate-400 block text-[11px]">Human Decision Control</label>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleDecisionChange('Approved by Team')}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                        >
                          Approve Drone
                        </button>
                        <button
                          onClick={() => handleDecisionChange('Not Suitable')}
                          className="flex-1 py-1.5 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                        >
                          Ground Only
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action: Open Enquiry or Create Quotation */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setSelectedEnquiryId(selectedProject.id)}
                    className="text-xs text-[#F5B82E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open full enquiry record & contact history</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Non-drone commercial project */
              <div className="p-8 rounded-xl bg-[#14243C] border border-white/10 text-center space-y-3">
                <Building2 className="w-8 h-8 text-[#F5B82E] mx-auto" />
                <h3 className="text-sm font-bold text-white">Traditional Commercial Project</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  {selectedProject?.customerName} ({selectedProject?.service}) uses ground-based telescopic wash systems or mobile elevated work platforms (MEWPs).
                </p>
                <button
                  onClick={() => setSelectedEnquiryId(selectedProject?.id || null)}
                  className="px-4 py-2 bg-[#F5B82E] text-[#0B1424] text-xs font-bold rounded-lg cursor-pointer"
                >
                  Inspect Enquiry Record
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* COMMERCIAL PIPELINE STAGE BOARD */
        <div className="rounded-xl bg-[#14243C] border border-white/8 p-4 overflow-x-auto">
          <div className="min-w-[800px] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Commercial Tender & Project Progression
            </h3>
            <div className="divide-y divide-white/5">
              {commercialProjects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => setSelectedEnquiryId(proj.id)}
                  className="py-3 px-2 flex items-center justify-between hover:bg-white/5 rounded transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-[#F5B82E] font-medium shrink-0">
                      {proj.id}
                    </span>
                    <div className="min-w-0">
                      <span className="font-bold text-white text-xs block truncate">
                        {proj.customerName} {proj.companyName && `(${proj.companyName})`}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {proj.service} · {proj.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-300 font-medium">
                      {proj.status}
                    </span>
                    {proj.sampleQuoteAmount && (
                      <span className="font-mono text-xs text-emerald-400">
                        £{proj.sampleQuoteAmount.toLocaleString()}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
