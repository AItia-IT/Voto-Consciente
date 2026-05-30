import { useEffect, useRef, useState } from 'react';

function getBestPtBRVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const ptBR = voices.filter(v => v.lang === 'pt-BR' || v.lang === 'pt_BR');
  if (ptBR.length === 0) return null;
  const priority = [
    (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('google') && v.name.toLowerCase().includes('brasil'),
    (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('google'),
    (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('feminina'),
    () => true,
  ];
  for (const test of priority) {
    const match = ptBR.find(test);
    if (match) return match;
  }
  return ptBR[0];
}

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    const handleVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'pt-BR';
    utt.rate = 0.82;
    utt.pitch = 1;
    const voice = getBestPtBRVoice();
    if (voice) utt.voice = voice;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    utteranceRef.current = utt;
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
  };

  const isSpeaking = () => speaking;

  return { speak, stop, isSpeaking };
}
