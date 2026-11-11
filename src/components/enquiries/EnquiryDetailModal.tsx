import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EnquiryRecord, EnquiryStatus, EnquiryPriority } from '../../types';
import { 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Plus, 
  FileText, 
  Calendar, 
  Trash2,
  Edit2,
  Check,
  Bot,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface EnquiryDetailModalProps {
  enquiry: EnquiryRecord;
  onClose: () => void;
  onOpenAssistantForEnquiry: (enquiryId: string) => void;
  onCreateQuoteForEnquiry: (enquiry: EnquiryRecord) => void;
}

export const EnquiryDetailModal: React.FC<EnquiryDetailModalProps> = ({
  enquiry,
  onClose,
  onOpenAssistantForEnquiry,
  onCreateQuoteForEnquiry
}) => {
  const { 
    updateEnquiryStatus, 
    updateEnquiry, 
    addInternalNote, 
    deleteEnquiry, 
    addFollowUp,
    setActiveTab,
    quotes
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'details' | 'survey' | 'notes' | 'timeline'>('details');
  const [newNoteText, setNewNoteText] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(enquiry.jobDescription);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpReason, setFollowUpReason] = useState(enquiry.nextAction || 'Check in with client');

  const linkedQuote = quotes.find(q => q.enquiryId === enquiry.id || q.id === enquiry.quoteId);

  const statuses: EnquiryStatus[] = [
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
    'Completed',
    'Declined'
  ];

  const handleStatusChange = (newStatus: EnquiryStatus) => {
    updateEnquiryStatus(enquiry.id, newStatus, `Status updated to ${newStatus}`);
  };

  const handleSaveDescription = () => {
    updateEnquiry(enquiry.id, { jobDescription: editedDescription });
    setIsEditingDescription(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addInternalNote(enquiry.id, newNoteText.trim(), 'Scott P.');
    setNewNoteText('');
  };

  const handleCreateQuickFollowUp = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    addFollowUp({
      enquiryId: enquiry.id,
      customerName: enquiry.customerName,
      service: enquiry.service,
      location: enquiry.location,
      dueDate: d.toISOString(),
      priority: enquiry.priority,
      reason: followUpReason,
      suggestedAction: `Follow up with ${enquiry.customerName} regarding ${enquiry.service}`,
      status: 'Pending'
    });
    setIsFollowUpModalOpen(false);
  };

  const handleDelete = () => {
    deleteEnquiry(enquiry.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        className="bg-[#0B1424] border border-white/15 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#14243C] p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs text-[#F5B82E] font-semibold bg-[#F5B82E]/10 border border-[#F5B82E]/25 px-2 py-0.5 rounded">
                {enquiry.id}
              </span>
              <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                {enquiry.division === 'drone_specialist' ? 'Drone Specialist' : enquiry.division === 'commercial' ? 'Commercial' : 'Residential'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">
                Via {enquiry.contactMethod} ({new Date(enquiry.dateReceived).toLocaleDateString('en-GB')})
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1 truncate">
              {enquiry.customerName}
              {enquiry.companyName && (
                <span className="text-sm font-normal text-slate-300 ml-2">({enquiry.companyName})</span>
              )}
            </h2>
            <p className="text-xs text-[#F5B82E] font-medium mt-0.5">
              {enquiry.service} · {enquiry.propertyType}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {/* Quick Draft Customer Acknowledgement */}
            <button
              onClick={() => onOpenAssistantForEnquiry(enquiry.id)}
              className="px-3 py-1.5 text-xs font-semibold bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] rounded-lg shadow transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Generate AI-style draft response"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Draft Response</span>
            </button>

            {/* Create Quote Button */}
            <button
              onClick={() => onCreateQuoteForEnquiry(enquiry)}
              className="px-3 py-1.5 text-xs font-medium bg-[#1E3557] hover:bg-[#25426c] text-white rounded-lg border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#F5B82E]" />
              <span>{linkedQuote ? 'View Quote' : 'Create Quote'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Bar & Quick Actions Strip */}
        <div className="px-5 py-3 bg-[#0E1A2D] border-b border-white/8 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={enquiry.status}
              onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
              className="bg-[#14243C] text-white border border-white/15 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#F5B82E] cursor-pointer"
            >
              {statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Assigned:</span>
            <span className="text-slate-200 font-medium bg-[#14243C] px-2 py-0.5 rounded border border-white/5">
              {enquiry.assignedTo || 'Unassigned'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Priority:</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
              enquiry.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300' :
              enquiry.priority === 'High' ? 'bg-amber-500/20 text-amber-300' :
              'bg-blue-500/20 text-blue-300'
            }`}>
              {enquiry.priority}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFollowUpModalOpen(true)}
              className="text-[#F5B82E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Schedule Follow-up</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/8 px-5 bg-[#0B1424] text-xs">
          <button
            onClick={() => setActiveTabLocal('details')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-[#F5B82E] text-[#F5B82E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Scope
          </button>
          {enquiry.droneSurvey && (
            <button
              onClick={() => setActiveTabLocal('survey')}
              className={`py-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'survey'
                  ? 'border-[#F5B82E] text-[#F5B82E]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Drone Survey & RAMS
            </button>
          )}
          <button
            onClick={() => setActiveTabLocal('notes')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'notes'
                ? 'border-[#F5B82E] text-[#F5B82E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Internal Notes ({enquiry.notes.length})
          </button>
          <button
            onClick={() => setActiveTabLocal('timeline')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-[#F5B82E] text-[#F5B82E]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Activity History ({enquiry.activityHistory.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-sm">
          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Client & Property Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Details */}
                <div className="p-4 rounded-xl bg-[#14243C] border border-white/8 space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#F5B82E]" />
                    <span>Client Contact Information</span>
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500 w-16">Contact:</span>
                      <span className="font-semibold text-white">{enquiry.customerName}</span>
                    </div>
                    {enquiry.companyName && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-slate-500 w-16">Company:</span>
                        <span>{enquiry.companyName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500 w-16">Phone:</span>
                      <a href={`tel:${enquiry.phone}`} className="text-[#F5B82E] hover:underline">{enquiry.phone}</a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500 w-16">Email:</span>
                      <a href={`mailto:${enquiry.email}`} className="text-sky-400 hover:underline">{enquiry.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500 w-16">Source:</span>
                      <span className="bg-[#0B1424] px-2 py-0.5 rounded text-slate-300 border border-white/5">
                        {enquiry.contactMethod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property & Location */}
                <div className="p-4 rounded-xl bg-[#14243C] border border-white/8 space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F5B82E]" />
                    <span>Location & Building Details</span>
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500 w-16">Region:</span>
                      <span className="font-semibold text-white">{enquiry.location}</span>
                    </div>
                    {enquiry.postcode && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-slate-500 w-16">Postcode:</span>
                        <span className="font-mono text-white">{enquiry.postcode}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500 w-16">Building:</span>
                      <span>{enquiry.propertyType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500 w-16">Division:</span>
                      <span className="capitalize">{enquiry.division.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-slate-500 w-16">Service:</span>
                      <span className="text-[#F5B82E] font-medium">{enquiry.service}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Scope & Customer Description */}
              <div className="p-4 rounded-xl bg-[#14243C] border border-white/8 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Customer Enquiry Description
                  </h3>
                  {!isEditingDescription ? (
                    <button
                      onClick={() => setIsEditingDescription(true)}
                      className="text-xs text-[#F5B82E] hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Scope</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveDescription}
                        className="text-xs bg-[#F5B82E] text-[#0B1424] font-bold px-2 py-0.5 rounded flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditedDescription(enquiry.jobDescription);
                          setIsEditingDescription(false);
                        }}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {!isEditingDescription ? (
                  <p className="text-xs text-slate-200 leading-relaxed bg-[#0B1424] p-3 rounded-lg border border-white/5">
                    {enquiry.jobDescription}
                  </p>
                ) : (
                  <textarea
                    rows={4}
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full bg-[#0B1424] text-xs text-slate-200 p-3 rounded-lg border border-[#F5B82E]/50 focus:outline-none"
                  />
                )}
              </div>

              {/* AI-Style Enquiry Analysis (Deterministic simulation) */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#1E3557]/40 to-[#14243C] border border-[#F5B82E]/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F5B82E]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Operations Triage & Assessment Summary
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    AI-style demonstration
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-200 leading-relaxed">
                  <p>
                    <strong className="text-white">Recommended Approach:</strong>{' '}
                    {enquiry.division === 'drone_specialist'
                      ? 'High-elevation or difficult access structure. Requires remote flight corridor check and RAMS approval before quote issuance.'
                      : enquiry.service.includes('Roof')
                      ? 'Low-pressure biocide softwash application + manual scraper. Pressure washing strictly prohibited to safeguard tile integrity.'
                      : enquiry.service.includes('Gutter')
                      ? 'SkyVac industrial gutter suction system from ground level with camera inspection.'
                      : 'Commercial hot water flat-surface rotary cleaning with eco-friendly biocide treatment.'}
                  </p>
                  <p>
                    <strong className="text-[#F5B82E]">Next Administrative Action:</strong> {enquiry.nextAction}
                  </p>
                </div>
              </div>

              {/* Missing Information Checklist */}
              {enquiry.missingInformation.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Missing Information for Fixed-Price Quotation</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-300 pl-5 list-disc">
                    {enquiry.missingInformation.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <div className="pt-1">
                    <button
                      onClick={() => onOpenAssistantForEnquiry(enquiry.id)}
                      className="text-xs text-[#F5B82E] hover:underline font-medium"
                    >
                      Draft missing information request message →
                    </button>
                  </div>
                </div>
              )}

              {/* Customer Photos Attachments Placeholder */}
              <div className="p-4 rounded-xl bg-[#14243C] border border-white/8 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Uploaded Customer Photos ({enquiry.photos.length})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Uploaded via web/WhatsApp
                  </span>
                </div>

                {enquiry.photos.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-white/10 rounded-lg">
                    No property photos attached yet. Request photos from customer to accelerate quotation.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {enquiry.photos.map(photo => (
                      <div 
                        key={photo.id}
                        className="p-3 rounded-lg bg-[#0B1424] border border-white/10 flex flex-col justify-between group hover:border-[#F5B82E]/40 transition-colors"
                      >
                        <div className="h-20 bg-[#14243C] rounded flex items-center justify-center text-slate-500 mb-2">
                          <Camera className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-[11px] text-white truncate block">
                            {photo.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {photo.size} · Uploaded
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Drone Survey Tab */}
          {activeTab === 'survey' && enquiry.droneSurvey && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#14243C] border border-white/8 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5B82E]">
                    CAA Operational Survey & Site Parameters
                  </h3>
                  <span className="text-xs text-slate-400">
                    Reviewer: {enquiry.droneSurvey.assignedReviewer}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0B1424]">
                    <span className="text-slate-400 block text-[11px]">Building Height</span>
                    <span className="text-base font-bold text-white tabular-nums">
                      {enquiry.droneSurvey.approximateHeightMeters}m
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0B1424]">
                    <span className="text-slate-400 block text-[11px]">Surface Area</span>
                    <span className="text-base font-bold text-white tabular-nums">
                      {enquiry.droneSurvey.approximateAreaSqMeters} m²
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0B1424]">
                    <span className="text-slate-400 block text-[11px]">Airspace Status</span>
                    <span className="text-xs font-semibold text-white">
                      {enquiry.droneSurvey.airspaceReviewStatus}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0B1424]">
                    <span className="text-slate-400 block text-[11px]">RAMS Status</span>
                    <span className="text-xs font-semibold text-[#F5B82E]">
                      {enquiry.droneSurvey.ramsStatus}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-2 pt-2 text-slate-300">
                  <p>
                    <strong className="text-white">Surface Type:</strong> {enquiry.droneSurvey.surfaceType}
                  </p>
                  <p>
                    <strong className="text-white">Site Access:</strong> {enquiry.droneSurvey.siteAccessNotes}
                  </p>
                  <p>
                    <strong className="text-amber-400">Restrictions / Hazards:</strong> {enquiry.droneSurvey.nearbyRestrictions}
                  </p>
                  {enquiry.droneSurvey.surveyorNotes && (
                    <p className="bg-[#0B1424] p-3 rounded border border-white/5 text-slate-300">
                      <strong className="text-white block mb-1">Surveyor Engineering Notes:</strong>
                      {enquiry.droneSurvey.surveyorNotes}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#1E3557]/40 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Drone Suitability Decision:</span>
                  <span className="text-sm font-bold text-white">{enquiry.droneSurvey.suitabilityDecision}</span>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('surveys');
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-[#F5B82E] text-[#0B1424] text-xs font-bold rounded-lg cursor-pointer"
                >
                  Open Full Drone Survey Console →
                </button>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add an internal operations note (e.g. site access, water pressure, client call recap)..."
                  className="w-full bg-[#14243C] text-xs text-slate-200 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#F5B82E]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newNoteText.trim()}
                    className="px-3.5 py-1.5 bg-[#F5B82E] text-[#0B1424] text-xs font-bold rounded-lg disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2.5">
                {enquiry.notes.map(note => (
                  <div key={note.id} className="p-3 rounded-lg bg-[#14243C] border border-white/5 text-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="font-semibold text-slate-200">{note.author}</span>
                      <span className="font-mono text-[10px]">
                        {new Date(note.timestamp).toLocaleDateString('en-GB')} {new Date(note.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              {enquiry.activityHistory.map((item, idx) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F5B82E]" />
                    {idx !== enquiry.activityHistory.length - 1 && (
                      <div className="w-0.5 flex-1 bg-white/10 my-1" />
                    )}
                  </div>
                  <div className="pb-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{item.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(item.timestamp).toLocaleDateString('en-GB')} {new Date(item.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Logged by {item.actor}
                    </div>
                    {item.details && (
                      <p className="text-slate-300 mt-1 bg-[#14243C] p-2 rounded text-[11px]">
                        {item.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Delete and Follow-up actions */}
        <div className="p-4 bg-[#0E1A2D] border-t border-white/10 flex items-center justify-between text-xs">
          <div>
            {!isDeleteConfirmOpen ? (
              <button
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Enquiry</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-semibold">Confirm delete?</span>
                <button
                  onClick={handleDelete}
                  className="px-2 py-1 bg-rose-600 text-white rounded font-bold cursor-pointer"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Quick Follow-up modal */}
      {isFollowUpModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#14243C] border border-white/20 p-5 rounded-xl max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F5B82E]" />
              <span>Schedule Follow-Up Reminder</span>
            </h3>
            <div className="space-y-2 text-xs">
              <label className="text-slate-400 block">Follow-up Reason / Action</label>
              <input
                type="text"
                value={followUpReason}
                onChange={(e) => setFollowUpReason(e.target.value)}
                className="w-full bg-[#0B1424] text-white p-2.5 rounded-lg border border-white/10"
              />
              <p className="text-[11px] text-slate-400">
                Will create a pending task in the Follow-up Centre due in 2 days.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsFollowUpModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuickFollowUp}
                className="px-4 py-1.5 text-xs bg-[#F5B82E] text-[#0B1424] font-bold rounded-lg cursor-pointer"
              >
                Create Follow-up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
