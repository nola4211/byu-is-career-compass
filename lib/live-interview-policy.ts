// Both frontend and token service require an explicit operator opt-in.
// Endpoint/credential presence alone never enables a billable session.
export const liveInterviewsEnabled = (value: unknown): boolean => value === 'true';

export function enabledTokenEndpoint(
  enabled: unknown,
  endpoint: string | undefined,
): string | undefined {
  return liveInterviewsEnabled(enabled) ? endpoint?.trim() || undefined : undefined;
}
