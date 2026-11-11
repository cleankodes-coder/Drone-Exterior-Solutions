import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceDivision, ResidentialService, CommercialService, ContactMethod, EnquiryPriority } from '../../types';
import { X, Plus, Sparkles } from 'lucide-react';

interface NewEnquiryModalProps {
  onClose: () => void;
}

const RESIDENTIAL_SERVICES: ResidentialService[] = [
  'Roof Cleaning & Moss Removal',
  'Gutter Clearing & Maintenance',
  'Fascia & Soffit Cleaning',
  'Driveway & Patio Restoration',
  'Render & Exterior Wall Softwash',
  'Solar Panel Cleaning',
  'Conservatory & uPVC Detailing',
  'Annual Exterior Maintenance'
];

const COMMERCIAL_SERVICES: CommercialService[] = [
  'Commercial Drone Cleaning',
  'Warehouse & Industrial Cladding',
  'Commercial Roofs & Rooflights',
  'School & Educational Building Exterior',
  'Commercial Solar Panel Array',
  'Greenhouse & Agricultural Facility',
  'High-Level Glazing & Atria',
  'Planned Commercial Maintenance'
];

export const NewEnquiryModal: React.FC<NewEnquiryModalProps> = ({ onClose }) => {
  const { addEnquiry, setSelectedEnquiryId } = useApp();

  const [division, setDivision] = useState<ServiceDivision>('residential');
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [service, setService] = useState<string>(RESIDENTIAL_SERVICES[0]);
  const [location, setLocation] = useState('Guildford, Surrey');
  const [postcode, setPostcode] = useState('GU1 4AB');
  const [phone, setPhone] = useState('07700 900555');
  const [email, setEmail] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('Website Form');
  const [propertyType, setPropertyType] = useState('4-Bed Detached House');
  const [jobDescription, setJobDescription] = useState('');
  const [priority, setPriority] = useState<EnquiryPriority>('Medium');

  const handleDivisionChange = (newDiv: ServiceDivision) => {
    setDivision(newDiv);
    if (newDiv === 'residential') {
      setService(RESIDENTIAL_SERVICES[0]);
      setPropertyType('4-Bed Detached Residence');
    } else if (newDiv === 'drone_specialist') {
      setService('Commercial Drone Cleaning');
      setPropertyType('Multi-Storey Commercial Facade / Atrium');
    } else {
      setService(COMMERCIAL_SERVICES[1]);
      setPropertyType('Industrial Warehouse Distribution Unit');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !jobDescription.trim()) return;

    const newRecord = addEnquiry({
      customerName: customerName.trim(),
      companyName: companyName.trim() || undefined,
      division,
      service: service as any,
      location: location.trim(),
      postcode: postcode.trim(),
      phone: phone.trim() || '07700 900000',
      email: email.trim() || `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.co.uk`,
      contactMethod,
      propertyType: propertyType.trim(),
      jobDescription: jobDescription.trim(),
      photos: [],
      status: 'New Enquiry',
      priority,
      nextAction: division === 'drone_specialist' 
        ? 'Conduct remote drone flight assessment' 
        : 'Review property satellite imagery and draft quotation',
      assignedTo: division === 'drone_specialist' ? 'Scott P.' : 'Dave M.',
      notes: [],
      missingInformation: [
        'Customer property photographs required',
        'Site access clearance check'
      ],
      droneSurvey: division === 'drone_specialist' ? {
        companyName: companyName.trim() || customerName.trim(),
        siteAddress: `${propertyType}, ${location}`,
        buildingCategory: propertyType,
        approximateHeightMeters: 18,
        approximateAreaSqMeters: 2200,
        surfaceType: 'Commercial profile panels & architectural glazing',
        siteAccessNotes: 'Pending site survey assessment',
        nearbyRestrictions: 'Pending remote airspace check',
        customerPhotosProvided: false,
        airspaceReviewStatus: 'Not Started',
        permissionsReviewStatus: 'Not Started',
        ramsStatus: 'Not Prepared',
        operationalAssessmentStatus: 'Pending Review',
        suitabilityDecision: 'Not Started',
        assignedReviewer: 'Scott P.',
        fiveStepStage: 1
      } : undefined
    });

    setSelectedEnquiryId(newRecord.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-[#0B1424] border border-white/15 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#14243C] p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#F5B82E]" />
              <span>Log New Demo Enquiry</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate capturing a phone or bespoke customer enquiry into the command centre
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          {/* Division Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Business Division</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDivisionChange('residential')}
                className={`py-2 px-3 rounded-lg font-medium border text-center transition-colors cursor-pointer ${
                  division === 'residential'
                    ? 'bg-[#1E3557] border-[#F5B82E] text-white'
                    : 'bg-[#14243C] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Residential Cleaning
              </button>
              <button
                type="button"
                onClick={() => handleDivisionChange('commercial')}
                className={`py-2 px-3 rounded-lg font-medium border text-center transition-colors cursor-pointer ${
                  division === 'commercial'
                    ? 'bg-[#1E3557] border-[#F5B82E] text-white'
                    : 'bg-[#14243C] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Commercial Projects
              </button>
              <button
                type="button"
                onClick={() => handleDivisionChange('drone_specialist')}
                className={`py-2 px-3 rounded-lg font-medium border text-center transition-colors cursor-pointer ${
                  division === 'drone_specialist'
                    ? 'bg-[#1E3557] border-[#F5B82E] text-[#F5B82E]'
                    : 'bg-[#14243C] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Drone Specialist
              </button>
            </div>
          </div>

          {/* Customer / Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Customer Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Graham Spencer"
                className="w-full bg-[#14243C] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Company / Site Name (Optional)</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Surrey Business Logistics"
                className="w-full bg-[#14243C] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E]"
              />
            </div>
          </div>

          {/* Service & Property Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Specific Service</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-[#14243C] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E]"
              >
                {(division === 'residential' ? RESIDENTIAL_SERVICES : COMMERCIAL_SERVICES).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Property / Structure Type</label>
              <input
                type="text"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                placeholder="e.g. 4-Bed Detached / Commercial Atrium"
                className="w-full bg-[#14243C] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E]"
              />
            </div>
          </div>

          {/* Location & Postcode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">UK Town & County</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Winchester, Hampshire"
                className="w-full bg-[#14243C] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Postcode</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="e.g. SO23 8DL"
                className="w-full bg-[#14243C] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E]"
              />
            </div>
          </div>

          {/* Contact Details & Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Telephone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#14243C] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domain.co.uk"
                className="w-full bg-[#14243C] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Contact Channel</label>
              <select
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
                className="w-full bg-[#14243C] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E]"
              >
                <option value="Website Form">Website Form</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Direct Email</option>
                <option value="Phone">Telephone</option>
              </select>
            </div>
          </div>

          {/* Job Scope Description */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Job Scope Description *</label>
            <textarea
              rows={3}
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Describe what cleaning is required, property height, roof pitch, moss density, surface material..."
              className="w-full bg-[#14243C] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E]"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-[11px] text-slate-400">
              * Fictional demo entry stored locally in browser
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] font-bold rounded-lg cursor-pointer"
              >
                Save Enquiry
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
