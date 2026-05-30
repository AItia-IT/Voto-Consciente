// Video Template - Voto Consciente
import { AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

// Em ms, cada cena ~20s — total ~120s (~2 minutos)
const SCENE_DURATIONS = {
  boasVindas: 20000,
  fakeOuFato: 20000,
  academia: 20000,
  match: 20000,
  seguranca: 20000,
  celebracao: 20000,
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
  });

  return (
    <div
      className="w-full h-screen overflow-hidden relative bg-[var(--color-bg-light)]"
    >
      {/* mode="popLayout" = new snaps in while old animates out */}
      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene1 key="boasVindas" />}
        {currentScene === 1 && <Scene2 key="fakeOuFato" />}
        {currentScene === 2 && <Scene3 key="academia" />}
        {currentScene === 3 && <Scene4 key="match" />}
        {currentScene === 4 && <Scene5 key="seguranca" />}
        {currentScene === 5 && <Scene6 key="celebracao" />}
      </AnimatePresence>
    </div>
  );
}