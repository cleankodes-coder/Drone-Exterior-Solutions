import { 
  EnquiryRecord, 
  Quotation, 
  FollowUpItem, 
  CalendarAppointment, 
  ActivityNotification 
} from '../types';

// Helper to calculate relative ISO dates so the demo is always fresh
const daysAgo = (days: number, hours = 0, mins = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours, d.getMinutes() - mins);
  return d.toISOString();
};

const daysAhead = (days: number, hour = 10, min = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

const formatDateOnly = (daysFromNow: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

export const INITIAL_ENQUIRIES: EnquiryRecord[] = [
  {
    id: 'ENQ-2026-001',
    customerName: 'Marcus Holloway',
    companyName: 'Solent Logistics Park',
    division: 'drone_specialist',
    service: 'Commercial Drone Cleaning',
    location: 'Portsmouth, Hampshire',
    postcode: 'PO6 4TH',
    phone: '07700 900124',
    email: 'm.holloway@solentlogistics.co.uk',
    contactMethod: 'Website Form',
    dateReceived: daysAgo(0, 3, 15),
    propertyType: 'Distribution Warehouse (High Bay)',
    jobDescription: 'High-bay warehouse exterior cladding with heavy industrial particulate buildup. Height approx 18m, footprint 4,200 sq m. Scaffolding would disrupt 24/7 lorry access, looking to evaluate drone wash feasibility.',
    photos: [
      { id: 'p1', name: 'warehouse_elevation_east.jpg', type: 'image/jpeg', size: '2.4 MB', uploadedAt: daysAgo(0, 3) },
      { id: 'p2', name: 'loading_dock_clearance.jpg', type: 'image/jpeg', size: '1.8 MB', uploadedAt: daysAgo(0, 3) }
    ],
    status: 'Survey Under Review',
    priority: 'High',
    nextAction: 'Complete Remote Airspace & Site Access Check',
    assignedTo: 'Scott P. (Senior Operations)',
    notes: [
      { id: 'n1', author: 'Scott P.', timestamp: daysAgo(0, 2), text: 'Initial remote survey check started. Proximity to A27 dual carriageway verified - standard buffer zone required. Client confirmed yard can be cordoned off on Sunday.' }
    ],
    activityHistory: [
      { id: 'a1', timestamp: daysAgo(0, 3, 15), action: 'Enquiry Received via Website Commercial Form', actor: 'Website Integration' },
      { id: 'a2', timestamp: daysAgo(0, 2), action: 'Classified as Specialist Commercial Drone Project', actor: 'Scott P.' },
      { id: 'a3', timestamp: daysAgo(0, 1), action: 'Remote Survey File Created & Boundary Mapped', actor: 'Scott P.' }
    ],
    missingInformation: [
      'Confirmation of on-site 3-phase power or water tap flow rate',
      'Site risk induction procedure document'
    ],
    droneSurvey: {
      companyName: 'Solent Logistics Park Ltd',
      siteAddress: 'Unit 4, Quarter Way, Portsmouth, PO6 4TH',
      buildingCategory: 'Distribution Warehouse',
      approximateHeightMeters: 18,
      approximateAreaSqMeters: 4200,
      surfaceType: 'Kingspan composite architectural cladding & polycarbonate skylights',
      siteAccessNotes: 'Secure yard with automatic barriers. Clear tarmac apron surrounding south and east elevations.',
      nearbyRestrictions: 'Overhead security floodlights; A27 slip road 90m south (outside CAA 50m exclusion bubble).',
      customerPhotosProvided: true,
      airspaceReviewStatus: 'Specific Authorisation Required',
      permissionsReviewStatus: 'Landowner Permission Verified',
      ramsStatus: 'Drafting',
      operationalAssessmentStatus: 'Drone Method Recommended',
      suitabilityDecision: 'In Progress',
      assignedReviewer: 'Scott P.',
      fiveStepStage: 2,
      surveyorNotes: 'Ideal candidate for tethered drone softwash + purified rinse. Will eliminate costly scissor lift hire and eliminate working-at-height risk.'
    }
  },
  {
    id: 'ENQ-2026-002',
    customerName: 'Eleanor Vance',
    division: 'residential',
    service: 'Roof Cleaning & Moss Removal',
    location: 'Guildford, Surrey',
    postcode: 'GU1 2RE',
    phone: '07700 900542',
    email: 'eleanor.vance@guildford-mail.co.uk',
    contactMethod: 'Website Form',
    dateReceived: daysAgo(1, 4),
    propertyType: '4-Bed Detached Victorian Villa',
    jobDescription: 'Heavy moss growth on north-facing clay tile roof. Falling clumps blocking gutters and downpipes. Seeking gentle scraping and biocidal treatment without high-pressure damage.',
    photos: [
      { id: 'p3', name: 'north_roof_pitch.jpg', type: 'image/jpeg', size: '3.1 MB', uploadedAt: daysAgo(1, 4) }
    ],
    status: 'Quote Preparation',
    priority: 'Medium',
    nextAction: 'Draft Softwash & Manual Scraping Quotation',
    assignedTo: 'Dave M. (Residential Lead)',
    sampleQuoteAmount: 940,
    quoteId: 'QUO-2026-081',
    notes: [
      { id: 'n2', author: 'Dave M.', timestamp: daysAgo(1, 2), text: 'Hand scrape from ridge ladders + biocide treatment recommended. Traditional residential equipment appropriate.' }
    ],
    activityHistory: [
      { id: 'a4', timestamp: daysAgo(1, 4), action: 'Enquiry Received via Website Form', actor: 'System' },
      { id: 'a5', timestamp: daysAgo(1, 2), action: 'Property Visualized via StreetView & Satellite', actor: 'Dave M.' }
    ],
    missingInformation: [],
  },
  {
    id: 'ENQ-2026-003',
    customerName: 'Robert Sterling',
    companyName: 'Oakwood Academy Trust',
    division: 'commercial',
    service: 'School & Educational Building Exterior',
    location: 'Southampton, Hampshire',
    postcode: 'SO16 7AB',
    phone: '07700 900891',
    email: 'r.sterling@oakwood-trust.edu.uk',
    contactMethod: 'Email',
    dateReceived: daysAgo(1, 8),
    propertyType: 'Secondary School Campus (3 Storeys)',
    jobDescription: 'Multi-pitched atrium rooflights and high vertical brickwork have black algae and heavy grime. Must be completed during half-term school break when students are off-campus.',
    photos: [
      { id: 'p4', name: 'atrium_rooflight_angles.jpg', type: 'image/jpeg', size: '4.5 MB', uploadedAt: daysAgo(1, 8) }
    ],
    status: 'Remote Survey Pending',
    priority: 'High',
    nextAction: 'Review Campus Satellite Imagery and Access Routes',
    assignedTo: 'Scott P.',
    notes: [
      { id: 'n3', author: 'Scott P.', timestamp: daysAgo(1, 1), text: 'DBS certification required for any staff on campus during handover. Drone survey for atria rooflights is high priority to evaluate access.' }
    ],
    activityHistory: [
      { id: 'a6', timestamp: daysAgo(1, 8), action: 'Commercial Enquiry Logged from Facilities Email', actor: 'Scott P.' }
    ],
    missingInformation: [
      'Exact half-term dates for campus closure',
      'Water point location on roof plant deck'
    ],
    droneSurvey: {
      companyName: 'Oakwood Academy Trust',
      siteAddress: 'Oakwood Way, Bassett, Southampton, SO16 7AB',
      buildingCategory: 'Educational Campus',
      approximateHeightMeters: 14,
      approximateAreaSqMeters: 1850,
      surfaceType: 'Structural glass rooflights, powder coated aluminium frames & red facing brick',
      siteAccessNotes: 'Pedestrianised courtyard between blocks. Low ground bearing capacity prevents heavy cherry picker.',
      nearbyRestrictions: 'Protected oak trees 12m from block C; residential boundary to north.',
      customerPhotosProvided: true,
      airspaceReviewStatus: 'Checked & Approved',
      permissionsReviewStatus: 'Awaiting Permission',
      ramsStatus: 'Drafting',
      operationalAssessmentStatus: 'Hybrid Access Required',
      suitabilityDecision: 'Awaiting Review',
      assignedReviewer: 'Scott P.',
      fiveStepStage: 1,
      surveyorNotes: 'Courtyard cannot take 12-tonne MEWP. Drone wash from perimeter launch point would solve internal glass atrium access.'
    }
  },
  {
    id: 'ENQ-2026-004',
    customerName: 'Sophie Bennett',
    division: 'residential',
    service: 'Gutter Clearing & Maintenance',
    location: 'Farnham, Surrey',
    postcode: 'GU9 7HJ',
    phone: '07700 900329',
    email: 'sophie.b@surreyvistas.co.uk',
    contactMethod: 'WhatsApp',
    dateReceived: daysAgo(0, 1, 45),
    propertyType: '3-Bed Semi-Detached House',
    jobDescription: 'Water overflowing over the front bay window during heavy downpours. Suspected grass/moss plug in downpipe hopper.',
    photos: [],
    status: 'New Enquiry',
    priority: 'Medium',
    nextAction: 'Send automated WhatsApp acknowledgement & ask for property photos',
    assignedTo: 'Dave M.',
    notes: [],
    activityHistory: [
      { id: 'a7', timestamp: daysAgo(0, 1, 45), action: 'WhatsApp Contact Received', actor: 'WhatsApp Integration' }
    ],
    missingInformation: [
      'Photos of front elevation and gutter overflow location',
      'Confirmation if rear gutters also require vacuum clearing'
    ]
  },
  {
    id: 'ENQ-2026-005',
    customerName: 'Thomas Kingsley',
    companyName: 'AeroTech Park Estates',
    division: 'drone_specialist',
    service: 'Commercial Drone Cleaning',
    location: 'Crawley, West Sussex',
    postcode: 'RH10 9PD',
    phone: '07700 900662',
    email: 't.kingsley@aerotech-crawley.co.uk',
    contactMethod: 'Website Form',
    dateReceived: daysAgo(3, 5),
    propertyType: 'Aviation Technology Centre (5 Storeys)',
    jobDescription: 'Modern corporate HQ with curving architectural glass atrium and coated metallic panels. Gatwick FRZ (Flight Restriction Zone) proximity assessment essential.',
    photos: [
      { id: 'p5', name: 'aerotech_curved_facade.jpg', type: 'image/jpeg', size: '5.1 MB', uploadedAt: daysAgo(3, 5) },
      { id: 'p6', name: 'gatwick_boundary_map.jpg', type: 'image/jpeg', size: '1.2 MB', uploadedAt: daysAgo(3, 4) }
    ],
    status: 'Suitability Decision Required',
    priority: 'Urgent',
    nextAction: 'Scott P. to conduct safety risk assessment & CAA airspace review',
    assignedTo: 'Scott P.',
    sampleQuoteAmount: 4850,
    quoteId: 'QUO-2026-079',
    notes: [
      { id: 'n4', author: 'Scott P.', timestamp: daysAgo(2, 6), text: 'Gatwick Airport Air Traffic Control clearance coordination required under our CAA Operational Authorisation. Initial airspace check confirms site is just inside 5km buffer. Pre-flight authorization request drafted.' }
    ],
    activityHistory: [
      { id: 'a8', timestamp: daysAgo(3, 5), action: 'Commercial Enquiry Received', actor: 'Website' },
      { id: 'a9', timestamp: daysAgo(2, 6), action: 'Airspace NOTAM and FRZ Analysis Conducted', actor: 'Scott P.' }
    ],
    missingInformation: [],
    droneSurvey: {
      companyName: 'AeroTech Park Estates Management',
      siteAddress: 'Building 12, Manor Royal, Crawley, RH10 9PD',
      buildingCategory: 'Corporate Commercial HQ',
      approximateHeightMeters: 22,
      approximateAreaSqMeters: 3600,
      surfaceType: 'Alpolic architectural ACM paneling & solar-control curtain glazing',
      siteAccessNotes: 'Perimeter ring road with designated loading zones. Excellent ground cordon perimeter.',
      nearbyRestrictions: 'Inside Gatwick Aerodrome Traffic Zone (ATZ) outer ring. Requires NATS Airspace non-standard flight notification.',
      customerPhotosProvided: true,
      airspaceReviewStatus: 'Specific Authorisation Required',
      permissionsReviewStatus: 'Landowner Permission Verified',
      ramsStatus: 'Completed & Signed',
      operationalAssessmentStatus: 'Drone Method Recommended',
      suitabilityDecision: 'Approved by Team',
      assignedReviewer: 'Scott P.',
      fiveStepStage: 3,
      surveyorNotes: 'FAA/CAA licensed drone operations only. Ground crew of 3 (Pilot, Spotter/Safety Marshal, Ground Pump Technician). Client enthusiastic about avoiding 3 weeks of mobile cradle disruption.'
    }
  },
  {
    id: 'ENQ-2026-006',
    customerName: 'Claire Redfield',
    division: 'residential',
    service: 'Driveway & Patio Restoration',
    location: 'Bordon, Hampshire',
    postcode: 'GU35 0BJ',
    phone: '07700 900119',
    email: 'claire.redfield@bordon-estates.co.uk',
    contactMethod: 'Phone',
    dateReceived: daysAgo(2, 1),
    propertyType: 'Detached Bungalow with Block Pave Drive',
    jobDescription: '220 sq m block paving with heavy black lichen and weed infestation in joint sand. Needs rotary flat surface clean, chemical biocide treatment, and kiln-dried re-sanding.',
    photos: [],
    status: 'Quote Sent',
    priority: 'Low',
    nextAction: 'Follow up on sent quote after 48 hours',
    assignedTo: 'Dave M.',
    sampleQuoteAmount: 680,
    quoteId: 'QUO-2026-080',
    notes: [
      { id: 'n5', author: 'Dave M.', timestamp: daysAgo(1, 5), text: 'Quote sent via email with full specification for hot water surface cleaner and sterile sand re-bedding.' }
    ],
    activityHistory: [
      { id: 'a10', timestamp: daysAgo(2, 1), action: 'Telephone Enquiry Logged', actor: 'Office' },
      { id: 'a11', timestamp: daysAgo(1, 5), action: 'Quote Generated & Dispatched', actor: 'Dave M.' }
    ],
    missingInformation: []
  },
  {
    id: 'ENQ-2026-007',
    customerName: 'Julian Croft',
    division: 'residential',
    service: 'Roof Cleaning & Moss Removal',
    location: 'Winchester, Hampshire',
    postcode: 'SO22 4ND',
    phone: '07700 900773',
    email: 'j.croft@winchester-heritage.org',
    contactMethod: 'Website Form',
    dateReceived: daysAgo(4, 2),
    propertyType: 'Grade II Listed Thatched & Slate Cottage',
    jobDescription: 'Rear slate wing has severe moss buildup. Customer specifically noted: NO pressure washing or heavy walking on historic Welsh slates.',
    photos: [
      { id: 'p7', name: 'historic_slate_roof.jpg', type: 'image/jpeg', size: '3.9 MB', uploadedAt: daysAgo(4, 2) }
    ],
    status: 'Booked',
    priority: 'High',
    nextAction: 'Prepare heritage softwash formulation & specialized padded ladder kit',
    assignedTo: 'Scott P.',
    sampleQuoteAmount: 1150,
    quoteId: 'QUO-2026-077',
    notes: [
      { id: 'n6', author: 'Scott P.', timestamp: daysAgo(3, 1), text: 'Inspected photos. Hand scrape using specialized slate profiles followed by DDAC softwash spray treatment at 3 bar max pressure. Customer accepted quote.' }
    ],
    activityHistory: [
      { id: 'a12', timestamp: daysAgo(4, 2), action: 'Enquiry Received', actor: 'Website' },
      { id: 'a13', timestamp: daysAgo(3, 4), action: 'Heritage Softwash Quote Sent', actor: 'Scott P.' },
      { id: 'a14', timestamp: daysAgo(2, 3), action: 'Customer Accepted Quote & Confirmed Date', actor: 'Office' }
    ],
    missingInformation: []
  },
  {
    id: 'ENQ-2026-008',
    customerName: 'Gareth Evans',
    companyName: 'Chichester Retail Park',
    division: 'commercial',
    service: 'Warehouse & Industrial Cladding',
    location: 'Chichester, West Sussex',
    postcode: 'PO19 8EP',
    phone: '07700 900405',
    email: 'g.evans@chichester-retail.co.uk',
    contactMethod: 'Website Form',
    dateReceived: daysAgo(5, 3),
    propertyType: 'Out-of-Town Superstore Units',
    jobDescription: 'Annual wash-down of front retail canopy, trapezoidal steel cladding, and high-level aluminium gutter lines before brand audit.',
    photos: [
      { id: 'p8', name: 'retail_cladding_elevation.jpg', type: 'image/jpeg', size: '4.1 MB', uploadedAt: daysAgo(5, 3) }
    ],
    status: 'Follow-up Due',
    priority: 'Medium',
    nextAction: 'Call Gareth regarding revised phasing to avoid customer weekend traffic',
    assignedTo: 'Scott P.',
    sampleQuoteAmount: 3400,
    quoteId: 'QUO-2026-075',
    notes: [
      { id: 'n7', author: 'Scott P.', timestamp: daysAgo(2, 4), text: 'Quote sent 3 days ago. Needs polite follow-up to agree Sunday early morning work window.' }
    ],
    activityHistory: [
      { id: 'a15', timestamp: daysAgo(5, 3), action: 'Enquiry Logged', actor: 'Website' },
      { id: 'a16', timestamp: daysAgo(4, 1), action: 'Commercial Specification & Quotation Sent', actor: 'Scott P.' }
    ],
    missingInformation: []
  },
  {
    id: 'ENQ-2026-009',
    customerName: 'Hannah Davies',
    companyName: 'Woking Horizon Centre',
    division: 'commercial',
    service: 'High-Level Glazing & Atria',
    location: 'Woking, Surrey',
    postcode: 'GU21 6YG',
    phone: '07700 900258',
    email: 'h.davies@horizoncentre-woking.com',
    contactMethod: 'Email',
    dateReceived: daysAgo(0, 5),
    propertyType: '6-Storey Glass Office Complex',
    jobDescription: 'Internal / external atrium glass facade. Bird droppings and traffic film from nearby rail line. Previous contractor unable to reach upper 2 storeys without rail possession.',
    photos: [
      { id: 'p9', name: 'woking_atrium_railway.jpg', type: 'image/jpeg', size: '6.2 MB', uploadedAt: daysAgo(0, 5) }
    ],
    status: 'New Enquiry',
    priority: 'Urgent',
    nextAction: 'Assess drone reach vs pure water carbon pole limits',
    assignedTo: 'Scott P.',
    notes: [],
    activityHistory: [
      { id: 'a17', timestamp: daysAgo(0, 5), action: 'Direct Facilities Enquiry Received via Email', actor: 'Email' }
    ],
    missingInformation: [
      'Proximity distance to Network Rail track boundary line',
      'Site plan showing private courtyard access'
    ],
    droneSurvey: {
      companyName: 'Horizon Business Centre Woking',
      siteAddress: 'Station Approach, Woking, GU21 6YG',
      buildingCategory: 'Commercial Office Atrium',
      approximateHeightMeters: 24,
      approximateAreaSqMeters: 2800,
      surfaceType: 'Solar reflective double glazing & silicone gasket frames',
      siteAccessNotes: 'Pedestrian plaza at ground level. Vehicle delivery bay available for water bowser.',
      nearbyRestrictions: 'Network Rail mainline 35m west. Requires Network Rail Asset Protection (ASPRO) consultation if drone overflight is considered.',
      customerPhotosProvided: true,
      airspaceReviewStatus: 'Specific Authorisation Required',
      permissionsReviewStatus: 'Awaiting Permission',
      ramsStatus: 'Not Prepared',
      operationalAssessmentStatus: 'Pending Review',
      suitabilityDecision: 'Awaiting Review',
      assignedReviewer: 'Scott P.',
      fiveStepStage: 1,
      surveyorNotes: 'Critical railway proximity requires strict non-fly buffer or directional tethering system.'
    }
  },
  {
    id: 'ENQ-2026-010',
    customerName: 'Nigel Thornberry',
    companyName: 'Sussex Commercial Parks',
    division: 'commercial',
    service: 'Planned Commercial Maintenance',
    location: 'Horsham, West Sussex',
    postcode: 'RH12 1TL',
    phone: '07700 900994',
    email: 'n.thornberry@sussexcommercial.co.uk',
    contactMethod: 'Website Form',
    dateReceived: daysAgo(6, 4),
    propertyType: '12-Unit Industrial Estate',
    jobDescription: 'Bi-annual contract for gutter clearing, roof debris removal and fascia washing across 12 tenanted light industrial units.',
    photos: [],
    status: 'In Progress',
    priority: 'High',
    nextAction: 'Phase 1 gutter vacuum operations underway on units 1-6',
    assignedTo: 'Dave M.',
    sampleQuoteAmount: 6200,
    quoteId: 'QUO-2026-071',
    notes: [
      { id: 'n8', author: 'Dave M.', timestamp: daysAgo(1, 7), text: 'Phase 1 started today with cherry picker and 3-motor SkyVac gutter system.' }
    ],
    activityHistory: [
      { id: 'a18', timestamp: daysAgo(6, 4), action: 'Tender Enquiry Logged', actor: 'Office' },
      { id: 'a19', timestamp: daysAgo(4, 5), action: 'Contract Signed & RAMS Accepted', actor: 'Scott P.' },
      { id: 'a20', timestamp: daysAgo(1, 7), action: 'Field Team Mobilised on Site', actor: 'Dave M.' }
    ],
    missingInformation: []
  },
  {
    id: 'ENQ-2026-011',
    customerName: 'Arthur Pendelton',
    companyName: 'GreenFields Energy Ltd',
    division: 'drone_specialist',
    service: 'Commercial Solar Panel Array',
    location: 'Basingstoke, Hampshire',
    postcode: 'RG24 8WY',
    phone: '07700 900381',
    email: 'a.pendelton@greenfields-energy.co.uk',
    contactMethod: 'Website Form',
    dateReceived: daysAgo(3, 1),
    propertyType: 'Rooftop Solar PV Array (2,200 Panels)',
    jobDescription: 'Large commercial distribution centre roof with 2,200 photovoltaic modules. Output dropped 14% due to organic dust, bird fouling and pollen coating.',
    photos: [
      { id: 'p10', name: 'solar_panel_array_overhead.jpg', type: 'image/jpeg', size: '5.8 MB', uploadedAt: daysAgo(3, 1) }
    ],
    status: 'Survey Under Review',
    priority: 'High',
    nextAction: 'Verify pure de-ionised water drone cleaning rig flow rate requirement',
    assignedTo: 'Scott P.',
    notes: [
      { id: 'n9', author: 'Scott P.', timestamp: daysAgo(2, 3), text: 'Standard rotary brush on long poles is too slow (would take 8 days). Drone spray wash with heated pure RO water can complete in 2 days without panel micro-fracturing.' }
    ],
    activityHistory: [
      { id: 'a21', timestamp: daysAgo(3, 1), action: 'Solar Array Commercial Enquiry Received', actor: 'Website' },
      { id: 'a22', timestamp: daysAgo(2, 3), action: 'Roof Load Assessment & Drone Flight Profile Calculated', actor: 'Scott P.' }
    ],
    missingInformation: [
      'Inverter monitoring system baseline data',
      'Roof parapet safety lifeline inspection certificate'
    ],
    droneSurvey: {
      companyName: 'GreenFields Energy & Logistics',
      siteAddress: 'Chineham Business Park, Basingstoke, RG24 8WY',
      buildingCategory: 'Solar PV Commercial Roof Array',
      approximateHeightMeters: 16,
      approximateAreaSqMeters: 4800,
      surfaceType: 'Tempered solar glass modules & aluminium racking',
      siteAccessNotes: 'Internal roof hatch staircase. Good flat roof working environment.',
      nearbyRestrictions: 'Overhead 11kV lines 200m away (well clear of flight grid).',
      customerPhotosProvided: true,
      airspaceReviewStatus: 'Clear / Open Category',
      permissionsReviewStatus: 'Landowner Permission Verified',
      ramsStatus: 'Completed & Signed',
      operationalAssessmentStatus: 'Drone Method Recommended',
      suitabilityDecision: 'Approved by Team',
      assignedReviewer: 'Scott P.',
      fiveStepStage: 3,
      surveyorNotes: 'Zero touch pressure wash with pure RO de-ionised water ensures zero panel glass warranty voiding.'
    }
  },
  {
    id: 'ENQ-2026-012',
    customerName: 'Fiona Gallagher',
    division: 'residential',
    service: 'Render & Exterior Wall Softwash',
    location: 'Petersfield, Hampshire',
    postcode: 'GU31 4EX',
    phone: '07700 900593',
    email: 'fiona.g@southdowns-retreat.co.uk',
    contactMethod: 'Website Form',
    dateReceived: daysAgo(7, 3),
    propertyType: 'Modern Monocouche Render Detached Home',
    jobDescription: 'Red and green algae streaks running down the west gable wall render. Needs gentle chemical softwash; builder warned power washer will blow the render coating.',
    photos: [
      { id: 'p11', name: 'render_staining_gable.jpg', type: 'image/jpeg', size: '2.9 MB', uploadedAt: daysAgo(7, 3) }
    ],
    status: 'Completed',
    priority: 'Low',
    nextAction: 'Send 6-month biocide inspection check reminder',
    assignedTo: 'Dave M.',
    sampleQuoteAmount: 780,
    quoteId: 'QUO-2026-068',
    notes: [
      { id: 'n10', author: 'Dave M.', timestamp: daysAgo(3, 2), text: 'Job completed with Biocidal Softwash DDAC 40. Before and after photos sent to client. Customer left 5-star review.' }
    ],
    activityHistory: [
      { id: 'a23', timestamp: daysAgo(7, 3), action: 'Enquiry Received', actor: 'Website' },
      { id: 'a24', timestamp: daysAgo(6, 2), action: 'Quote Accepted', actor: 'Customer' },
      { id: 'a25', timestamp: daysAgo(3, 2), action: 'Softwash Treatment Applied & Rinse Completed', actor: 'Dave M.' }
    ],
    missingInformation: []
  },
  {
    id: 'ENQ-2026-013',
    customerName: 'Oliver Twist',
    division: 'residential',
    service: 'Conservatory & uPVC Detailing',
    location: 'Midhurst, West Sussex',
    postcode: 'GU29 9DH',
    phone: '07700 900812',
    email: 'oliver.t@midhurst-cottages.co.uk',
    contactMethod: 'WhatsApp',
    dateReceived: daysAgo(0, 0, 50),
    propertyType: 'Edwardian Home with Victorian Glass Conservatory',
    jobDescription: 'Polycarbonate roof panels on large rear conservatory are black with lichens and green grime. Finials and crestings require detailed hand restoration.',
    photos: [],
    status: 'Awaiting Information',
    priority: 'Medium',
    nextAction: 'Ask customer for photo of conservatory roof access clearance',
    assignedTo: 'Dave M.',
    notes: [],
    activityHistory: [
      { id: 'a26', timestamp: daysAgo(0, 0, 50), action: 'WhatsApp Message Received with Enquiry', actor: 'WhatsApp' }
    ],
    missingInformation: [
      'Photos showing side garden access for telescopic pole reach',
      'Confirmation of whether roof glass is active self-cleaning glass'
    ]
  },
  {
    id: 'ENQ-2026-014',
    customerName: 'Patricia Campbell',
    companyName: 'Wey Valley Business Park',
    division: 'commercial',
    service: 'Commercial Roofs & Rooflights',
    location: 'Alton, Hampshire',
    postcode: 'GU34 2QJ',
    phone: '07700 900447',
    email: 'p.campbell@weyvalleyestates.co.uk',
    contactMethod: 'Phone',
    dateReceived: daysAgo(4, 6),
    propertyType: 'Industrial Multi-Bay Warehouse',
    jobDescription: '2,600 sq m curved cement sheet roofing with heavy moss clumps shedding onto fire escape walkways. Rooflights are completely opaque from dirt.',
    photos: [
      { id: 'p12', name: 'alton_warehouse_roof.jpg', type: 'image/jpeg', size: '4.7 MB', uploadedAt: daysAgo(4, 6) }
    ],
    status: 'Quote Sent',
    priority: 'High',
    nextAction: 'Review commercial contract terms with property asset manager',
    assignedTo: 'Scott P.',
    sampleQuoteAmount: 5400,
    quoteId: 'QUO-2026-076',
    notes: [
      { id: 'n11', author: 'Scott P.', timestamp: daysAgo(2, 5), text: 'Asbestos cement precautions incorporated into safety plan. Non-fragile roof walk boards or drone application specified.' }
    ],
    activityHistory: [
      { id: 'a27', timestamp: daysAgo(4, 6), action: 'Phone Enquiry Received', actor: 'Office' },
      { id: 'a28', timestamp: daysAgo(2, 5), action: 'Commercial Quotation and RAMS Proposal Issued', actor: 'Scott P.' }
    ],
    missingInformation: []
  },
  {
    id: 'ENQ-2026-015',
    customerName: 'David Sterling-Webb',
    division: 'residential',
    service: 'Solar Panel Cleaning',
    location: 'Haslemere, Surrey',
    postcode: 'GU27 1AB',
    phone: '07700 900674',
    email: 'd.sterlingwebb@surrey-manor.com',
    contactMethod: 'Website Form',
    dateReceived: daysAgo(2, 8),
    propertyType: 'Detached 5-Bed Residence with 18 Roof Panels',
    jobDescription: '18 high-efficiency domestic solar panels on second storey roof. Heavily soiled by pigeon activity and oak tree sap. Pure water cleaning requested.',
    photos: [],
    status: 'Awaiting Assessment',
    priority: 'Low',
    nextAction: 'Check ladder / carbon pole access angle from front driveway',
    assignedTo: 'Dave M.',
    sampleQuoteAmount: 220,
    quoteId: 'QUO-2026-082',
    notes: [
      { id: 'n12', author: 'Dave M.', timestamp: daysAgo(1, 4), text: 'Can be reached from ground level using our 40ft carbon fiber ionic water pole system.' }
    ],
    activityHistory: [
      { id: 'a29', timestamp: daysAgo(2, 8), action: 'Website Form Submission', actor: 'System' }
    ],
    missingInformation: []
  }
];

export const INITIAL_QUOTES: Quotation[] = [
  {
    id: 'QUO-2026-079',
    enquiryId: 'ENQ-2026-005',
    quoteNumber: 'DES-2026-079',
    customerName: 'Thomas Kingsley',
    companyName: 'AeroTech Park Estates Management',
    siteAddress: 'Building 12, Manor Royal, Crawley, RH10 9PD',
    service: 'Commercial Drone Cleaning',
    division: 'drone_specialist',
    createdAt: daysAgo(2, 4),
    validUntil: daysAhead(28),
    status: 'Sent',
    lineItems: [
      { id: 'li1', description: 'CAA Operational Authorisation, NOTAM filing & Flight Risk Assessment (RAMS)', quantity: 1, unit: 'Project Fee', unitPrice: 450, total: 450 },
      { id: 'li2', description: 'Drone Specialized High-Flow Softwash Cleaning (3,600 sq m facade)', quantity: 3600, unit: 'sq m', unitPrice: 0.95, total: 3420 },
      { id: 'li3', description: 'De-ionised Pure Water Rinse & Glazing Spot-Free Finish', quantity: 1, unit: 'System Fee', unitPrice: 480, total: 480 },
      { id: 'li4', description: 'Ground Safety Exclusion Cordon & Certified Traffic Marshal Support', quantity: 2, unit: 'Days', unitPrice: 250, total: 500 }
    ],
    subtotal: 4850,
    applyVat: true,
    vatRate: 0.20,
    vatAmount: 970,
    totalAmount: 5820,
    notesAndExclusions: 'Includes CAA certified commercial pilots, tethered wash rig and bio-safe chemical solution. Excludes mains water supply (standard on-site external hydrant required). Demo illustrative quote only.',
    approvedBy: 'Scott P.',
    approvedDate: daysAgo(2, 4),
    sentDate: daysAgo(2, 3)
  },
  {
    id: 'QUO-2026-081',
    enquiryId: 'ENQ-2026-002',
    quoteNumber: 'DES-2026-081',
    customerName: 'Eleanor Vance',
    siteAddress: '14 St. Catherine’s Hill, Guildford, GU1 2RE',
    service: 'Roof Cleaning & Moss Removal',
    division: 'residential',
    createdAt: daysAgo(1, 2),
    validUntil: daysAhead(29),
    status: 'Draft',
    lineItems: [
      { id: 'li5', description: 'Manual Roof Tile Moss Scraping (Gentle wire/profile blades from roof ladders)', quantity: 1, unit: 'Pitch Area', unitPrice: 580, total: 580 },
      { id: 'li6', description: 'Biocidal Softwash Treatment Application (prevents regrowth for up to 3 years)', quantity: 1, unit: 'Treatment', unitPrice: 260, total: 260 },
      { id: 'li7', description: 'Gutter Clearance, Downpipe Flush & Ground Surface Washdown', quantity: 1, unit: 'Cleanup', unitPrice: 100, total: 100 }
    ],
    subtotal: 940,
    applyVat: false,
    vatRate: 0.20,
    vatAmount: 0,
    totalAmount: 940,
    notesAndExclusions: 'Residential quote. No heavy pressure washing to safeguard clay tiles. Includes cleanup and disposal of scraped moss.',
    approvedBy: 'Dave M.'
  },
  {
    id: 'QUO-2026-080',
    enquiryId: 'ENQ-2026-006',
    quoteNumber: 'DES-2026-080',
    customerName: 'Claire Redfield',
    siteAddress: '28 Pine Ridge Way, Bordon, GU35 0BJ',
    service: 'Driveway & Patio Restoration',
    division: 'residential',
    createdAt: daysAgo(1, 5),
    validUntil: daysAhead(29),
    status: 'Sent',
    lineItems: [
      { id: 'li8', description: 'Hot Water Rotary Surface Deep Clean (220 sq m block paving)', quantity: 220, unit: 'sq m', unitPrice: 2.20, total: 484 },
      { id: 'li9', description: 'Black Lichen & Algae Spot Biocide Treatment', quantity: 1, unit: 'Lot', unitPrice: 96, total: 96 },
      { id: 'li10', description: 'Sterile Kiln-Dried Joint Sanding Application & Compaction Sweep', quantity: 1, unit: 'Driveway', unitPrice: 100, total: 100 }
    ],
    subtotal: 680,
    applyVat: false,
    vatRate: 0.20,
    vatAmount: 0,
    totalAmount: 680,
    notesAndExclusions: 'Driveway must remain dry for 24h prior to kiln-dried sanding step. Water access required on site.',
    approvedBy: 'Dave M.',
    sentDate: daysAgo(1, 5)
  },
  {
    id: 'QUO-2026-077',
    enquiryId: 'ENQ-2026-007',
    quoteNumber: 'DES-2026-077',
    customerName: 'Julian Croft',
    siteAddress: 'The Old Rectory, Kingsgate Street, Winchester, SO22 4ND',
    service: 'Roof Cleaning & Moss Removal',
    division: 'residential',
    createdAt: daysAgo(3, 4),
    validUntil: daysAhead(27),
    status: 'Accepted',
    lineItems: [
      { id: 'li11', description: 'Heritage Slate Delicate Hand Moss Removal with Padded Foam Crawling Boards', quantity: 1, unit: 'Roof Area', unitPrice: 750, total: 750 },
      { id: 'li12', description: 'Low-Pressure Conservation Grade Biocide Application (PH Neutral)', quantity: 1, unit: 'Treatment', unitPrice: 300, total: 300 },
      { id: 'li13', description: 'Lead Flashing Inspection & Gutter Clean', quantity: 1, unit: 'Service', unitPrice: 100, total: 100 }
    ],
    subtotal: 1150,
    applyVat: false,
    vatRate: 0.20,
    vatAmount: 0,
    totalAmount: 1150,
    notesAndExclusions: 'Accepted by client. Booked for scheduled execution with heritage conservation safeguards.',
    approvedBy: 'Scott P.',
    approvedDate: daysAgo(3, 3),
    sentDate: daysAgo(3, 4)
  }
];

export const INITIAL_FOLLOW_UPS: FollowUpItem[] = [
  {
    id: 'FOL-001',
    enquiryId: 'ENQ-2026-008',
    customerName: 'Gareth Evans (Chichester Retail Park)',
    service: 'Warehouse & Industrial Cladding',
    location: 'Chichester, West Sussex',
    dueDate: daysAhead(0, 14, 0),
    priority: 'High',
    reason: 'Quote unanswered after 3 days',
    suggestedAction: 'Call customer to confirm review of proposal and discuss Sunday early morning phased access.',
    status: 'Pending'
  },
  {
    id: 'FOL-002',
    enquiryId: 'ENQ-2026-004',
    customerName: 'Sophie Bennett',
    service: 'Gutter Clearing & Maintenance',
    location: 'Farnham, Surrey',
    dueDate: daysAhead(0, 16, 30),
    priority: 'Medium',
    reason: 'Photos requested but not received',
    suggestedAction: 'Send friendly WhatsApp reminder asking for quick snap of front roofline to confirm fixed pricing.',
    status: 'Pending'
  },
  {
    id: 'FOL-003',
    enquiryId: 'ENQ-2026-003',
    customerName: 'Robert Sterling (Oakwood Academy Trust)',
    service: 'School & Educational Building Exterior',
    location: 'Southampton, Hampshire',
    dueDate: daysAhead(1, 10, 0),
    priority: 'High',
    reason: 'Survey awaiting site visit & school holiday confirmation',
    suggestedAction: 'Confirm site access window during upcoming half term break and clarify DBS personnel requirements.',
    status: 'Pending'
  },
  {
    id: 'FOL-004',
    enquiryId: 'ENQ-2026-006',
    customerName: 'Claire Redfield',
    service: 'Driveway & Patio Restoration',
    location: 'Bordon, Hampshire',
    dueDate: daysAhead(2, 11, 0),
    priority: 'Low',
    reason: 'Quote sent 24 hours ago',
    suggestedAction: 'Send check-in message regarding scheduled dates before diary fills up for next week.',
    status: 'Pending'
  },
  {
    id: 'FOL-005',
    enquiryId: 'ENQ-2026-014',
    customerName: 'Patricia Campbell (Wey Valley)',
    service: 'Commercial Roofs & Rooflights',
    location: 'Alton, Hampshire',
    dueDate: daysAhead(1, 15, 0),
    priority: 'Medium',
    reason: 'Commercial contract terms review',
    suggestedAction: 'Follow up on RAMS approval and confirm availability of water supply connection on site.',
    status: 'Pending'
  }
];

export const INITIAL_CALENDAR_APPOINTMENTS: CalendarAppointment[] = [
  {
    id: 'CAL-001',
    enquiryId: 'ENQ-2026-007',
    title: 'Heritage Slate Roof Softwash & Hand Scrape',
    customerName: 'Julian Croft',
    location: 'Kingsgate Street, Winchester, SO22 4ND',
    type: 'Residential Cleaning',
    date: formatDateOnly(1),
    time: '08:30',
    durationHours: 6,
    status: 'Scheduled',
    assignedTeam: ['Dave M.', 'Mark R.'],
    notes: 'Grade II listed property. Use padded roof ladders and PH neutral biocidal wash.'
  },
  {
    id: 'CAL-002',
    enquiryId: 'ENQ-2026-005',
    title: 'On-Site Flight Boundary Survey & Airspace Check',
    customerName: 'Thomas Kingsley (AeroTech)',
    location: 'Manor Royal, Crawley, RH10 9PD',
    type: 'Drone Survey',
    date: formatDateOnly(2),
    time: '10:00',
    durationHours: 3,
    status: 'Scheduled',
    assignedTeam: ['Scott P.', 'Liam T. (Observer)'],
    notes: 'Pre-flight perimeter inspection and Gatwick ATZ coordination test.'
  },
  {
    id: 'CAL-003',
    enquiryId: 'ENQ-2026-010',
    title: 'Industrial Estate Gutter & Roof Clearance (Phase 1)',
    customerName: 'Nigel Thornberry (Sussex Commercial Parks)',
    location: 'Foundry Lane, Horsham, RH12 1TL',
    type: 'Commercial Cleaning',
    date: formatDateOnly(0), // Today
    time: '07:30',
    durationHours: 7,
    status: 'In Progress',
    assignedTeam: ['Dave M.', 'Chris B.'],
    notes: 'Phase 1 units 1-6 skyvac gutter clearing underway.'
  },
  {
    id: 'CAL-004',
    enquiryId: 'ENQ-2026-011',
    title: 'Commercial Solar PV Rooftop Inspection',
    customerName: 'Arthur Pendelton (GreenFields Energy)',
    location: 'Chineham Business Park, Basingstoke, RG24 8WY',
    type: 'Drone Survey',
    date: formatDateOnly(4),
    time: '13:30',
    durationHours: 2.5,
    status: 'Scheduled',
    assignedTeam: ['Scott P.'],
    notes: 'Thermal & visual baseline check of 2,200 panels.'
  },
  {
    id: 'CAL-005',
    enquiryId: 'ENQ-2026-002',
    title: 'Victorian Villa Roof Scrape & Softwash',
    customerName: 'Eleanor Vance',
    location: 'St. Catherine’s Hill, Guildford, GU1 2RE',
    type: 'Residential Cleaning',
    date: formatDateOnly(5),
    time: '09:00',
    durationHours: 5,
    status: 'Scheduled',
    assignedTeam: ['Dave M.'],
    notes: 'Clay tile roof - standard hand scrape from ridge.'
  }
];

export const INITIAL_NOTIFICATIONS: ActivityNotification[] = [
  {
    id: 'notif-1',
    timestamp: daysAgo(0, 0, 15),
    type: 'enquiry',
    title: 'New Commercial Drone Enquiry',
    message: 'Portsmouth Logistics Park submitted high-bay warehouse cleaning enquiry (18m height).',
    enquiryId: 'ENQ-2026-001',
    read: false
  },
  {
    id: 'notif-2',
    timestamp: daysAgo(0, 1, 45),
    type: 'followup',
    title: 'Urgent Follow-up Due Today',
    message: 'Chichester Retail Park quote (DES-2026-075) requires follow-up call regarding Sunday access.',
    enquiryId: 'ENQ-2026-008',
    read: false
  },
  {
    id: 'notif-3',
    timestamp: daysAgo(0, 2, 10),
    type: 'survey',
    title: 'RAMS Draft Completed',
    message: 'Crawley AeroTech Park CAA RAMS completed and ready for Scott P. sign-off.',
    enquiryId: 'ENQ-2026-005',
    read: true
  },
  {
    id: 'notif-4',
    timestamp: daysAgo(1, 3),
    type: 'quote',
    title: 'Sample Quote Accepted',
    message: 'Julian Croft (Winchester Heritage Cottage) accepted softwash quote £1,150.',
    enquiryId: 'ENQ-2026-007',
    read: true
  }
];
