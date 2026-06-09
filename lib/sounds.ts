export type SoundType = "tap" | "confirm" | "achievement" | "discover" | "celebrate";

function tone(ctx: AudioContext, freq: number, start: number, dur: number, vol = 0.12, type: OscillatorType = "sine") {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.connect(g);
  g.connect(ctx.destination);
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

function playSyntheticTone(type: SoundType): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx: AudioContext = new Ctx();
    if (ctx.state === "suspended") void ctx.resume();
    const t = ctx.currentTime;
    // tap: short subtle click on button press
    if (type === "tap")         { tone(ctx, 880, t, 0.08, 0.07); }
    // confirm: magical sparkle arpeggio — correct answer (triangle waves for bell/chime quality)
    if (type === "confirm")     { tone(ctx, 784, t, 0.10, 0.10, "triangle"); tone(ctx, 988, t + 0.09, 0.09, 0.11, "triangle"); tone(ctx, 1319, t + 0.17, 0.09, 0.12, "triangle"); tone(ctx, 1047, t + 0.24, 0.09, 0.10, "triangle"); tone(ctx, 1568, t + 0.30, 0.16, 0.09, "triangle"); }
    // achievement: confident ascending — logro especial
    if (type === "achievement") { tone(ctx, 523, t, 0.14, 0.12); tone(ctx, 659, t + 0.13, 0.14, 0.12); tone(ctx, 784, t + 0.26, 0.34, 0.14); }
    // discover: soft two-tone — hint unlocked
    if (type === "discover")    { tone(ctx, 440, t, 0.18, 0.10); tone(ctx, 554, t + 0.16, 0.24, 0.12); }
    // celebrate: C major fanfare + sparkle finish — tarea completada
    if (type === "celebrate")   { tone(ctx, 523, t, 0.12, 0.12); tone(ctx, 659, t + 0.10, 0.12, 0.12); tone(ctx, 784, t + 0.20, 0.12, 0.13); tone(ctx, 1047, t + 0.30, 0.20, 0.14, "triangle"); tone(ctx, 1319, t + 0.38, 0.10, 0.12, "triangle"); tone(ctx, 1568, t + 0.46, 0.14, 0.10, "triangle"); }
    setTimeout(() => void ctx.close(), 2000);
  } catch { /* audio API not available — silently ignored */ }
}

export function playSound(type: SoundType): void {
  if (typeof window === "undefined") return;
  try {
    const audio = new Audio(`/sounds/${type}.wav`);
    audio.volume = 0.25;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to synthetic tone on autoplay blocks
        playSyntheticTone(type);
      });
    }
  } catch {
    // Fallback to synthetic tone on any load/audio API issues
    playSyntheticTone(type);
  }
}
