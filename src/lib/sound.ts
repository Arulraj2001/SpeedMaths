let globalMute = false;

export function toggleMute(): boolean {
  globalMute = !globalMute;
  return globalMute;
}

export function isMuted(): boolean {
  return globalMute;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  return new AudioCtx();
}

export function playCorrectSound() {
  if (globalMute) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // High-pitch arpeggio (C5 -> G5 -> C6)
  osc.type = "sine";
  osc.frequency.setValueAtTime(523.25, now);
  osc.frequency.setValueAtTime(783.99, now + 0.08);
  osc.frequency.setValueAtTime(1046.50, now + 0.16);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

  osc.start(now);
  osc.stop(now + 0.35);
}

export function playIncorrectSound() {
  if (globalMute) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // Low buzz sound (sawtooth, descending frequency)
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.linearRampToValueAtTime(90, now + 0.25);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

  osc.start(now);
  osc.stop(now + 0.25);
}

export function playTimeoutSound() {
  if (globalMute) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // Warning triangle beep
  osc.type = "triangle";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.setValueAtTime(0, now + 0.06);
  osc.frequency.setValueAtTime(880, now + 0.12);

  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

  osc.start(now);
  osc.stop(now + 0.22);
}
export function setMuteState(muted: boolean) {
  globalMute = muted;
}
