import { useEffect, useState } from 'react';

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const handleEnd = () => setSpeaking(false);
    window.speechSynthesis.addEventListener('voiceschanged', () => {});
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'pt-BR';
    utt.rate = 0.85;
    utt.pitch = 1;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const isSpeaking = () => speaking;

  return { speak, stop, isSpeaking };
}
