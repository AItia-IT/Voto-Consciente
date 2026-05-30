import { useState } from 'react';

// ── Global audio singleton — only one TTS plays at a time ─────────────────────
let _audio: HTMLAudioElement | null = null;
let _url: string | null = null;

function stopGlobal() {
  if (_audio) {
    _audio.pause();
    _audio.currentTime = 0;
    _audio = null;
  }
  if (_url) {
    URL.revokeObjectURL(_url);
    _url = null;
  }
}

// ── useTTS hook ───────────────────────────────────────────────────────────────
export function useTTS() {
  const [speaking, setSpeaking] = useState(false);

  const speak = async (text: string) => {
    stopGlobal();
    setSpeaking(true);
    try {
      const response = await fetch('/api/openai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('TTS failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      _url = url;

      const audio = new Audio(url);
      _audio = audio;

      audio.onended = () => {
        if (_audio === audio) { _audio = null; _url = null; }
        URL.revokeObjectURL(url);
        setSpeaking(false);
      };
      audio.onerror = () => {
        if (_audio === audio) _audio = null;
        setSpeaking(false);
      };

      await audio.play();
    } catch {
      setSpeaking(false);
    }
  };

  const stop = () => {
    stopGlobal();
    setSpeaking(false);
  };

  return { speak, stop, isSpeaking: () => speaking };
}
