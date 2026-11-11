import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { EnquiryRecord } from '../../types';
import { 
  Bot, 
  Sparkles, 
  Copy, 
  Check, 
  Edit3, 
  Send, 
  AlertCircle, 
  FileText, 
  Camera, 
  Clock, 
  ShieldCheck, 
  RefreshCw,
  X
} from 'lucide-react';

interface AIAssistantModalProps {
  initialEnquiryId?: string | null;
  onClose?: () => void;
  isModal?: boolean;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  initialEnquiryId,
  onClose,
  isModal = false
}) => {
  const { enquiries, showToast, addInternalNote } = useApp();

  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string>(
    initialEnquiryId || enquiries[0]?.id || ''
  );
  const [selectedPromptType, setSelectedPromptType] = useState<string>('summarise');
  const [draftedContent, setDraftedContent] = useState<string>('');
  const [isEditingDraft, setIsEditingDraft] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [isApprovedInDemo, setIsApprovedInDemo] = useState<boolean>(false);

  const selectedEnquiry = enquiries.find(e => e.id === selectedEnquiryId) || enquiries[0];

  // Deterministic rule engine to generate context-accurate UK drafts
  const generateAssistantResponse = (enquiry: EnquiryRecord, promptType: string): string => {
    if (!enquiry) return 'Please select a valid customer enquiry.';

    const firstName = enquiry.customerName.split(' ')[0] || 'Customer';
    const isCommercial = enquiry.division === 'commercial' || enquiry.division === 'drone_specialist';
    const isDrone = enquiry.division === 'drone_specialist';

    switch (promptType) {
      case 'summarise':
        return `OPERATIONS TRIAGE SUMMARY — ${enquiry.id}
Client: ${enquiry.customerName} ${enquiry.companyName ? `(${enquiry.companyName})` : ''}
Classification: ${isDrone ? 'Specialist Commercial Drone Operation' : isCommercial ? 'Commercial & Industrial Project' : 'Residential Exterior Maintenance'}
Service: ${enquiry.service}
Site Location: ${enquiry.propertyType}, ${enquiry.location} (${enquiry.postcode || 'Postcode pending'})
Channel: Received via ${enquiry.contactMethod}

Status & Progress:
• Current Pipeline Stage: ${enquiry.status}
• Priority Level: ${enquiry.priority}
• Assigned Lead: ${enquiry.assignedTo}
${enquiry.droneSurvey ? `• CAA Airspace Status: ${enquiry.droneSurvey.airspaceReviewStatus}\n• Drone Suitability: ${enquiry.droneSurvey.suitabilityDecision} (Stage ${enquiry.droneSurvey.fiveStepStage}/5)` : '• Access Method: Traditional ground telescopic pole & manual ladder profiles'}

Missing Data Points:
${enquiry.missingInformation.length > 0 ? enquiry.missingInformation.map(m => `• ${m}`).join('\n') : '• All standard scoping parameters provided.'}

Recommended Next Administrative Action:
${enquiry.nextAction}

Notice: All flight safety, RAMS and final quotation decisions require human sign-off.`;

      case 'ack_message':
        if (isDrone) {
          return `Dear ${firstName},

Thank you for contacting Drone Exterior Solutions regarding your commercial cleaning enquiry for ${enquiry.companyName || enquiry.propertyType} in ${enquiry.location}.

We have received your specifications for ${enquiry.service}. Our senior operations surveyor is currently reviewing site satellite mapping and preliminary CAA airspace parameters under our Operational Authorisation.

Where high-level facades or sensitive rooflines are involved, our commercial drone softwash systems provide a rapid, safe alternative to costly scaffolding. 

We aim to complete our remote desk assessment within one working day. Should we require any additional site photos or vehicle access details, we will be in touch.

Kind regards,

Scott P.
Operations & Survey Director
Drone Exterior Solutions Ltd
Tel: 07406 387071 | info@droneexteriorsolutions.co.uk`;
        }

        return `Hello ${firstName},

Thank you for getting in touch with Drone Exterior Solutions regarding ${enquiry.service.toLowerCase()} at your property in ${enquiry.location}.

We have logged your enquiry (${enquiry.id}). Our residential team is reviewing your roofline and property details using street-level and aerial satellite imagery.

With over 25 years of exterior cleaning experience across Hampshire, Surrey, and West Sussex, we take great care to recommend the correct, gentle method for your specific surface — ensuring no high-pressure damage to tiles or pointing.

We will prepare your clear, fixed-price quotation shortly. If you have any additional photos of the areas to be cleaned, feel free to send them over.

Best regards,

Residential Team
Drone Exterior Solutions Ltd
Tel: 07406 387071 | info@droneexteriorsolutions.co.uk`;

      case 'request_photos':
        return `Hi ${firstName},

To help us finalize an accurate, fixed-price quotation for your ${enquiry.service.toLowerCase()} in ${enquiry.location}, could you please reply with 2 or 3 clear photos?

Helpful angles:
1. Wide shot of the whole property / elevation from the ground.
2. Close-up of the specific area requiring attention (e.g. moss buildup, gutter overflow point, or driveway).
3. A view showing side access or driveway clearance for our vehicle and equipment.

You can simply reply to this email or send them directly via WhatsApp to 07406 387071 referencing enquiry ${enquiry.id}.

Thank you,
Drone Exterior Solutions Ltd`;

      case 'schedule_survey':
        return `Dear ${firstName},

Following our initial desk review of your enquiry (${enquiry.id}) for ${enquiry.propertyType} in ${enquiry.location}, we would like to schedule a brief on-site survey.

Our surveyor would assess:
• Ground apron clearance and safety exclusion cordon
• External water supply connection and flow rate
• High-level roof and facade line-of-sight

Would morning or afternoon later this week suit you best for a 30-minute site walk-through?

Please let us know your availability.

Warm regards,
Scott P.
Drone Exterior Solutions Ltd`;

      case 'quote_followup':
        return `Hi ${firstName},

I hope you are well.

I am following up on the formal quotation (${enquiry.quoteId || 'DES-2026-Quote'}) we recently sent across for ${enquiry.service.toLowerCase()} at ${enquiry.location}.

Do you have any questions regarding our proposed softwash treatment, RAMS safety specification, or scheduling? Our diary for the coming fortnight is filling up, so please let us know if you would like to reserve a date.

We are very happy to discuss any aspect of the job.

Kind regards,
Drone Exterior Solutions Ltd
07406 387071`;

      case 'internal_note':
        return `INTERNAL OPERATIONAL LOG [${enquiry.id}]
Assigned: ${enquiry.assignedTo}
Date: ${new Date().toLocaleDateString('en-GB')}
Service Focus: ${enquiry.service}

Assessment Notes:
• Site access verified via satellite mapping: Good perimeter clearance.
• Surface considerations: Delicate substrate identified; low-pressure softwash and biocidal application required.
• Safety precautions: Standard pedestrian cordon needed during spray operations.
• Next milestone: Follow up with customer once photos received.`;

      default:
        return 'Ready to generate simulated communication draft.';
    }
  };

  // Re-generate draft when enquiry or prompt changes
  useEffect(() => {
    if (selectedEnquiry) {
      setDraftedContent(generateAssistantResponse(selectedEnquiry, selectedPromptType));
      setIsApprovedInDemo(false);
      setIsEditingDraft(false);
    }
  }, [selectedEnquiryId, selectedPromptType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(draftedContent);
    setHasCopied(true);
    showToast('success', 'Copied to Clipboard', 'Message text copied ready to paste');
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleSaveToNotes = () => {
    if (!selectedEnquiry) return;
    addInternalNote(selectedEnquiry.id, `[AI Assistant Draft Saved]\n${draftedContent}`, 'Scott P.');
    setIsApprovedInDemo(true);
    showToast('success', 'Saved to Timeline', 'Draft appended to enquiry internal notes');
  };

  return (
    <div className={`space-y-4 ${isModal ? 'p-1' : ''}`}>
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#14243C] via-[#0E1A2D] to-[#0B1424] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-4 h-4 text-[#F5B82E]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5B82E]">
              AI Administrative Assistant
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Client-Side Simulation</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Enquiry Triage, Scoping & Response Drafter
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Simulates contextual UK customer communications, missing information checklists, and operational notes. No external AI APIs or subscriptions required.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white self-end sm:self-center"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Grid: Selector & Prompt Types vs Drafted Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Select Enquiry & Task (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Target Enquiry Select */}
          <div className="p-4 rounded-xl bg-[#14243C] border border-white/8 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Target Enquiry Record
            </label>
            <select
              value={selectedEnquiryId}
              onChange={(e) => setSelectedEnquiryId(e.target.value)}
              className="w-full bg-[#0B1424] text-xs text-white p-2.5 rounded-lg border border-white/10 focus:border-[#F5B82E] cursor-pointer"
            >
              {enquiries.map(e => (
                <option key={e.id} value={e.id}>
                  {e.id} — {e.customerName} ({e.service.slice(0, 24)}...)
                </option>
              ))}
            </select>

            {selectedEnquiry && (
              <div className="text-[11px] text-slate-300 pt-1 space-y-0.5 border-t border-white/5 mt-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-white">{selectedEnquiry.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Division:</span>
                  <span className="text-[#F5B82E] font-medium capitalize">{selectedEnquiry.division.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="text-white">{selectedEnquiry.status}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Action Pills */}
          <div className="p-4 rounded-xl bg-[#14243C] border border-white/8 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Assistant Capabilities
            </span>

            <div className="space-y-1.5">
              {[
                { id: 'summarise', label: 'Summarise Selected Enquiry', icon: Sparkles },
                { id: 'ack_message', label: 'Draft Customer Acknowledgement', icon: FileText },
                { id: 'request_photos', label: 'Draft Photo Request Message', icon: Camera },
                { id: 'schedule_survey', label: 'Draft Survey Scheduling Message', icon: Clock },
                { id: 'quote_followup', label: 'Draft Quotation Follow-up', icon: Send },
                { id: 'internal_note', label: 'Generate Internal Ops Note', icon: ShieldCheck }
              ].map(prompt => {
                const Icon = prompt.icon;
                const isCurrent = selectedPromptType === prompt.id;

                return (
                  <button
                    key={prompt.id}
                    onClick={() => setSelectedPromptType(prompt.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-[#1E3557] text-[#F5B82E] font-semibold border border-[#F5B82E]/30'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-[#F5B82E]" />
                      <span>{prompt.label}</span>
                    </span>
                    {isCurrent && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transparency Disclaimer */}
          <div className="p-3 rounded-lg bg-[#0B1424] border border-white/5 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">AI Simulation Notice</span>
            <p className="leading-relaxed">
              Outputs are generated using deterministic templates conditioned on real enquiry fields. No client data is sent to external cloud LLMs.
            </p>
          </div>
        </div>

        {/* Right Column: Output Message Bubble (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-5 rounded-xl bg-[#14243C] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Drafted Output Preview
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingDraft(prev => !prev)}
                  className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-white/5 rounded flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingDraft ? 'Preview' : 'Edit Draft'}</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-xs font-bold bg-[#1E3557] hover:bg-[#25426c] text-[#F5B82E] rounded flex items-center gap-1 cursor-pointer"
                >
                  {hasCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{hasCopied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            {!isEditingDraft ? (
              <div className="bg-[#0B1424] p-4 rounded-xl border border-white/5 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans max-h-[460px] overflow-y-auto selection:bg-[#F5B82E] selection:text-[#0B1424]">
                {draftedContent}
              </div>
            ) : (
              <textarea
                rows={14}
                value={draftedContent}
                onChange={(e) => setDraftedContent(e.target.value)}
                className="w-full bg-[#0B1424] p-4 rounded-xl border border-[#F5B82E]/40 text-xs text-slate-100 font-mono leading-relaxed focus:outline-none"
              />
            )}

            {/* Bottom Approval & Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/8 text-xs">
              <span className="text-slate-400 text-[11px]">
                {isApprovedInDemo ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Draft marked as approved & logged
                  </span>
                ) : (
                  'Review draft before saving to enquiry timeline.'
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToNotes}
                  className="px-3.5 py-1.5 bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Approve & Save to Enquiry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
