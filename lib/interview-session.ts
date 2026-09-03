import { CAREER_IDS, careers, type CareerId } from '@/data/careers';

export const LIVEKIT_AGENT_NAME = 'career-interviewer';
export const INTERVIEW_MODES = ['behavioral', 'technical'] as const;

export type InterviewMode = (typeof INTERVIEW_MODES)[number];

export type InterviewMetadata = {
  career_id: CareerId;
  mode: InterviewMode;
  student_name: string;
  company_name: string;
  job_title: string;
};

type InterviewMetadataInput = {
  careerId: CareerId;
  mode: InterviewMode;
  studentName?: string;
  companyName?: string;
};

const isCareerId = (value: unknown): value is CareerId =>
  typeof value === 'string' && CAREER_IDS.includes(value as CareerId);

const isInterviewMode = (value: unknown): value is InterviewMode =>
  typeof value === 'string' && INTERVIEW_MODES.includes(value as InterviewMode);

const cleanSingleLine = (value: unknown, fallback: string, maxLength: number) => {
  if (typeof value !== 'string') return fallback;
  const cleaned = value.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned ? cleaned.slice(0, maxLength) : fallback;
};

export function createInterviewMetadata({
  careerId,
  mode,
  studentName,
  companyName,
}: InterviewMetadataInput): InterviewMetadata {
  return {
    career_id: careerId,
    mode,
    student_name: cleanSingleLine(studentName, 'Student', 60),
    company_name: cleanSingleLine(companyName, 'Practice Company', 80),
    job_title: careers[careerId].name,
  };
}

export function parseInterviewMetadata(value: unknown): InterviewMetadata | null {
  let candidate: unknown = value;

  if (typeof value === 'string') {
    try {
      candidate = JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (!candidate || typeof candidate !== 'object') return null;

  const metadata = candidate as Record<string, unknown>;
  if (!isCareerId(metadata.career_id) || !isInterviewMode(metadata.mode)) return null;

  return createInterviewMetadata({
    careerId: metadata.career_id,
    mode: metadata.mode,
    studentName: typeof metadata.student_name === 'string' ? metadata.student_name : undefined,
    companyName: typeof metadata.company_name === 'string' ? metadata.company_name : undefined,
  });
}
