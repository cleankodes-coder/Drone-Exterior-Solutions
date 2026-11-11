export type ServiceDivision = 'residential' | 'commercial' | 'drone_specialist';

export type ResidentialService = 
  | 'Roof Cleaning & Moss Removal'
  | 'Gutter Clearing & Maintenance'
  | 'Fascia & Soffit Cleaning'
  | 'Driveway & Patio Restoration'
  | 'Render & Exterior Wall Softwash'
  | 'Solar Panel Cleaning'
  | 'Conservatory & uPVC Detailing'
  | 'Annual Exterior Maintenance';

export type CommercialService = 
  | 'Commercial Drone Cleaning'
  | 'Warehouse & Industrial Cladding'
  | 'Commercial Roofs & Rooflights'
  | 'School & Educational Building Exterior'
  | 'Commercial Solar Panel Array'
  | 'Greenhouse & Agricultural Facility'
  | 'High-Level Glazing & Atria'
  | 'Planned Commercial Maintenance';

export type EnquiryStatus = 
  | 'New Enquiry'
  | 'Information Required'
  | 'Awaiting Information'
  | 'Awaiting Assessment'
  | 'Remote Survey Pending'
  | 'Survey Under Review'
  | 'Suitability Decision Required'
  | 'Planning / Documentation'
  | 'Quote Preparation'
  | 'Quote Sent'
  | 'Follow-up Due'
  | 'Booked'
  | 'In Progress'
  | 'Completed'
  | 'Declined';

export type EnquiryPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ContactMethod = 'Website Form' | 'WhatsApp' | 'Email' | 'Phone';

export type DroneSuitabilityDecision = 
  | 'Not Started'
  | 'Awaiting Review'
  | 'In Progress'
  | 'Approved by Team'
  | 'Not Suitable';

export interface PhotoAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
  uploadedAt: string;
  caption?: string;
}

export interface ActivityHistoryItem {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details?: string;
}

export interface InternalNote {
  id: string;
  author: string;
  timestamp: string;
  text: string;
}

export interface DroneSurveyDetails {
  companyName?: string;
  siteAddress: string;
  buildingCategory: string; // e.g. Warehouse, School, Industrial, Retail
  approximateHeightMeters: number;
  approximateAreaSqMeters: number;
  surfaceType: string; // e.g. Metal profile cladding, Polycarbonate, Glass
  siteAccessNotes: string;
  nearbyRestrictions: string; // e.g. Tree line, adjacent railway, overhead cables
  customerPhotosProvided: boolean;
  airspaceReviewStatus: 'Not Started' | 'Clear / Open Category' | 'Specific Authorisation Required' | 'Checked & Approved';
  permissionsReviewStatus: 'Not Started' | 'Landowner Permission Verified' | 'Awaiting Permission' | 'Exempt';
  ramsStatus: 'Not Prepared' | 'Drafting' | 'Completed & Signed' | 'Not Applicable';
  operationalAssessmentStatus: 'Pending Review' | 'Ground Team Sufficient' | 'Drone Method Recommended' | 'Hybrid Access Required';
  suitabilityDecision: DroneSuitabilityDecision;
  assignedReviewer: string;
  surveyCompletedDate?: string;
  surveyorNotes?: string;
  fiveStepStage: 1 | 2 | 3 | 4 | 5; // 1: Remote Survey, 2: Suitability & Permissions, 3: Flight & Method Planning, 4: Controlled Cleaning, 5: Photos & Report
}

export interface EnquiryRecord {
  id: string;
  customerName: string;
  companyName?: string;
  division: ServiceDivision;
  service: ResidentialService | CommercialService;
  location: string; // UK Town / County e.g. 'Guildford, Surrey'
  postcode?: string;
  phone: string;
  email: string;
  contactMethod: ContactMethod;
  dateReceived: string; // ISO string
  propertyType: string; // e.g. '4-Bed Detached House', 'Industrial Warehouse Unit', etc.
  jobDescription: string;
  photos: PhotoAttachment[];
  status: EnquiryStatus;
  priority: EnquiryPriority;
  nextAction: string;
  assignedTo: string;
  sampleQuoteAmount?: number;
  quoteId?: string;
  notes: InternalNote[];
  activityHistory: ActivityHistoryItem[];
  missingInformation: string[];
  droneSurvey?: DroneSurveyDetails;
}

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  enquiryId: string;
  quoteNumber: string;
  customerName: string;
  companyName?: string;
  siteAddress: string;
  service: string;
  division: ServiceDivision;
  createdAt: string;
  validUntil: string;
  status: 'Draft' | 'Awaiting Approval' | 'Sent' | 'Accepted' | 'Declined' | 'Follow-up Required';
  lineItems: QuoteLineItem[];
  subtotal: number;
  applyVat: boolean;
  vatRate: number; // 0.20
  vatAmount: number;
  totalAmount: number;
  notesAndExclusions: string;
  approvedBy?: string;
  approvedDate?: string;
  sentDate?: string;
}

export interface FollowUpItem {
  id: string;
  enquiryId: string;
  customerName: string;
  service: string;
  location: string;
  dueDate: string; // ISO string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  reason: string;
  suggestedAction: string;
  status: 'Pending' | 'Completed' | 'Dismissed';
  notes?: string;
}

export interface CalendarAppointment {
  id: string;
  enquiryId?: string;
  title: string;
  customerName: string;
  location: string;
  type: 'Drone Survey' | 'Residential Cleaning' | 'Commercial Cleaning' | 'Follow-up Call';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationHours: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Rescheduled' | 'Cancelled';
  assignedTeam: string[];
  notes?: string;
}

export interface ActivityNotification {
  id: string;
  timestamp: string;
  type: 'enquiry' | 'survey' | 'quote' | 'followup' | 'calendar' | 'system';
  title: string;
  message: string;
  enquiryId?: string;
  read: boolean;
}
