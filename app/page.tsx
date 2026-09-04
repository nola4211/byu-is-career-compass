'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart3, BriefcaseBusiness, ChevronRight, CloudCog, Code2, Compass, LayoutTemplate, Network, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CAREER_IDS, careerPresentation, careers, programProfile, type CareerId } from '@/data/careers';
import { discoveryQuestions } from '@/data/questions';

export const dynamic = 'force-static';

const TARGET_ANSWERS = 5;
const QUESTION_SECONDS = 10;
const BASE_PATH = import.meta.env.PROD ? '/byu-is-career-compass' : '';
type Pick = { questionId: string; answerIndex: number; reason: string };
type Stage = 'intro' | 'quiz' | 'result';

const iconFor = (id: CareerId, className = '') => {
  const props = { className, 'aria-hidden': true };
  if (id === 'dataAnalytics') return <BarChart3 {...props} />;
  if (id === 'softwareEngineering') return <Code2 {...props} />;
  if (id === 'cybersecurity') return <ShieldCheck {...props} />;
  if (id === 'businessSystemsAnalyst') return <Network {...props} />;
  if (id === 'itProjectManager') return <BriefcaseBusiness {...props} />;
  if (id === 'uxProductManager') return <LayoutTemplate {...props} />;
  if (id === 'cloudInfrastructure') return <CloudCog {...props} />;
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
    const timer = window.setTimeout(() => {
      if (seconds <= 0) advanceWithoutScore();
      else setSeconds((value) => value - 1);
    }, seconds <= 0 ? 0 : 1000);
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
      description: 'Open one of the eight supported Information Systems career paths in the visible career explorer.',
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
  const journeyProgress = stage === 'result' ? 1 : answered / TARGET_ANSWERS;
  const journeyStyle = {
    '--journey-progress': journeyProgress,
    '--sky-scale': 1 + journeyProgress * 0.18,
    '--sky-opacity': 0.72 + journeyProgress * 0.28,
    '--sun-shift': `${journeyProgress * 18}px`,
    '--ridge-distant-y': `${journeyProgress * 9}px`,
    '--ridge-distant-scale': 1 + journeyProgress * 0.02,
    '--ridge-far-y': `${journeyProgress * 20}px`,
    '--ridge-far-scale': 1 + journeyProgress * 0.045,
    '--ridge-near-y': `${journeyProgress * 42}px`,
    '--ridge-near-scale': 1 + journeyProgress * 0.08,
    '--destination-opacity': journeyProgress,
    '--destination-scale': 0.65 + journeyProgress * 0.35,
    '--bank-shift': `${journeyProgress * 24}px`,
    '--bank-left-shift': `${journeyProgress * -24}px`,
    '--bank-scale': 1 + journeyProgress * 0.06,
    '--river-width': `${53 + journeyProgress * 5}%`,
    '--river-mouth-left': `${43 - journeyProgress * 7}%`,
    '--river-mouth-right': `${57 + journeyProgress * 7}%`,
    '--river-glow-scale': 1 + journeyProgress * 1.1,
    '--boat-bottom': `${6 + journeyProgress * 5}%`,
    '--boat-scale': 1 - journeyProgress * 0.09,
  } as React.CSSProperties;

  return (
    <main className={`site-shell stage-${stage}`}>
      <header className="topbar">
        <button className="brand" onClick={start} aria-label="Start a new career journey">
          <span className="brand-mark">Y</span>
          <span><strong>IS Career Compass</strong><small>BYU Marriott School</small></span>
        </button>
        <nav aria-label="Primary navigation">
          <a href="#journey">Discover</a><a href="#careers">Explore careers</a><a href={`${BASE_PATH}/interview`}>Interview prep</a>
        </nav>
      </header>

      <section
        id="journey"
        className="river-stage"
        data-stage={stage}
        data-waypoint={answered}
        style={journeyStyle}
        aria-label="Career discovery journey"
      >
        <div className="scenic-world" aria-hidden="true">
          <div className="sky-glow" /><div className="sun-disc" />
          <div className="cloud cloud-one" /><div className="cloud cloud-two" />
          <div className="ridge ridge-distant" /><div className="ridge ridge-far" /><div className="ridge ridge-near" />
          <div className="mist mist-one" /><div className="mist mist-two" />
          <div className="destination-light"><span /><span /><span /></div>
          <div className="bank bank-left"><span className="pine pine-one" /><span className="pine pine-two" /><span className="rock rock-one" /></div>
          <div className="bank bank-right"><span className="pine pine-three" /><span className="pine pine-four" /><span className="rock rock-two" /></div>
          <div className="river">
            <span className="river-glow" />
            <span className="current current-one" /><span className="current current-two" /><span className="current current-three" />
            <span className="current current-four" /><span className="current current-five" />
            <span className="wake wake-left" /><span className="wake wake-right" /><span className="wake wake-center" />
          </div>
          <div className="waypoint waypoint-one" /><div className="waypoint waypoint-two" />
          <div className="boat-track">
            <div className="boat">
              <span className="boat-rim" /><span className="boat-interior" /><span className="boat-seat boat-seat-front" /><span className="boat-seat boat-seat-back" />
              <span className="paddle"><i /></span>
            </div>
          </div>
        </div>

        {stage === 'intro' && (
          <div className="intro-panel">
            <p className="overline"><Sparkles size={15} /> Your path starts here</p>
            <h1>Find where your<br />curiosity could lead.</h1>
            <p className="intro-copy">Five quick choices. Eight Information Systems paths. One clearer direction before your next career conversation.</p>
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
            <div className="result-title"><span className="career-icon" style={{ background: careerPresentation[selectedCareer].accent }}>{iconFor(selectedCareer)}</span><div><p>Your strongest match</p><h1>{career.name}</h1></div></div>
            <p className="result-tagline">{career.tagline}</p>
            <p className="why-match">You leaned toward work where {picks.slice(-3).map((pick) => pick.reason).join(', ')}.</p>
            <div className="result-actions">
              <a href={`${BASE_PATH}/interview?career=${selectedCareer}`} className={buttonVariants({ size: 'lg', className: 'primary-cta' })}>Practice for this path <ChevronRight /></a>
              <Button variant="outline" size="lg" onClick={start} className="retake-button"><RotateCcw /> Retake</Button>
            </div>
          </div>
        )}
      </section>

      <section id="careers" className="career-section">
        <div className="section-heading">
          <div><p className="overline">Eight BYU-connected destinations</p><h2>{stage === 'result' ? 'Explore your destination' : 'Every path blends business and technology.'}</h2></div>
          <p>{stage === 'result' ? 'Your result is a starting point, not a box. Compare the nearby paths and follow what energizes you.' : 'Discover how different strengths show up in the work—and where you may want to build experience next.'}</p>
        </div>

        {stage === 'result' && (
          <div className="score-strip" aria-label="Career match ranking">
            {resultRanking.map((id, index) => (
              <button key={id} onClick={() => setSelectedCareer(id)} className={selectedCareer === id ? 'active' : ''}>
                <span>{index + 1}</span><div><strong>{careerPresentation[id].shortName}</strong><i><b style={{ width: `${Math.max(12, (scores[id] / maxScore) * 100)}%`, background: careerPresentation[id].accent }} /></i></div>
              </button>
            ))}
          </div>
        )}

        <div className="career-layout">
          <nav className="career-tabs" aria-label="Career paths">
            {CAREER_IDS.map((id) => (
              <button key={id} onClick={() => setSelectedCareer(id)} className={selectedCareer === id ? 'active' : ''} style={{ '--career-accent': careerPresentation[id].accent } as React.CSSProperties}>
                <span>{iconFor(id)}</span><div><strong>{careers[id].name}</strong><small>{careers[id].tagline}</small></div><ChevronRight />
              </button>
            ))}
          </nav>
          <article className="career-detail" style={{ '--career-accent': careerPresentation[selectedCareer].accent } as React.CSSProperties}>
            <div className="detail-lead"><span className="career-icon" style={{ background: careerPresentation[selectedCareer].accent }}>{iconFor(selectedCareer)}</span><div><p className="overline">BYU career destination · {career.orientation} orientation</p><h3>{career.name}</h3></div></div>
            <p className="overview">{career.description}</p>
            <div className="detail-grid">
              <div><h4>BYU-listed roles or areas</h4>{career.typicalWork.length ? <ul>{career.typicalWork.map((item) => <li key={item}>{item}</li>)}</ul> : <p>This destination needs additional BYU verification before role details are added.</p>}</div>
              <div><h4>Verified skill foundations</h4>{career.skills.length ? <div className="tag-list">{career.skills.map((item) => <span key={item}>{item}</span>)}</div> : <p>No path-specific skill list is confirmed in the current BYU source set.</p>}<h4 className="spaced">Program orientation</h4><div className="tag-list"><span>{career.orientation === 'technical' ? 'Technical orientation' : 'Business orientation'}</span></div></div>
            </div>
            <div className="prep-box"><p className="overline">Prepare at BYU</p><ol>{career.byuPreparation.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></div>
            <div className="source-row"><span>Verified source{career.sources.length > 1 ? 's' : ''}</span>{career.sources.map((source, index) => <a key={source} href={source} target="_blank" rel="noreferrer">BYU source {index + 1}</a>)}</div>
            <a href={`${BASE_PATH}/interview?career=${selectedCareer}`} className={buttonVariants({ size: 'lg', className: 'detail-cta' })}>Open {careerPresentation[selectedCareer].shortName} interview practice <ChevronRight /></a>
          </article>
        </div>
        <div className="program-profile"><div><p className="overline">2025 BSIS placement profile</p><strong>{programProfile.placementWithinThreeMonths}%</strong><span>placed within three months</span></div><div><strong>${programProfile.medianSalary.toLocaleString()}</strong><span>median salary · program-wide</span></div><div><strong>{programProfile.graduates}</strong><span>BSIS graduates</span></div><a href={programProfile.source} target="_blank" rel="noreferrer">View BYU placement source <ChevronRight /></a></div>
      </section>

      <footer><span className="brand-mark">Y</span><p><strong>IS Career Compass</strong><br /><small>A student preparation tool for BYU Information Systems</small></p><a href="#journey">Back to the river ↑</a></footer>
    </main>
  );
}
