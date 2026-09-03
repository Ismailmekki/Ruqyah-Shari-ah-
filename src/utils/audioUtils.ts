// Pleasant Web Audio API sounds for counting and completion
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Gentle click sound for recitation counter
 */
export function playClickTone() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05); // A5 note

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Ignore audio context errors silently
  }
}

/**
 * Soothing gentle chime when completing required repetitions (e.g. 7/7 or 3/3)
 */
export function playCompleteChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.07, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.45);
    });
  } catch {
    // Ignore audio context errors silently
  }
}

/**
 * Pad numbers with leading zeros (e.g. 1 -> "001")
 */
export function padZeros(num: number, length: number = 3): string {
  return String(num).padStart(length, '0');
}

/**
 * Format Quran ayah audio URL
 */
export function getAyahAudioUrl(baseUrl: string, surah: number, ayah: number): string {
  const surahStr = padZeros(surah, 3);
  const ayahStr = padZeros(ayah, 3);
  return `${baseUrl}/${surahStr}${ayahStr}.mp3`;
}
