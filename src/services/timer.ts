export function finishTimer(soundEnabled: boolean, vibrationEnabled: boolean) {
  if (vibrationEnabled && 'vibrate' in navigator) navigator.vibrate([90, 60, 90]);
  if (!soundEnabled) return;
  const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return;
  const audio = new AudioCtor();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.frequency.value = 620;
  gain.gain.value = 0.05;
  oscillator.start();
  oscillator.stop(audio.currentTime + 0.18);
}

let relaxationOscillator: OscillatorNode | null = null;
let relaxationGain: GainNode | null = null;
let relaxationContext: AudioContext | null = null;

export function setRelaxingSound(enabled: boolean) {
  if (!enabled) {
    relaxationOscillator?.stop();
    relaxationOscillator = null;
    relaxationGain = null;
    relaxationContext?.close().catch(() => undefined);
    relaxationContext = null;
    return;
  }
  if (relaxationOscillator) return;
  try {
    const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    relaxationContext = new AudioCtor();
    relaxationOscillator = relaxationContext.createOscillator();
    relaxationGain = relaxationContext.createGain();
    relaxationOscillator.type = 'sine';
    relaxationOscillator.frequency.value = 174;
    relaxationGain.gain.value = 0.025;
    relaxationOscillator.connect(relaxationGain);
    relaxationGain.connect(relaxationContext.destination);
    relaxationOscillator.start();
  } catch {
    relaxationOscillator = null;
  }
}

export function speakCue(text: string, enabled: boolean) {
  if (!enabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.92;
  utterance.volume = 0.85;
  window.speechSynthesis.speak(utterance);
}
