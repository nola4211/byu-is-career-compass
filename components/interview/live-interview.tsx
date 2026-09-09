'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  RoomAudioRenderer,
  SessionProvider,
  VideoTrack,
  useAgent,
  useSession,
  useSessionContext,
  useSessionMessages,
  useTrackVolume,
} from '@livekit/components-react';
import { TokenSource } from 'livekit-client';
import { MessageSquareText, Mic, MicOff, PhoneOff, X } from 'lucide-react';
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
  disconnected: 'Ready',
  connecting: 'Connecting',
  'pre-connect-buffering': 'Connecting',
  initializing: 'Joining',
  idle: 'Ready',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
  failed: 'Try again',
} as const;

type AgentVisualState = keyof typeof agentStateLabel;

function WaterPresence({
  state,
  audioLevel,
}: {
  state: AgentVisualState;
  audioLevel: number;
}) {
  const baseEnergy =
    state === 'speaking'
      ? 0.3
      : state === 'listening'
        ? 0.14
        : state === 'thinking'
          ? 0.08
          : 0.03;
  const waterEnergy =
    state === 'speaking'
      ? Math.min(1, baseEnergy + audioLevel * 2.8)
      : baseEnergy;
  const flowSeconds =
    state === 'speaking'
      ? Math.max(0.75, 2.25 - waterEnergy * 1.4)
      : state === 'listening'
        ? 4.1
        : state === 'thinking'
          ? 3.1
          : 6.4;
  const waterStyle = {
    '--water-energy': waterEnergy,
    '--water-flow-speed': `${flowSeconds}s`,
    '--water-ripple-delay': `${flowSeconds / -2}s`,
    '--water-scale': 1 + waterEnergy * 0.1,
    '--water-back-opacity': 0.42 + waterEnergy * 0.2,
    '--water-mid-opacity': 0.62 + waterEnergy * 0.2,
    '--water-front-opacity': 0.74 + waterEnergy * 0.2,
    '--water-glint-opacity': 0.42 + waterEnergy * 0.5,
  } as CSSProperties;

  return (
    <div className="water-presence" style={waterStyle} aria-hidden="true">
      <span className="water-ripple water-ripple-one" />
      <span className="water-ripple water-ripple-two" />
      <div className="water-orb">
        <span className="water-flow water-flow-back" />
        <span className="water-flow water-flow-mid" />
        <span className="water-flow water-flow-front" />
        <span className="water-glint" />
      </div>
    </div>
  );
}

const friendlyError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('not configured') || message.includes('503')) {
    return 'The live interview service still needs its secure LiveKit credentials.';
  }
  if (
    message.toLowerCase().includes('permission') ||
    message.toLowerCase().includes('device')
  ) {
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
  const endSession = session.end;
  const agent = useAgent();
  const agentVolume = useTrackVolume(agent.microphoneTrack, {
    fftSize: 32,
    smoothingTimeConstant: 0.72,
  });
  const { messages } = useSessionMessages();
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => void endSession(), [endSession]);

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
      await endSession();
    } finally {
      setIsStarting(false);
    }
  };

  const endInterview = async () => {
    await endSession();
    setHasStarted(false);
    setIsMuted(false);
    setTranscriptOpen(false);
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
  const transcript = messages
    .filter((message) => message.message.trim())
    .slice(-8);

  return (
    <div
      className={`live-interview-card${hasStarted ? ' is-active' : ''}`}
      data-agent-state={agent.state}
    >
      <RoomAudioRenderer />
      {!hasStarted ? (
        <>
          <div className="live-stage">
            {agent.cameraTrack ? (
              <VideoTrack
                className="interview-avatar-video"
                trackRef={agent.cameraTrack}
              />
            ) : (
              <WaterPresence state={agent.state} audioLevel={agentVolume} />
            )}
            <div className="live-state" aria-live="polite">
              <span />
              <strong>{stateLabel}</strong>
            </div>
          </div>

          <div className="prejoin-panel">
            <div className="prejoin-heading">
              <div>
                <p className="overline">{careers[careerId].name}</p>
                <h3>Start your interview</h3>
              </div>
              <span>
                <Mic /> Microphone
              </span>
            </div>
            <div className="prejoin-fields">
              <label htmlFor="student-name">
                Your name
                <Input
                  id="student-name"
                  value={studentName}
                  maxLength={60}
                  onChange={(event) => setStudentName(event.target.value)}
                />
              </label>
              <label htmlFor="company-name">
                Company
                <Input
                  id="company-name"
                  value={companyName}
                  maxLength={80}
                  onChange={(event) => setCompanyName(event.target.value)}
                />
              </label>
            </div>
            <label
              className="privacy-confirmation"
              htmlFor="live-interview-consent"
            >
              <Checkbox
                id="live-interview-consent"
                checked={acknowledged}
                onCheckedChange={(value) => setAcknowledged(value === true)}
              />
              <span>
                <strong>AI practice session</strong> Audio and transcripts are
                processed by the configured providers. Avoid sensitive
                information.
              </span>
            </label>
            {error && (
              <p className="live-error" role="alert">
                {error}
              </p>
            )}
            <Button
              className="start-interview-button"
              size="lg"
              disabled={
                !acknowledged ||
                !studentName.trim() ||
                !companyName.trim() ||
                isStarting
              }
              onClick={startInterview}
            >
              <Mic /> {isStarting ? 'Starting…' : 'Start interview'}
            </Button>
          </div>
        </>
      ) : (
        <div className="active-voice-stage">
          {agent.cameraTrack ? (
            <VideoTrack
              className="interview-avatar-video"
              trackRef={agent.cameraTrack}
            />
          ) : (
            <WaterPresence state={agent.state} audioLevel={agentVolume} />
          )}
          <div className="active-state" aria-live="polite">
            <span />
            <strong>{stateLabel}</strong>
          </div>
          {agent.state === 'failed' && (
            <p className="live-error active-error" role="alert">
              {agent.failureReasons.join(' ') ||
                'The interviewer did not join in time.'}
            </p>
          )}
          {error && (
            <p className="live-error active-error" role="alert">
              {error}
            </p>
          )}
          <div className="live-controls">
            <Button
              className="transcript-toggle"
              variant="outline"
              onClick={() => setTranscriptOpen((open) => !open)}
              aria-expanded={transcriptOpen}
              aria-controls="live-transcript-panel"
            >
              <MessageSquareText /> Transcript
            </Button>
            <Button
              variant="outline"
              onClick={toggleMicrophone}
              disabled={!session.isConnected}
              aria-pressed={isMuted}
            >
              {isMuted ? <MicOff /> : <Mic />} {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            <Button className="end-interview-button" onClick={endInterview}>
              <PhoneOff /> End
            </Button>
          </div>

          {transcriptOpen && (
            <aside
              id="live-transcript-panel"
              className="transcript-drawer"
              aria-label="Live interview transcript"
            >
              <div className="transcript-heading">
                <strong>Transcript</strong>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTranscriptOpen(false)}
                  aria-label="Close transcript"
                >
                  <X />
                </Button>
              </div>
              <div className="live-transcript" aria-live="polite">
                {transcript.length ? (
                  transcript.map((message) => (
                    <div
                      key={message.id}
                      className={
                        message.type === 'agentTranscript'
                          ? 'agent-message'
                          : 'student-message'
                      }
                    >
                      <span>
                        {message.type === 'agentTranscript'
                          ? 'Interviewer'
                          : 'You'}
                      </span>
                      <p>{message.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="transcript-placeholder">
                    Conversation text will appear here.
                  </p>
                )}
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}

function ConfiguredLiveInterview({
  careerId,
  mode,
  tokenEndpoint,
}: Omit<LiveInterviewProps, 'onUseWrittenPractice'> & {
  tokenEndpoint: string;
}) {
  const [studentName, setStudentName] = useState('Student');
  const [companyName, setCompanyName] = useState('Practice Company');
  const [acknowledged, setAcknowledged] = useState(false);
  const tokenSource = useMemo(
    () => TokenSource.endpoint(tokenEndpoint),
    [tokenEndpoint],
  );
  const agentMetadata = useMemo(
    () =>
      JSON.stringify(
        createInterviewMetadata({ careerId, mode, studentName, companyName }),
      ),
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

export function LiveInterview({
  careerId,
  mode,
  onUseWrittenPractice,
}: LiveInterviewProps) {
  const tokenEndpoint = import.meta.env.VITE_LIVEKIT_TOKEN_ENDPOINT?.trim();

  if (!tokenEndpoint) {
    return (
      <div
        className="live-interview-card live-unavailable"
        data-agent-state="disconnected"
      >
        <div className="live-stage">
          <WaterPresence state="failed" audioLevel={0} />
          <div className="live-state">
            <span />
            <strong>Unavailable</strong>
          </div>
        </div>
        <div className="prejoin-panel unavailable-panel">
          <p className="overline">Live voice practice</p>
          <h3>The interviewer is almost connected.</h3>
          <p>
            The secure token service still needs its public endpoint added to
            the site build. Written practice is ready now.
          </p>
          <Button size="lg" onClick={onUseWrittenPractice}>
            Use written practice
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ConfiguredLiveInterview
      careerId={careerId}
      mode={mode}
      tokenEndpoint={tokenEndpoint}
    />
  );
}
