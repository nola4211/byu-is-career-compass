'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Clock3, Keyboard, Lightbulb, MessageSquareText, Mic2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LiveInterview } from '@/components/interview/live-interview';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { CAREER_IDS, careerPresentation, careers, type CareerId } from '@/data/careers';
import type { InterviewMode } from '@/lib/interview-session';

export const dynamic = 'force-static';

type PracticeFormat = 'live' | 'written';
const BASE_PATH = import.meta.env.PROD ? '/byu-is-career-compass' : '';
const LIVE_INTERVIEW_CONFIGURED = Boolean(import.meta.env.VITE_LIVEKIT_TOKEN_ENDPOINT?.trim());

const behavioralQuestions = [
  'Tell me about a time you solved a difficult problem.',
  'Describe a time you worked through conflict on a team.',
  'Why are you interested in this career direction?',
];

function InterviewPractice() {
  const [careerId, setCareerId] = useState<CareerId>('dataAnalytics');
  const [mode, setMode] = useState<InterviewMode>('behavioral');
  const [format, setFormat] = useState<PracticeFormat>(
    LIVE_INTERVIEW_CONFIGURED ? 'live' : 'written',
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('career') as CareerId | null;
    if (!requested || !CAREER_IDS.includes(requested)) return;
    const timer = window.setTimeout(() => setCareerId(requested), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const career = careers[careerId];
  const careerQuestions = [
    `What interests you about ${career.name}, and how have you explored that interest?`,
    `Choose one topic—${career.interviewTopics.join(', ')}—and explain what you already know and what you want to learn next.`,
    `How has your BYU preparation helped you move toward ${career.name}?`,
  ];
  const questions = mode === 'behavioral' ? behavioralQuestions : careerQuestions;
  const question = questions[questionIndex % questions.length];

  const feedback = useMemo(() => {
    const words = response.trim().split(/\s+/).filter(Boolean).length;
    const hasStructure = /\b(first|then|because|result|outcome|learned|finally)\b/i.test(response);
    const hasSpecifics = /\d|\b(project|team|client|customer|class|internship|system)\b/i.test(response);
    return {
      words,
      notes: [
        words >= 55 ? 'Your answer has enough detail to feel substantial.' : 'Add one or two concrete details so the answer feels grounded.',
        hasStructure ? 'Your sequence is easy to follow.' : 'Give the answer a clearer beginning, action, and result.',
        hasSpecifics ? 'You used context that makes the example believable.' : 'Name the setting, your responsibility, and what changed.',
      ],
    };
  }, [response]);

  const next = () => {
    setQuestionIndex((value) => (value + 1) % questions.length);
    setResponse(''); setReviewed(false);
  };

  const changeCareer = (id: CareerId) => {
    setCareerId(id); setQuestionIndex(0); setResponse(''); setReviewed(false);
    const url = new URL(window.location.href);
    url.searchParams.set('career', id);
    window.history.replaceState(null, '', `${url.pathname}${url.search}`);
  };

  return (
    <main className="interview-shell" style={{ '--career-accent': careerPresentation[careerId].accent } as React.CSSProperties}>
      <header className="interview-topbar">
        <a href={`${BASE_PATH}/`} className="back-link"><ArrowLeft /> Career Compass</a>
        <div className="session-status"><span /> AI practice · audio starts only when you choose</div>
      </header>

      <div className="interview-layout">
        <aside className="practice-sidebar">
          <p className="overline">Practice route</p><h1>{career.name}</h1><p>{career.tagline}</p>
          <label htmlFor="career-select">Switch career</label>
          <select id="career-select" value={careerId} onChange={(event) => changeCareer(event.target.value as CareerId)}>
            {CAREER_IDS.map((id) => <option key={id} value={id}>{careers[id].name}</option>)}
          </select>
          <div className="topic-list"><p>Topics on this route</p>{career.interviewTopics.map((topic) => <span key={topic}><Check />{topic}</span>)}</div>
          <div className="tip-card"><Lightbulb /><div><strong>Think out loud</strong><p>Interviewers want to understand your reasoning, not just hear a polished conclusion.</p></div></div>
        </aside>

        <section className="practice-main">
          <div className="practice-head">
            <div><p className="overline">Guided interview practice</p><h2>{format === 'live' ? 'Practice the real conversation.' : 'Build a stronger answer, one pass at a time.'}</h2></div>
            <div className="mode-switch" aria-label="Question type">
              <button className={mode === 'behavioral' ? 'active' : ''} onClick={() => { setMode('behavioral'); setQuestionIndex(0); setResponse(''); setReviewed(false); }}>Behavioral</button>
              <button className={mode === 'technical' ? 'active' : ''} onClick={() => { setMode('technical'); setQuestionIndex(0); setResponse(''); setReviewed(false); }}>Career-specific</button>
            </div>
          </div>

          <div className="practice-format-switch" aria-label="Practice format">
            <button className={format === 'live' ? 'active' : ''} onClick={() => setFormat('live')}><Mic2 /> Live conversation<span>Speak with the AI interviewer</span></button>
            <button className={format === 'written' ? 'active' : ''} onClick={() => setFormat('written')}><Keyboard /> Written practice<span>Draft and self-review answers</span></button>
          </div>

          {format === 'live' ? (
            <LiveInterview key={`${careerId}-${mode}`} careerId={careerId} mode={mode} onUseWrittenPractice={() => setFormat('written')} />
          ) : (
            <>
              <div className="question-card">
                <div className="question-meta"><span><MessageSquareText /> Question {questionIndex + 1} of {questions.length}</span><span><Clock3 /> Aim for 1–2 minutes</span></div>
                <h3>{question}</h3>
                <Progress value={((questionIndex + 1) / questions.length) * 100} />
              </div>

              <div className="response-card">
                <label htmlFor="practice-response">Draft your answer</label>
                <p>Write talking points or a full response. Nothing leaves this page.</p>
                <Textarea id="practice-response" value={response} onChange={(event) => { setResponse(event.target.value); setReviewed(false); }} placeholder={mode === 'behavioral' ? 'Try: The situation was… My responsibility was… I decided to… The result was…' : 'Start with your assumptions, then explain your approach and tradeoffs…'} rows={8} />
                <div className="response-actions"><span>{response.trim() ? response.trim().split(/\s+/).length : 0} words</span><Button disabled={!response.trim()} onClick={() => setReviewed(true)}>Review my answer <ChevronRight /></Button></div>
              </div>

              {reviewed && (
                <div className="feedback-card" aria-live="polite">
                  <div className="feedback-heading"><span><Check /></span><div><p className="overline">Self-review</p><h3>A solid first pass. Make it more memorable.</h3></div></div>
                  <ul>{feedback.notes.map((note, index) => <li key={note}><span>0{index + 1}</span>{note}</li>)}</ul>
                  <div className="feedback-actions"><Button variant="outline" onClick={() => setReviewed(false)}><RefreshCw /> Revise this answer</Button><Button onClick={next}>Next question <ChevronRight /></Button></div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default InterviewPractice;
