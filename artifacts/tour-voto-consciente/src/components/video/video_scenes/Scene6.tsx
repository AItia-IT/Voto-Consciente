import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';
import { Caption } from './Caption';
import mascotImg from "@assets/Screenshot_from_2026-05-30_11-12-36_1780151261109.webp";

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 7000),
      setTimeout(() => setPhase(4), 12000),
      setTimeout(() => setPhase(5), 15000),
      setTimeout(() => setPhase(6), 18500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary)] overflow-hidden"
      {...sceneTransitions.wipeRight}
    >
      {/* Celebratory confetti background */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-[var(--color-secondary)] rounded-sm"
            initial={{ 
              top: '-10%', 
              left: `${Math.random() * 100}%`,
              rotate: 0 
            }}
            animate={{ 
              top: '110%', 
              rotate: 360,
              left: `${Math.random() * 100}%` 
            }}
            transition={{ 
              duration: 3 + Math.random() * 4, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: 'linear' 
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex w-full h-full items-center justify-center px-[10vw]">
        {/* Mascot */}
        <motion.div
          className="w-[25vw] flex-shrink-0"
          initial={{ opacity: 0, x: -100 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ type: 'spring' }}
        >
          <motion.img 
            src={mascotImg} 
            alt="Mascote Sônia" 
            className="w-full object-contain drop-shadow-2xl"
            animate={{ y: phase >= 2 ? [0, -15, 0] : 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Final Lockup */}
        <div className="flex-1 flex flex-col items-center justify-center ml-[5vw]">
          <AnimatePresence mode="wait">
            {phase < 3 ? (
              <motion.div
                key="celebration"
                className="flex gap-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[10vw] h-[10vw]"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                  >
                    <img src={`${import.meta.env.BASE_URL}images/medal.png`} className="w-full h-full object-contain" />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="lockup"
                className="text-center bg-white/10 backdrop-blur-md p-[4vw] rounded-3xl border border-white/20"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.4 }}
              >
                <h1 className="text-[6vw] font-display font-bold text-white leading-none mb-4">
                  Voto<br/>Consciente
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent mb-6" />
                <p className="text-[2.5vw] font-bold text-[var(--color-accent)] uppercase tracking-widest">
                  Aprender. Refletir. Escolher.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Caption 
        text="Juntos somos cidadãos mais conscientes!" 
        isVisible={phase === 2} 
      />
      <Caption 
        text="Voto Consciente — Aprender. Refletir. Escolher." 
        isVisible={phase >= 4} 
      />
    </motion.div>
  );
}