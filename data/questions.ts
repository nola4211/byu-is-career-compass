import type { CareerId } from './careers';

export type Answer = { label: string; detail: string; weights: Partial<Record<CareerId, number>>; reason: string };
export type DiscoveryQuestion = { id: string; eyebrow: string; prompt: string; answers: [Answer, Answer] };

export const discoveryQuestions: DiscoveryQuestion[] = [
  { id: 'build-or-explain', eyebrow: 'A new project lands on your desk', prompt: 'Which first move sounds more energizing?', answers: [
    { label: 'Build the first working version', detail: 'I want to make the system real.', weights: { softwareEngineering: 3, uxProductManager: 2, cloudInfrastructure: 2 }, reason: 'you prefer turning ideas into working systems' },
    { label: 'Frame the right problem', detail: 'I want to understand what success means.', weights: { businessSystemsAnalyst: 3, itProjectManager: 2, erpConsultant: 2 }, reason: 'you start by clarifying the problem and its outcome' },
  ] },
  { id: 'signal', eyebrow: 'Something unexpected appears', prompt: 'What are you most curious to investigate?', answers: [
    { label: 'A strange pattern in the numbers', detail: 'There is a story hiding in the data.', weights: { dataAnalytics: 3, businessSystemsAnalyst: 2 }, reason: 'you are drawn to patterns and evidence' },
    { label: 'A strange pattern in the network', detail: 'I want to know what caused it—and whether it is risky.', weights: { cybersecurity: 3, cloudInfrastructure: 2 }, reason: 'you notice anomalies and think about risk' },
  ] },
  { id: 'workday', eyebrow: 'Picture a satisfying afternoon', prompt: 'Where are you doing your best work?', answers: [
    { label: 'Deep in a technical challenge', detail: 'Focused, experimenting, and making progress.', weights: { softwareEngineering: 2, cybersecurity: 2, cloudInfrastructure: 2, dataAnalytics: 1 }, reason: 'you value focused technical problem-solving' },
    { label: 'At a whiteboard with a team', detail: 'Connecting perspectives and shaping a direction.', weights: { itProjectManager: 3, businessSystemsAnalyst: 2, erpConsultant: 2, uxProductManager: 2 }, reason: 'you gain energy from collaborative problem-framing' },
  ] },
  { id: 'proof', eyebrow: 'A leader asks, “Why this approach?”', prompt: 'Which evidence would you rather bring?', answers: [
    { label: 'A prototype that proves it works', detail: 'Let the working solution make the case.', weights: { softwareEngineering: 3, uxProductManager: 2, cloudInfrastructure: 1 }, reason: 'you like demonstrating ideas through functional solutions' },
    { label: 'An analysis that proves the value', detail: 'Connect the recommendation to measurable impact.', weights: { dataAnalytics: 3, businessSystemsAnalyst: 2, erpConsultant: 1 }, reason: 'you connect recommendations to evidence and impact' },
  ] },
  { id: 'pressure', eyebrow: 'The stakes suddenly rise', prompt: 'Which role would you naturally take?', answers: [
    { label: 'Trace the issue to its source', detail: 'Stay calm, inspect the system, contain the problem.', weights: { cybersecurity: 3, cloudInfrastructure: 2, softwareEngineering: 1 }, reason: 'you stay close to the system when pressure rises' },
    { label: 'Align people around the response', detail: 'Create clarity, assign next steps, communicate.', weights: { itProjectManager: 3, businessSystemsAnalyst: 2, erpConsultant: 2, uxProductManager: 1 }, reason: 'you create alignment when situations are ambiguous' },
  ] },
  { id: 'output', eyebrow: 'At the end of a great week', prompt: 'Which result feels most rewarding?', answers: [
    { label: 'A clean insight no one saw before', detail: 'The decision is clearer because I found the signal.', weights: { dataAnalytics: 3, businessSystemsAnalyst: 2, cybersecurity: 1 }, reason: 'you enjoy finding a useful signal others missed' },
    { label: 'A smooth experience people can use', detail: 'The solution is simpler, faster, and reliable.', weights: { uxProductManager: 3, softwareEngineering: 2, itProjectManager: 1 }, reason: 'you care about building reliable user experiences' },
  ] },
  { id: 'uncertainty', eyebrow: 'The path ahead is unclear', prompt: 'What kind of uncertainty would you rather untangle?', answers: [
    { label: 'Which option best fits the organization', detail: 'Balance needs, constraints, and tradeoffs.', weights: { erpConsultant: 3, businessSystemsAnalyst: 2, itProjectManager: 2 }, reason: 'you are comfortable balancing competing business needs' },
    { label: 'Where a system may be exposed', detail: 'Think ahead, test assumptions, reduce the risk.', weights: { cybersecurity: 3, cloudInfrastructure: 2, softwareEngineering: 1 }, reason: 'you instinctively look for exposure and failure modes' },
  ] },
];
