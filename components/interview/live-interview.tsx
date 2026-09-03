'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  RoomAudioRenderer,
  SessionProvider,
  VideoTrack,
  useAgent,
  useSession,
  useSessionContext,
  useSessionMessages,
} from '@livekit/components-react';
import { TokenSource } from 'livekit-client';
import { Mic, MicOff, PhoneOff, ShieldCheck, Sparkles, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { careers, type CareerId } from '@/data/careers';
import {
  LIVEKIT_AGENT_NAME,
  createInterviewMetadata,
  type InterviewMode,
} from '@/lib/interview-session';

type LiveInterviewProps = {
  careerId: CareerId;
  mode: InterviewMode;
  onUseWrittenPractice: () => void;
};

const agentStateLabel = {
  disconnected: 'Ready to start',
  connecting: 'Connecting securely',
  'pre-connect-buffering': 'Preparing your microphone',
  initializing: 'Interviewer is joining',
  idle: 'Interviewer is ready',
  listening: 'Listening to you',
  thinking: 'Considering your answer',
  speaking: 'Interviewer is speaking',
  failed: 'Unable to connect',
} as const;

const friendlyError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('not configured') || message.includes('503')) {
    return 'The live interview service still needs its secure LiveKit credentials.';
  }
  if (message.toLowerCase().includes('permission') || message.toLowerCase().includes('device')) {
    return 'Microphone access was not available. Check your browser permission and try again.';
  }
  return 'The live interview could not start. Please try again or use written practice.';
};

function LiveInterviewStage({
  careerId,
  studentName,
  setStudentName,
  companyName,
  setCompanyName,
  acknowledged,
  setAcknowledged,
}: {
  careerId: CareerId;
  studentName: string;
  setStudentName: (value: string) => void;
  companyName: string;
  setCompanyName: (value: string) => void;
  acknowledged: boolean;
  setAcknowledged: (value: boolean) => void;
}) {
  const session = useSessionContext();
  const agent = useAgent();
  const { messages } = useSessionMessages();
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => void session.end(), [session]);

  const startInterview = async () => {
    setError(null);
    setIsStarting(true);
    setHasStarted(true);
    try {
      await session.start({ tracks: { microphone: { enabled: true } } });
      setIsMuted(false);
    } catch (startError) {
      setHasStarted(false);
      setError(friendlyError(startError));
      await session.end();
    } finally {
      setIsStarting(false);
    }
  };

  const endInterview = async () => {
    await session.end();
    setHasStarted(false);
    setIsMuted(false);
  };

  const toggleMicrophone = async () => {
    try {
      const shouldEnable = isMuted;
      await session.room.localParticipant.setMicrophoneEnabled(shouldEnable);
      setIsMuted(!shouldEnable);
      setError(null);
    } catch (deviceError) {
      setError(friendlyError(deviceError));
    }
  };

  const stateLabel = agentStateLabel[agent.state];
  const transcript = messages.filter((message) => message.message.trim()).slice(-8);

  return (
    <div className="live-interview-card" data-agent-state={agent.state}>
      <RoomAudioRenderer />
      <div className="live-stage">
        {agent.cameraTrack ? (
          <VideoTrack className="interview-avatar-video" trackRef={agent.cameraTrack} />
        ) : (
          <div className="interviewer-presence" aria-hidden="true">
            <span className="presence-ring" />
            <span className="presence-core"><Sparkles /></span>
            <div className="voice-bars">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div>
          </div>
        )}
        <div className="live-state" aria-live="polite">
          <span />
          <div><small>AI interviewer</small><strong>{stateLabel}</strong></div>
        </div>
        {!agent.cameraTrack && <p className="avatar-ready"><Video /> Avatar-ready video will appear here when enabled.</p>}
      </div>

      {!hasStarted ? (
        <div className="prejoin-panel">
          <div className="prejoin-heading">
            <div><p className="overline">Live voice practice</p><h3>Meet your AI interviewer.</h3></div>
            <span><Mic /> Uses your microphone</span>
          </div>
          <p className="prejoin-copy">The interviewer will use your selected {careers[careerId].name} path and practice company to tailor the conversation.</p>
          <div className="prejoin-fields">
            <label htmlFor="student-name">What should the interviewer call you?<Input id="student-name" value={studentName} maxLength={60} onChange={(event) => setStudentName(event.target.value)} /></label>
            <label htmlFor="company-name">Practice company<Input id="company-name" value={companyName} maxLength={80} onChange={(event) => setCompanyName(event.target.value)} /></label>
          </div>
          <label className="privacy-confirmation" htmlFor="live-interview-consent">
            <Checkbox id="live-interview-consent" checked={acknowledged} onCheckedChange={(value) => setAcknowledged(value === true)} />
            <span><strong>I understand this is an AI practice session.</strong> Live audio and generated transcripts are processed by LiveKit and the configured AI providers. Do not share sensitive information.</span>
          </label>
          {error && <p className="live-error" role="alert">{error}</p>}
          <Button className="start-interview-button" size="lg" disabled={!acknowledged || !studentName.trim() || !companyName.trim() || isStarting} onClick={startInterview}>
            <Mic /> {isStarting ? 'Starting interview…' : 'Start live interview'}
          </Button>
        </div>
      ) : (
        <div className="active-session-panel">
          <div className="session-trust"><ShieldCheck /><span><strong>Practice session</strong> End the conversation any time. Avoid personal or confidential information.</span></div>
          <div className="live-transcript" aria-label="Live interview transcript" aria-live="polite">
            {transcript.length ? transcript.map((message) => (
              <div key={message.id} className={message.type === 'agentTranscript' ? 'agent-message' : 'student-message'}>
                <span>{message.type === 'agentTranscript' ? 'Interviewer' : 'You'}</span>
                <p>{message.message}</p>
              </div>
            )) : <p className="transcript-placeholder">Your live transcript will appear here after the conversation begins.</p>}
          </div>
          {agent.state === 'failed' && <p className="live-error" role="alert">{agent.failureReasons.join(' ') || 'The interviewer did not join in time.'}</p>}
          {error && <p className="live-error" role="alert">{error}</p>}
          <div className="live-controls">
            <Button variant="outline" onClick={toggleMicrophone} disabled={!session.isConnected} aria-pressed={isMuted}>
              {isMuted ? <MicOff /> : <Mic />} {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            <Button className="end-interview-button" onClick={endInterview}><PhoneOff /> End interview</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfiguredLiveInterview({
  careerId,
  mode,
  tokenEndpoint,
}: Omit<LiveInterviewProps, 'onUseWrittenPractice'> & { tokenEndpoint: string }) {
  const [studentName, setStudentName] = useState('Student');
  const [companyName, setCompanyName] = useState('Practice Company');
  const [acknowledged, setAcknowledged] = useState(false);
  const tokenSource = useMemo(() => TokenSource.endpoint(tokenEndpoint), [tokenEndpoint]);
  const agentMetadata = useMemo(
    () => JSON.stringify(createInterviewMetadata({ careerId, mode, studentName, companyName })),
    [careerId, mode, studentName, companyName],
  );
  const session = useSession(tokenSource, {
    agentName: LIVEKIT_AGENT_NAME,
    agentMetadata,
    participantName: studentName.trim() || 'Student',
    agentConnectTimeoutMilliseconds: 25_000,
  });

  return (
    <SessionProvider session={session}>
      <LiveInterviewStage
        careerId={careerId}
        studentName={studentName}
        setStudentName={setStudentName}
        companyName={companyName}
        setCompanyName={setCompanyName}
        acknowledged={acknowledged}
        setAcknowledged={setAcknowledged}
      />
    </SessionProvider>
  );
}

export function LiveInterview({ careerId, mode, onUseWrittenPractice }: LiveInterviewProps) {
  const tokenEndpoint = import.meta.env.VITE_LIVEKIT_TOKEN_ENDPOINT?.trim();

  if (!tokenEndpoint) {
    return (
      <div className="live-interview-card live-unavailable" data-agent-state="disconnected">
        <div className="live-stage">
          <div className="interviewer-presence" aria-hidden="true">
            <span className="presence-ring" />
            <span className="presence-core"><Sparkles /></span>
          </div>
          <div className="live-state"><span /><div><small>AI interviewer</small><strong>Connection setup pending</strong></div></div>
        </div>
        <div className="prejoin-panel unavailable-panel">
          <p className="overline">Live voice practice</p>
          <h3>The interviewer is almost connected.</h3>
          <p>The secure token service still needs its public endpoint added to the site build. Written practice is ready now.</p>
          <Button size="lg" onClick={onUseWrittenPractice}>Use written practice</Button>
        </div>
      </div>
    );
  }

  return <ConfiguredLiveInterview careerId={careerId} mode={mode} tokenEndpoint={tokenEndpoint} />;
}
