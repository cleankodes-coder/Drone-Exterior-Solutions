import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  X, 
  Home, 
  Building2, 
  Crosshair, 
  CheckCircle2, 
  ArrowRight, 
  Bot, 
  Camera, 
  FileCheck,
  Shield,
  Layers,
  Zap
} from 'lucide-react';

interface DemoSimulatorModalProps {
  onOpenAssistantForEnquiry: (enquiryId: string) => void;
}

export const DemoSimulatorModal: React.FC<DemoSimulatorModalProps> = ({ onOpenAssistantForEnquiry }) => {
  const { isSimulatorOpen, setIsSimulatorOpen, addEnquiry, setSelectedEnquiryId, setActiveTab } = useApp();

  const [divisionChoice, setDivisionChoice] = useState<'residential' | 'commercial'>('residential');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [createdEnquiryId, setCreatedEnquiryId] = useState<string | null>(null);

  // Form Fields - Residential
  const [resCustomerName, setResCustomerName] = useState('Sarah Jenkins');
  const [resService, setResService] = useState('Roof Cleaning & Moss Removal');
  const [resLocation, setResLocation] = useState('Guildford, Surrey');
  const [resDescription, setResDescription] = useState('Clay tiled roof with thick green moss shedding into front gutters. Seeking gentle scraping and long-lasting biocide softwash treatment.');

  // Form Fields - Commercial
  const [comCompanyName, setComCompanyName] = useState('Solent Distribution Hub');
  const [comContactPerson, setComContactPerson] = useState('David Fletcher (Facilities Manager)');
  const [comBuildingType, setComBuildingType] = useState('High-Bay Logistics Warehouse (18m height)');
  const [comService, setComService] = useState('Commercial Drone Cleaning');
  const [comLocation, setComLocation] = useState('Portsmouth, Hampshire');
  const [comHeight, setComHeight] = useState(18);
  const [comArea, setComArea] = useState(3800);
  const [comRestrictions, setComRestrictions] = useState('24/7 lorry loading bays on south apron; drone tethered wash window on Sunday morning required.');
  const [comDescription, setComDescription] = useState('Heavy traffic film and diesel soot on high architectural cladding panels. Scaffolding would obstruct distribution operations.');

  if (!isSimulatorOpen) return null;

  const handlePreloadResidentialPreset = () => {
    setDivisionChoice('residential');
    setResCustomerName('Sarah Jenkins');
    setResService('Roof Cleaning & Moss Removal');
    setResLocation('Guildford, Surrey');
    setResDescription('Clay tiled roof with thick green moss shedding into front gutters. Seeking gentle scraping and long-lasting biocide softwash treatment.');
  };

  const handlePreloadCommercialPreset = () => {
    setDivisionChoice('commercial');
    setComCompanyName('Solent Distribution Hub');
    setComContactPerson('David Fletcher (Facilities Manager)');
    setComBuildingType('High-Bay Logistics Warehouse');
    setComService('Commercial Drone Cleaning');
    setComLocation('Portsmouth, Hampshire');
    setComHeight(18);
    setComArea(3800);
    setComRestrictions('24/7 lorry loading bays on south apron; drone tethered wash window on Sunday morning required.');
    setComDescription('Heavy traffic film and diesel soot on high architectural cladding panels. Scaffolding would obstruct distribution operations.');
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    setProcessingStep(1);

    // Simulated 1.6s multi-phase operations intake
    setTimeout(() => {
      setProcessingStep(2);
    }, 450);

    setTimeout(() => {
      setProcessingStep(3);
    }, 900);

    setTimeout(() => {
      setProcessingStep(4);
    }, 1350);

    setTimeout(() => {
      let newRecord;

      if (divisionChoice === 'residential') {
        newRecord = addEnquiry({
          customerName: resCustomerName.trim() || 'Residential Customer',
          division: 'residential',
          service: resService as any,
          location: resLocation.trim() || 'Surrey',
          postcode: 'GU1 4AB',
          phone: '07700 900888',
          email: `${resCustomerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
          contactMethod: 'Website Form',
          propertyType: '4-Bed Detached Residence',
          jobDescription: resDescription.trim(),
          photos: [
            { id: `photo-${Date.now()}`, name: 'roof_moss_front_elevation.jpg', type: 'image/jpeg', size: '2.4 MB', uploadedAt: new Date().toISOString() }
          ],
          status: 'New Enquiry',
          priority: 'Medium',
          nextAction: 'Review satellite roof pitch and prepare softwash proposal',
          assignedTo: 'Dave M. (Residential)',
          notes: [
            { id: `n-${Date.now()}`, author: 'System', timestamp: new Date().toISOString(), text: 'Simulated live enquiry intake captured from demo form.' }
          ],
          missingInformation: [
            'Side access clearance confirmation for ladder placement'
          ]
        });
      } else {
        newRecord = addEnquiry({
          customerName: comContactPerson.trim() || 'Commercial Contact',
          companyName: comCompanyName.trim() || 'Commercial Estates Ltd',
          division: 'drone_specialist',
          service: comService as any,
          location: comLocation.trim() || 'Hampshire',
          postcode: 'PO6 4TH',
          phone: '07700 900777',
          email: 'facilities@commercialhub.co.uk',
          contactMethod: 'Website Form',
          propertyType: comBuildingType,
          jobDescription: comDescription.trim(),
          photos: [
            { id: `photo-${Date.now()}`, name: 'commercial_cladding_elevation.jpg', type: 'image/jpeg', size: '4.8 MB', uploadedAt: new Date().toISOString() }
          ],
          status: 'Remote Survey Pending',
          priority: 'High',
          nextAction: 'Scott P. to conduct CAA airspace boundary check and review ground cordon',
          assignedTo: 'Scott P. (Senior Operations)',
          notes: [
            { id: `n-${Date.now()}`, author: 'System', timestamp: new Date().toISOString(), text: 'Specialist drone cleaning enquiry captured. Automated remote survey file provisioned.' }
          ],
          missingInformation: [
            'Confirmation of on-site external water connection / hydrant flow rate',
            'Weekend yard closure agreement for cordon exclusion bubble'
          ],
          droneSurvey: {
            companyName: comCompanyName.trim(),
            siteAddress: `${comBuildingType}, ${comLocation}`,
            buildingCategory: 'Commercial Warehouse Facility',
            approximateHeightMeters: comHeight,
            approximateAreaSqMeters: comArea,
            surfaceType: 'Kingspan composite architectural profile & glass',
            siteAccessNotes: 'Perimeter tarmac apron with security gate access',
            nearbyRestrictions: comRestrictions,
            customerPhotosProvided: true,
            airspaceReviewStatus: 'Specific Authorisation Required',
            permissionsReviewStatus: 'Awaiting Permission',
            ramsStatus: 'Drafting',
            operationalAssessmentStatus: 'Drone Method Recommended',
            suitabilityDecision: 'In Progress',
            assignedReviewer: 'Scott P.',
            fiveStepStage: 1,
            surveyorNotes: 'High bay logistics building. Scaffolding impractical due to 24/7 lorry loading. Prime candidate for tethered drone wash.'
          }
        });
      }

      setCreatedEnquiryId(newRecord.id);
      setIsProcessing(false);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F5B82E', '#14243C', '#FFFFFF', '#38BDF8']
        });
      } catch {
        // fallback
      }
    }, 1800);
  };

  const handleResetSimulator = () => {
    setCreatedEnquiryId(null);
    setIsProcessing(false);
    setProcessingStep(0);
  };

  const handleViewEnquiry = () => {
    if (createdEnquiryId) {
      setSelectedEnquiryId(createdEnquiryId);
      setActiveTab('enquiries');
      setIsSimulatorOpen(false);
    }
  };

  const handleDraftResponse = () => {
    if (createdEnquiryId) {
      setIsSimulatorOpen(false);
      onOpenAssistantForEnquiry(createdEnquiryId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-[#0B1424] border border-[#F5B82E]/40 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#14243C] p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F5B82E] flex items-center justify-center text-[#0B1424] font-bold">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Live Enquiry Simulator</span>
                <span className="text-[10px] bg-[#F5B82E]/20 text-[#F5B82E] px-2 py-0.5 rounded font-mono uppercase font-bold">
                  Interactive Demo
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Simulate how customer website submissions flow directly into this command centre
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSimulatorOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto max-h-[75vh]">
          {isProcessing ? (
            /* PROCESSING SEQUENCE */
            <div className="py-12 px-4 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F5B82E] to-amber-200 text-[#0B1424] flex items-center justify-center mx-auto shadow-xl shadow-[#F5B82E]/20 animate-spin">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">
                  Ingesting Live Simulation Payload...
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Running intake triage, checking geographic jurisdiction, and routing to operational division.
                </p>
              </div>

              {/* Progress Steps */}
              <div className="max-w-md mx-auto text-left space-y-2 bg-[#14243C] p-4 rounded-xl border border-white/5 text-xs">
                <div className={`flex items-center gap-2.5 ${processingStep >= 1 ? 'text-[#F5B82E] font-medium' : 'text-slate-500'}`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>1. Receiving payload from simulated WordPress enquiry form...</span>
                </div>
                <div className={`flex items-center gap-2.5 ${processingStep >= 2 ? 'text-[#F5B82E] font-medium' : 'text-slate-500'}`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>2. Classifying service division & location boundary (Hampshire/Surrey/Sussex)...</span>
                </div>
                <div className={`flex items-center gap-2.5 ${processingStep >= 3 ? 'text-[#F5B82E] font-medium' : 'text-slate-500'}`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>3. Checking high-level drone access vs traditional ground cleaning...</span>
                </div>
                <div className={`flex items-center gap-2.5 ${processingStep >= 4 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>4. Creating operations docket & updating command centre KPIs!</span>
                </div>
              </div>
            </div>
          ) : createdEnquiryId ? (
            /* SUCCESS CONFIRMATION SCREEN */
            <div className="py-8 px-4 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="font-mono text-xs text-[#F5B82E] font-bold bg-[#F5B82E]/10 px-2 py-0.5 rounded border border-[#F5B82E]/20">
                  {createdEnquiryId} Created
                </span>
                <h3 className="text-lg font-bold text-white">
                  Enquiry Successfully Ingested & Triaged!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  The enquiry has been logged to the pipeline, dashboard KPI counters have updated, and an activity audit event has been recorded.
                </p>
              </div>

              <div className="bg-[#14243C] p-4 rounded-xl border border-white/10 text-xs text-left max-w-md mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-semibold text-white">
                    {divisionChoice === 'residential' ? resCustomerName : comContactPerson}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="text-[#F5B82E] font-medium">
                    {divisionChoice === 'residential' ? resService : comService}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Division:</span>
                  <span className="text-white capitalize">
                    {divisionChoice === 'residential' ? 'Residential Exterior' : 'Commercial Drone Specialist'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleViewEnquiry}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] font-bold text-xs rounded-lg transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Enquiry in Pipeline</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDraftResponse}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#1E3557] hover:bg-[#25426c] text-white font-semibold text-xs rounded-lg border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-[#F5B82E]" />
                  <span>Draft Customer Response</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetSimulator}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  ← Test another enquiry simulation
                </button>
              </div>
            </div>
          ) : (
            /* FORM INPUT SCREEN */
            <div className="space-y-5 text-xs">
              {/* Division Selector */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">Select Enquiry Simulation Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handlePreloadResidentialPreset}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      divisionChoice === 'residential'
                        ? 'bg-[#1E3557] border-[#F5B82E] shadow-sm'
                        : 'bg-[#14243C] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-white mb-1">
                      <Home className="w-4 h-4 text-blue-400" />
                      <span>Residential Enquiry</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Roofs, moss removal, gutters, patios, render & conservatories
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={handlePreloadCommercialPreset}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      divisionChoice === 'commercial'
                        ? 'bg-[#1E3557] border-[#F5B82E] shadow-sm'
                        : 'bg-[#14243C] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-white mb-1">
                      <Crosshair className="w-4 h-4 text-[#F5B82E]" />
                      <span>Commercial / Drone Enquiry</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Warehouses, schools, solar arrays, high-level glass & atria
                    </p>
                  </button>
                </div>
              </div>

              {divisionChoice === 'residential' ? (
                /* RESIDENTIAL FIELDS */
                <div className="space-y-3 p-4 rounded-xl bg-[#14243C] border border-white/8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium block">Customer Name</label>
                      <input
                        type="text"
                        value={resCustomerName}
                        onChange={(e) => setResCustomerName(e.target.value)}
                        className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium block">Service Required</label>
                      <select
                        value={resService}
                        onChange={(e) => setResService(e.target.value)}
                        className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10 cursor-pointer"
                      >
                        <option value="Roof Cleaning & Moss Removal">Roof Cleaning & Moss Removal</option>
                        <option value="Gutter Clearing & Maintenance">Gutter Clearing & Maintenance</option>
                        <option value="Fascia & Soffit Cleaning">Fascia & Soffit Cleaning</option>
                        <option value="Driveway & Patio Restoration">Driveway & Patio Restoration</option>
                        <option value="Render & Exterior Wall Softwash">Render & Exterior Wall Softwash</option>
                        <option value="Solar Panel Cleaning">Solar Panel Cleaning</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium block">Property Location (UK)</label>
                    <input
                      type="text"
                      value={resLocation}
                      onChange={(e) => setResLocation(e.target.value)}
                      className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium block">Customer Scope Description</label>
                    <textarea
                      rows={3}
                      value={resDescription}
                      onChange={(e) => setResDescription(e.target.value)}
                      className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                    />
                  </div>
                </div>
              ) : (
                /* COMMERCIAL FIELDS */
                <div className="space-y-3 p-4 rounded-xl bg-[#14243C] border border-white/8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium block">Company / Site Name</label>
                      <input
                        type="text"
                        value={comCompanyName}
                        onChange={(e) => setComCompanyName(e.target.value)}
                        className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium block">Contact Person</label>
                      <input
                        type="text"
                        value={comContactPerson}
                        onChange={(e) => setComContactPerson(e.target.value)}
                        className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium block">Building Type & Height</label>
                      <input
                        type="text"
                        value={comBuildingType}
                        onChange={(e) => setComBuildingType(e.target.value)}
                        className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium block">Commercial Service</label>
                      <select
                        value={comService}
                        onChange={(e) => setComService(e.target.value)}
                        className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10 cursor-pointer"
                      >
                        <option value="Commercial Drone Cleaning">Commercial Drone Cleaning</option>
                        <option value="Warehouse & Industrial Cladding">Warehouse & Industrial Cladding</option>
                        <option value="School & Educational Building Exterior">School & Educational Building Exterior</option>
                        <option value="Commercial Solar Panel Array">Commercial Solar Panel Array</option>
                        <option value="High-Level Glazing & Atria">High-Level Glazing & Atria</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium block">Site Location</label>
                      <input
                        type="text"
                        value={comLocation}
                        onChange={(e) => setComLocation(e.target.value)}
                        className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium block">Approx Height (m)</label>
                      <input
                        type="number"
                        value={comHeight}
                        onChange={(e) => setComHeight(parseInt(e.target.value) || 15)}
                        className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10 text-right"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium block">Approx Area (m²)</label>
                      <input
                        type="number"
                        value={comArea}
                        onChange={(e) => setComArea(parseInt(e.target.value) || 2000)}
                        className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10 text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium block">Site Access Restrictions</label>
                    <input
                      type="text"
                      value={comRestrictions}
                      onChange={(e) => setComRestrictions(e.target.value)}
                      className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium block">Project Description</label>
                    <textarea
                      rows={2}
                      value={comDescription}
                      onChange={(e) => setComDescription(e.target.value)}
                      className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-[11px] text-slate-400">
                  Simulated local submission · zero network latency
                </span>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2.5 bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] font-bold text-xs rounded-lg transition-all shadow-md shadow-[#F5B82E]/20 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#0B1424]" />
                  <span>Submit Demo Enquiry</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
