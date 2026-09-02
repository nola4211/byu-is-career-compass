export type CareerId =
  | 'softwareEngineering'
  | 'businessSystemsAnalyst'
  | 'dataAnalytics'
  | 'cybersecurity'
  | 'itProjectManager'
  | 'uxProductManager'
  | 'erpConsultant'
  | 'cloudInfrastructure';

export type Career = {
  id: CareerId;
  name: string;
  tagline: string;
  description: string;
  orientation: 'technical' | 'business';
  typicalWork: string[];
  skills: string[];
  technologies: string[];
  traits: { technical: number; analytical: number; people: number; building: number };
  byuPreparation: string[];
  interviewTopics: string[];
  sources: string[];
};

export const CAREER_IDS: CareerId[] = [
  'softwareEngineering', 'businessSystemsAnalyst', 'dataAnalytics', 'cybersecurity',
  'itProjectManager', 'uxProductManager', 'erpConsultant', 'cloudInfrastructure',
];

export const programProfile = {
  classYear: 2025,
  graduates: 123,
  seekingFullTime: 100,
  placementWithinThreeMonths: 90,
  averageSalary: 72820,
  medianSalary: 74000,
  bonusReporting: 22,
  averageBonus: 13306,
  medianBonus: 6750,
  topEmployers: ['Qualtrics', 'EY', 'Eide Bailly'],
  source: 'https://marriott.byu.edu/infosys/careers/placement-profile/bsis/',
};

export const careerPresentation: Record<CareerId, { shortName: string; accent: string }> = {
  softwareEngineering: { shortName: 'Development', accent: '#f0ad4e' },
  businessSystemsAnalyst: { shortName: 'Systems Analysis', accent: '#52a3d8' },
  dataAnalytics: { shortName: 'Analytics', accent: '#16b5a3' },
  cybersecurity: { shortName: 'Security', accent: '#f36f5a' },
  itProjectManager: { shortName: 'Project Management', accent: '#ca7759' },
  uxProductManager: { shortName: 'UX & Product', accent: '#be6ea8' },
  erpConsultant: { shortName: 'ERP Consulting', accent: '#7f78d2' },
  cloudInfrastructure: { shortName: 'Cloud', accent: '#4e8f99' },
};

const atAGlance = 'https://marriott.byu.edu/infosys/about/what-is-information-systems/at-a-glance/';
const is201 = 'https://catalog.byu.edu/courses/08962-004';
const programOverview = 'https://marriott.byu.edu/infosys/bsis/what-will-i-study/program-overview/';

export const careers: Record<CareerId, Career> = {
  softwareEngineering: {
    id: 'softwareEngineering',
    name: 'Software / Application Developer',
    tagline: 'A technical path for building software and applications.',
    description: 'BYU identifies Programmer/Software Engineer and Mobile Application Developer as technically oriented Information Systems careers. The MISM program also offers a dedicated Development track.',
    orientation: 'technical',
    typicalWork: ['Programmer / Software Engineer', 'Mobile Application Developer'],
    skills: ['Programming fundamentals', 'Database design and querying', 'Web development', 'Computing and networks'],
    technologies: [],
    traits: { technical: 9, analytical: 7, people: 4, building: 10 },
    byuPreparation: ['MISM Development track', 'IS 201: Introduction to Management Information Systems'],
    interviewTopics: ['Programming fundamentals', 'Databases', 'Web development', 'Computing and networks'],
    sources: [atAGlance, 'https://marriott.byu.edu/infosys/mism/tracks/development/', is201],
  },
  businessSystemsAnalyst: {
    id: 'businessSystemsAnalyst',
    name: 'Business / Systems Analyst',
    tagline: 'A business-oriented path connecting systems and organizational needs.',
    description: 'BYU identifies Systems Analyst, IT Business Analyst, and Systems Designer as business-oriented Information Systems careers. It is presented as a general BSIS outcome rather than a dedicated MISM track.',
    orientation: 'business',
    typicalWork: ['Systems Analyst', 'IT Business Analyst', 'Systems Designer'],
    skills: [], technologies: [],
    traits: { technical: 6, analytical: 8, people: 8, building: 5 },
    byuPreparation: ['BSIS Program Overview'],
    interviewTopics: ['Information systems', 'Business orientation'],
    sources: [atAGlance, programOverview],
  },
  dataAnalytics: {
    id: 'dataAnalytics',
    name: 'Data Analyst / Data Scientist',
    tagline: 'A technical path focused on business analytics and intelligence.',
    description: 'BYU lists Business Analytics as a technically oriented Information Systems career and offers a dedicated Business Analytics and Intelligence track in the MISM program.',
    orientation: 'technical',
    typicalWork: ['Business Analytics'],
    skills: ['Data visualization and analysis', 'Database querying for business insights'],
    technologies: [],
    traits: { technical: 7, analytical: 10, people: 5, building: 5 },
    byuPreparation: ['MISM Business Analytics and Intelligence track', 'IS 201: Introduction to Management Information Systems'],
    interviewTopics: ['Business analytics', 'Data visualization and analysis', 'Database querying'],
    sources: [atAGlance, 'https://marriott.byu.edu/infosys/mism/tracks/business-analytics-intelligence/', is201],
  },
  cybersecurity: {
    id: 'cybersecurity',
    name: 'Cybersecurity Analyst',
    tagline: 'A technical path centered on security and forensics.',
    description: 'BYU identifies Security Analyst as a technically oriented Information Systems career and offers a dedicated Security and Forensics track in the MISM program.',
    orientation: 'technical',
    typicalWork: ['Security Analyst'],
    skills: ['Data security fundamentals'], technologies: [],
    traits: { technical: 9, analytical: 9, people: 4, building: 5 },
    byuPreparation: ['MISM Security and Forensics track', 'IS 201: Introduction to Management Information Systems'],
    interviewTopics: ['Data security fundamentals', 'Security and forensics'],
    sources: [atAGlance, 'https://marriott.byu.edu/infosys/mism/tracks/security-forensics/', is201],
  },
  itProjectManager: {
    id: 'itProjectManager',
    name: 'IT Project Manager',
    tagline: 'A business-oriented path for project and program leadership.',
    description: 'BYU identifies Project Manager and Program Manager as business-oriented Information Systems careers. BYU does not currently list a dedicated MISM track for this path.',
    orientation: 'business',
    typicalWork: ['Project Manager', 'Program Manager'],
    skills: [], technologies: [],
    traits: { technical: 4, analytical: 6, people: 10, building: 5 },
    byuPreparation: ['BSIS Program Overview'],
    interviewTopics: ['Information systems', 'Business orientation'],
    sources: [atAGlance, programOverview],
  },
  uxProductManager: {
    id: 'uxProductManager',
    name: 'UX Designer / Product Manager',
    tagline: 'A business-oriented path into user experience and technical product work.',
    description: 'BYU identifies User Experience Designer as a business-oriented Information Systems career. The MISM program offers a dedicated Technical Product Design and Management track.',
    orientation: 'business',
    typicalWork: ['User Experience Designer'],
    skills: [], technologies: [],
    traits: { technical: 5, analytical: 7, people: 9, building: 8 },
    byuPreparation: ['MISM Technical Product Design and Management track'],
    interviewTopics: ['User experience', 'Technical product design and management'],
    sources: [atAGlance, 'https://marriott.byu.edu/infosys/mism/tracks/technical-product-design-and-management/'],
  },
  erpConsultant: {
    id: 'erpConsultant',
    name: 'ERP / Systems Consultant',
    tagline: 'An emerging systems-consulting destination requiring further BYU verification.',
    description: 'BYU does not currently list this path by name on its At a Glance chart or as a MISM track. The live Information Systems course catalog is the current official point of reference; specific ERP preparation should be confirmed with an IS advisor.',
    orientation: 'business',
    typicalWork: [], skills: [], technologies: [],
    traits: { technical: 6, analytical: 7, people: 9, building: 6 },
    byuPreparation: ['Information Systems course catalog'],
    interviewTopics: ['Information systems consulting'],
    sources: ['https://catalog.byu.edu/departments/1517/courses'],
  },
  cloudInfrastructure: {
    id: 'cloudInfrastructure',
    name: 'Cloud / Infrastructure Engineer',
    tagline: 'A technical path into cloud infrastructure and network administration.',
    description: 'BYU identifies Cloud Infrastructure and Network Administrator as technically oriented Information Systems careers. BYU does not currently list a dedicated MISM track for this path.',
    orientation: 'technical',
    typicalWork: ['Cloud Infrastructure', 'Network Administrator'],
    skills: [], technologies: [],
    traits: { technical: 9, analytical: 7, people: 4, building: 8 },
    byuPreparation: ['BSIS Program Overview'],
    interviewTopics: ['Cloud infrastructure', 'Network administration'],
    sources: [atAGlance, programOverview],
  },
};
