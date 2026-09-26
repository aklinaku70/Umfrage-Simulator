// Ndihmës i thjeshtë për Web Speech API (SpeechSynthesis) — flet me zë gjermanisht
// për të simuluar përgjigjet e klientit gjatë thirrjes.

let cachedVoice = null;

function pickGermanVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  if (cachedVoice) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  cachedVoice =
    voices.find((v) => v.lang === "de-DE") ||
    voices.find((v) => v.lang?.startsWith("de")) ||
    null;
  return cachedVoice;
}

// Disa browser-a i ngarkojnë zërat në mënyrë asinkrone.
export function primeVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickGermanVoice();
  };
}

export function speak(text, { rate = 1, onEnd } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = rate;
  const voice = pickGermanVoice();
  if (voice) utterance.voice = voice;

  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
