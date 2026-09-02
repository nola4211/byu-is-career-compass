export type CareerId = 'dataAnalytics' | 'softwareEngineering' | 'cybersecurity' | 'technologyConsulting';

export type Career = {
  id: CareerId; name: string; shortName: string; tagline: string; overview: string;
  personality: string; responsibilities: string[]; skills: string[]; workStyle: string;
  commonTitles: string[]; byuPreparation: string[]; accent: string;
  behavioralQuestions: string[]; technicalQuestions: string[]; interviewTopics: string[];
};

export const CAREER_IDS: CareerId[] = ['dataAnalytics', 'softwareEngineering', 'cybersecurity', 'technologyConsulting'];

export const careers: Record<CareerId, Career> = {
  dataAnalytics: {
    id: 'dataAnalytics', name: 'Data & Analytics', shortName: 'Analytics', tagline: 'Turn evidence into better decisions.',
    overview: 'Data and analytics professionals translate messy information into useful stories, forecasts, and recommendations that organizations can act on.',
    personality: 'A strong fit for curious pattern-finders who enjoy structured investigation and explaining what the numbers mean to other people.',
    responsibilities: ['Clean, combine, and validate data from multiple sources', 'Build dashboards, reports, and repeatable analyses', 'Translate business questions into measurable hypotheses', 'Present findings and recommend next steps'],
    skills: ['SQL', 'Python', 'Excel', 'Tableau / Power BI', 'Statistics', 'Data storytelling'],
    workStyle: 'A mix of focused analysis and collaborative interpretation. You may spend a morning in SQL and an afternoon presenting insights to a product or operations team.',
    commonTitles: ['Data Analyst', 'BI Analyst', 'Analytics Consultant', 'Reporting Analyst'],
    byuPreparation: ['Build a portfolio project that begins with a real business question—not just a dashboard.', 'Practice explaining one SQL or analytics project to both technical and nontechnical listeners.', 'Use IS coursework and student organizations to gain experience with databases, visualization, and client-facing recommendations.'],
    accent: '#16b5a3',
    behavioralQuestions: ['Tell me about a time data changed your initial point of view.', 'Describe a time you had to explain a complex finding simply.', 'How do you handle a request when the available data is incomplete?'],
    technicalQuestions: ['How would you identify duplicate customers in a SQL table?', 'A conversion rate fell 12% this week. Walk through your investigation.', 'When would you choose a median instead of a mean?'],
    interviewTopics: ['SQL', 'Data interpretation', 'Statistics', 'Business cases'],
  },
  softwareEngineering: {
    id: 'softwareEngineering', name: 'Software Engineering', shortName: 'Engineering', tagline: 'Build systems people can rely on.',
    overview: 'Software engineers design, build, test, and improve the applications and systems that power modern organizations.',
    personality: 'A strong fit for persistent builders who like breaking large problems into smaller parts, learning technical systems, and refining how things work.',
    responsibilities: ['Turn product requirements into maintainable code', 'Debug failures and improve application reliability', 'Design APIs, databases, and system components', 'Review code and collaborate across a development team'],
    skills: ['JavaScript / TypeScript', 'Python or Java', 'Git', 'APIs', 'Databases', 'Testing'],
    workStyle: 'Long stretches of focused building are balanced by design discussions, code reviews, and pairing with teammates. Progress is iterative and feedback is frequent.',
    commonTitles: ['Software Engineer', 'Application Developer', 'Full-stack Developer', 'Systems Developer'],
    byuPreparation: ['Ship a small end-to-end application and be ready to discuss your architecture choices.', 'Practice debugging aloud; interviewers value your reasoning as much as the final answer.', 'Use team projects to demonstrate version control, testing, and communication—not only coding ability.'],
    accent: '#f0ad4e',
    behavioralQuestions: ['Tell me about a technical problem that took persistence to solve.', 'Describe a time feedback changed how you built something.', 'How have you handled disagreement about a technical approach?'],
    technicalQuestions: ['Walk through how you would debug an API that suddenly became slow.', 'What tradeoffs would you consider when designing a database schema?', 'Explain how you would test a function that handles user permissions.'],
    interviewTopics: ['Programming', 'Debugging', 'APIs', 'Databases'],
  },
  cybersecurity: {
    id: 'cybersecurity', name: 'Cybersecurity', shortName: 'Security', tagline: 'Find risk before it becomes impact.',
    overview: 'Cybersecurity professionals protect systems, information, and people by identifying threats, reducing risk, and responding when something goes wrong.',
    personality: 'A strong fit for careful investigators who stay calm under pressure, notice anomalies, and enjoy thinking about how systems can fail or be misused.',
    responsibilities: ['Monitor systems and investigate suspicious activity', 'Assess vulnerabilities and recommend controls', 'Respond to incidents and document what happened', 'Help teams build safer habits, systems, and processes'],
    skills: ['Networking', 'Linux', 'Identity & access', 'Risk analysis', 'Scripting', 'Incident response'],
    workStyle: 'Investigation-heavy work with structured procedures and occasional high-pressure incidents. Clear documentation and communication are essential.',
    commonTitles: ['Security Analyst', 'SOC Analyst', 'Risk Analyst', 'Security Consultant'],
    byuPreparation: ['Build a safe home lab or complete guided security exercises you can explain clearly.', 'Learn networking fundamentals and practice documenting a basic incident investigation.', 'Connect technical controls to business risk in class projects and case discussions.'],
    accent: '#f36f5a',
    behavioralQuestions: ['Tell me about a time you noticed a risk others had missed.', 'Describe how you remained effective during a high-pressure situation.', 'How would you persuade a busy team to adopt a safer process?'],
    technicalQuestions: ['What steps would you take after detecting a suspicious login?', 'Explain the difference between authentication and authorization.', 'How would you prioritize several newly reported vulnerabilities?'],
    interviewTopics: ['Networking', 'Incident response', 'Security concepts', 'Vulnerabilities'],
  },
  technologyConsulting: {
    id: 'technologyConsulting', name: 'Technology Consulting', shortName: 'Consulting', tagline: 'Connect people, process, and technology.',
    overview: 'Technology consultants help organizations understand complex problems, choose practical solutions, and guide change from recommendation through implementation.',
    personality: 'A strong fit for adaptable communicators who enjoy ambiguity, learn quickly, and can connect technical possibilities to business goals.',
    responsibilities: ['Interview stakeholders and clarify business needs', 'Analyze processes, systems, and solution options', 'Structure recommendations and present to decision-makers', 'Coordinate implementation across technical and business teams'],
    skills: ['Requirements gathering', 'Process mapping', 'Presentations', 'Project delivery', 'Data analysis', 'Facilitation'],
    workStyle: 'Highly collaborative and varied. Expect meetings, workshops, analysis, presentations, and frequent context switching across clients or projects.',
    commonTitles: ['Technology Consultant', 'Business Systems Analyst', 'Implementation Consultant', 'IT Advisory Associate'],
    byuPreparation: ['Practice case interviews and concise, recommendation-first communication.', 'Use team projects to gather requirements, manage ambiguity, and present to a real stakeholder.', 'Develop enough technical depth to evaluate tradeoffs while keeping the business outcome in view.'],
    accent: '#7f78d2',
    behavioralQuestions: ['Tell me about a time you brought clarity to an ambiguous problem.', 'Describe a difficult stakeholder interaction and what you learned.', 'How do you earn trust when entering a new team or organization?'],
    technicalQuestions: ['A client wants to replace a core system. How would you frame the decision?', 'How would you gather requirements from stakeholders who disagree?', 'Walk through how you would evaluate whether to build or buy software.'],
    interviewTopics: ['Business cases', 'Stakeholder communication', 'Requirements', 'Recommendations'],
  },
};

