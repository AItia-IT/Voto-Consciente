import { useRef, useState } from 'react';

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const speak = async (text: string) => {
    stop();

    setSpeaking(true);
    try {
      const response = await fetch('/api/openai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('TTS request failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setSpeaking(false);
        cleanup();
      };
      audio.onerror = () => {
        setSpeaking(false);
        cleanup();
      };

      await audio.play();
    } catch {
      setSpeaking(false);
      cleanup();
    }
  };

  const cleanup = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    audioRef.current = null;
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    cleanup();
    setSpeaking(false);
  };

  const isSpeaking = () => speaking;

  return { speak, stop, isSpeaking };
}
