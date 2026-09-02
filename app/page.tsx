'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BarChart3, ChevronRight, Code2, Compass, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CAREER_IDS, careers, type CareerId } from '@/data/careers';
import { discoveryQuestions } from '@/data/questions';

const TARGET_ANSWERS = 5;
const QUESTION_SECONDS = 10;
type Pick = { questionId: string; answerIndex: number; reason: string };
type Stage = 'intro' | 'quiz' | 'result';

const iconFor = (id: CareerId, className = '') => {
  const props = { className, 'aria-hidden': true };
  if (id === 'dataAnalytics') return <BarChart3 {...props} />;
  if (id === 'softwareEngineering') return <Code2 {...props} />;
  if (id === 'cybersecurity') return <ShieldCheck {...props} />;
  return <Compass {...props} />;
};

export default function Home() {
  const [stage, setStage] = useState<Stage>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [seconds, setSeconds] = useState(QUESTION_SECONDS);
  const [scores, setScores] = useState<Record<CareerId, number>>(() => Object.fromEntries(CAREER_IDS.map((id) => [id, 0])) as Record<CareerId, number>);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerId>('dataAnalytics');
  const [skipped, setSkipped] = useState(0);

  const ranking = useMemo(() => [...CAREER_IDS].sort((a, b) => scores[b] - scores[a]), [scores]);

  const advanceWithoutScore = () => {
    setSkipped((value) => value + 1);
    setQuestionIndex((value) => (value + 1) % discoveryQuestions.length);
    setSeconds(QUESTION_SECONDS);
  };

  useEffect(() => {
    if (stage !== 'quiz') return;
    if (seconds <= 0) {
      advanceWithoutScore();
      return;
    }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, stage]);

  useEffect(() => {
    type CareerToolInput = { careerId: CareerId };
    type ModelContext = { registerTool: (tool: object, options?: { signal?: AbortSignal }) => void | Promise<void> };
    const modelContext = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(modelContext.registerTool({
      name: 'open_career_exploration',
      title: 'Open career exploration',
      description: 'Open one of the four supported Information Systems career paths in the visible career explorer.',
      inputSchema: {
        type: 'object',
        properties: { careerId: { type: 'string', enum: CAREER_IDS } },
        required: ['careerId'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: CareerToolInput) {
        if (!input || !CAREER_IDS.includes(input.careerId)) throw new Error('Choose a supported careerId.');
        setSelectedCareer(input.careerId);
        window.requestAnimationFrame(() => document.getElementById('careers')?.scrollIntoView({ behavior: 'smooth' }));
        return { careerId: input.careerId, careerName: careers[input.careerId].name, view: 'career-exploration' };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  const start = () => {
    setStage('quiz'); setQuestionIndex(0); setAnswered(0); setSkipped(0);
    setSeconds(QUESTION_SECONDS); setPicks([]);
    setScores(Object.fromEntries(CAREER_IDS.map((id) => [id, 0])) as Record<CareerId, number>);
  };

  const choose = (answerIndex: number) => {
    const question = discoveryQuestions[questionIndex];
    const answer = question.answers[answerIndex];
    const nextScores = { ...scores };
    CAREER_IDS.forEach((id) => (nextScores[id] += answer.weights[id] ?? 0));
    const nextPicks = [...picks, { questionId: question.id, answerIndex, reason: answer.reason }];
    const nextAnswered = answered + 1;
    if (nextAnswered >= TARGET_ANSWERS) {
      const ordered = [...CAREER_IDS].sort((a, b) => nextScores[b] - nextScores[a]);
      setScores(nextScores); setPicks(nextPicks); setSelectedCareer(ordered[0]); setStage('result');
      return;
    }
    setScores(nextScores); setPicks(nextPicks); setAnswered(nextAnswered);
    setQuestionIndex((value) => (value + 1) % discoveryQuestions.length);
    setSeconds(QUESTION_SECONDS);
  };

  const career = careers[selectedCareer];
  const currentQuestion = discoveryQuestions[questionIndex];
  const resultRanking = stage === 'result' ? [...CAREER_IDS].sort((a, b) => scores[b] - scores[a]) : ranking;
  const maxScore = Math.max(...resultRanking.map((id) => scores[id]), 1);

  return (
    <main className={`site-shell stage-${stage}`}>
      <header className="topbar">
        <button className="brand" onClick={start} aria-label="Start a new career journey">
          <span className="brand-mark">Y</span>
          <span><strong>IS Career Compass</strong><small>BYU Marriott School</small></span>
        </button>
        <nav aria-label="Primary navigation">
          <a href="#journey">Discover</a><a href="#careers">Explore careers</a><Link href="/interview">Interview prep</Link>
        </nav>
      </header>

      <section id="journey" className="river-stage" aria-label="Career discovery journey">
        <div className="sky-glow" /><div className="ridge ridge-far" /><div className="ridge ridge-near" />
        <div className="bank bank-left" /><div className="bank bank-right" />
        <div className="river"><span className="current current-one" /><span className="current current-two" /><span className="current current-three" /></div>
        <div className="waypoint waypoint-one" /><div className="waypoint waypoint-two" />
        <div className="boat" aria-hidden="true"><span className="boat-seat" /><span className="paddle" /></div>

        {stage === 'intro' && (
          <div className="intro-panel">
            <p className="overline"><Sparkles size={15} /> Your path starts here</p>
            <h1>Find where your<br />curiosity could lead.</h1>
            <p className="intro-copy">Five quick choices. Four Information Systems paths. One clearer direction before your next career conversation.</p>
            <Button size="lg" onClick={start} className="primary-cta">Begin the river journey <ChevronRight /></Button>
            <p className="time-note">About 2 minutes · no sign-in required</p>
          </div>
        )}

        {stage === 'quiz' && (
          <div className="quiz-panel" key={`${questionIndex}-${skipped}`}>
            <div className="quiz-meta"><span>Waypoint {answered + 1} of {TARGET_ANSWERS}</span><span>{seconds}s to choose</span></div>
            <Progress value={(seconds / QUESTION_SECONDS) * 100} aria-label={`${seconds} seconds remaining`} className="timer-progress" />
            <p className="overline">{currentQuestion.eyebrow}</p><h2>{currentQuestion.prompt}</h2>
            <div className="answer-grid">
              {currentQuestion.answers.map((answer, index) => (
                <button key={answer.label} onClick={() => choose(index)} className="answer-card">
                  <span className="answer-key">{String.fromCharCode(65 + index)}</span>
                  <span><strong>{answer.label}</strong><small>{answer.detail}</small></span><ChevronRight aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className="skip-note">If time runs out, this waypoint moves to the end. {skipped > 0 && `${skipped} skipped so far.`}</p>
          </div>
        )}

        {stage === 'result' && (
          <div className="arrival-card">
            <p className="overline"><Sparkles size={15} /> You&apos;ve reached a destination</p>
            <div className="result-title"><span className="career-icon" style={{ background: career.accent }}>{iconFor(selectedCareer)}</span><div><p>Your strongest match</p><h1>{career.name}</h1></div></div>
            <p className="result-tagline">{career.tagline}</p>
            <p className="why-match">You leaned toward work where {picks.slice(-3).map((pick) => pick.reason).join(', ')}.</p>
            <div className="result-actions">
              <Button asChild size="lg" className="primary-cta"><Link href={`/interview?career=${selectedCareer}`}>Practice for this path <ChevronRight /></Link></Button>
              <Button variant="outline" size="lg" onClick={start}><RotateCcw /> Retake</Button>
            </div>
          </div>
        )}
      </section>

      <section id="careers" className="career-section">
        <div className="section-heading">
          <div><p className="overline">Four routes into IS</p><h2>{stage === 'result' ? 'Explore your destination' : 'Every path blends business and technology.'}</h2></div>
          <p>{stage === 'result' ? 'Your result is a starting point, not a box. Compare the nearby paths and follow what energizes you.' : 'Discover how different strengths show up in the work—and where you may want to build experience next.'}</p>
        </div>

        {stage === 'result' && (
          <div className="score-strip" aria-label="Career match ranking">
            {resultRanking.map((id, index) => (
              <button key={id} onClick={() => setSelectedCareer(id)} className={selectedCareer === id ? 'active' : ''}>
                <span>{index + 1}</span><div><strong>{careers[id].shortName}</strong><i><b style={{ width: `${Math.max(12, (scores[id] / maxScore) * 100)}%`, background: careers[id].accent }} /></i></div>
              </button>
            ))}
          </div>
        )}

        <div className="career-layout">
          <div className="career-tabs" role="list" aria-label="Career paths">
            {CAREER_IDS.map((id) => (
              <button key={id} onClick={() => setSelectedCareer(id)} className={selectedCareer === id ? 'active' : ''} style={{ '--career-accent': careers[id].accent } as React.CSSProperties}>
                <span>{iconFor(id)}</span><div><strong>{careers[id].name}</strong><small>{careers[id].tagline}</small></div><ChevronRight />
              </button>
            ))}
          </div>
          <article className="career-detail" style={{ '--career-accent': career.accent } as React.CSSProperties}>
            <div className="detail-lead"><span className="career-icon" style={{ background: career.accent }}>{iconFor(selectedCareer)}</span><div><p className="overline">Career overview</p><h3>{career.name}</h3></div></div>
            <p className="overview">{career.overview}</p>
            <div className="detail-grid">
              <div><h4>What you&apos;ll do</h4><ul>{career.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h4>How you&apos;ll work</h4><p>{career.workStyle}</p><h4 className="spaced">Common first titles</h4><div className="tag-list">{career.commonTitles.map((item) => <span key={item}>{item}</span>)}</div></div>
            </div>
            <div className="skills-row"><h4>Skills to build</h4><div className="tag-list">{career.skills.map((item) => <span key={item}>{item}</span>)}</div></div>
            <div className="prep-box"><p className="overline">Prepare at BYU</p><ol>{career.byuPreparation.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></div>
            <Button asChild size="lg" className="detail-cta"><Link href={`/interview?career=${selectedCareer}`}>Open {career.shortName} interview practice <ChevronRight /></Link></Button>
          </article>
        </div>
      </section>

      <footer><span className="brand-mark">Y</span><p><strong>IS Career Compass</strong><br /><small>A student preparation tool for BYU Information Systems</small></p><a href="#journey">Back to the river ↑</a></footer>
    </main>
  );
}
