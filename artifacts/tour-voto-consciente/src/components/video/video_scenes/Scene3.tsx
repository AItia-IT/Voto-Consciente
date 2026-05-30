import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';
import { Caption } from './Caption';
import mascotImg from "@assets/Screenshot_from_2026-05-30_11-12-36_1780151261109.webp";

const missions = [
  "Cidadania 101",
  "História do Voto",
  "Eleições Municipais",
  "Combate à Desinformação",
  "O Papel do Vereador"
];

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 5000),
      setTimeout(() => setPhase(4), 10000),
      setTimeout(() => setPhase(5), 15000),
      setTimeout(() => setPhase(6), 18500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-bg-muted)] overflow-hidden"
      {...sceneTransitions.wipeLeft}
    >
      <div className="absolute inset-0 bg-white/40" />
      
      <div className="relative z-10 w-full h-full flex items-center px-[8vw]">
        {/* Mascot on left */}
        <motion.div
          className="w-[25vw] flex-shrink-0 relative"
          initial={{ opacity: 0, x: -50 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        >
          <motion.img 
            src={mascotImg} 
            alt="Mascote Sônia" 
            className="w-full object-contain drop-shadow-xl"
            animate={{ y: phase >= 2 ? [0, -15, 0] : 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Gamified Path */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.h2 
            className="text-[4vw] font-display font-bold text-[var(--color-primary)] mb-[4vw]"
            initial={{ opacity: 0, y: -20 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          >
            Academia da Democracia
          </motion.h2>

          <div className="flex gap-4 relative w-full justify-center">
            {/* Connecting line */}
            <motion.div 
              className="absolute top-1/2 left-[10%] right-[10%] h-3 bg-white/50 -translate-y-1/2 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 3 ? 1 : 0 }}
            >
              <motion.div 
                className="h-full bg-[var(--color-secondary)]"
                initial={{ width: 0 }}
                animate={{ width: phase >= 4 ? '100%' : '0%' }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </motion.div>

            {missions.map((mission, i) => (
              <motion.div
                key={i}
                className="relative z-10 bg-white border-[3px] border-[var(--color-secondary)] rounded-full w-[12vw] h-[12vw] flex flex-col items-center justify-center shadow-lg p-2 text-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ delay: 0.2 * i, type: "spring" }}
              >
                <span className="text-[var(--color-primary)] font-bold text-[1.2vw] leading-tight">{mission}</span>
                
                {/* Celebration stars */}
                <AnimatePresence>
                  {phase >= 4 && (
                    <motion.div
                      className="absolute -top-4 -right-4 w-10 h-10"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + (i * 0.2), type: "spring" }}
                    >
                      <img src={`${import.meta.env.BASE_URL}images/medal.png`} className="w-full h-full object-contain" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Caption 
        text="A Academia da Democracia te espera!" 
        isVisible={phase === 2 || phase === 3} 
      />
      <Caption 
        text="5 missões, XP e medalhas para conquistar!" 
        isVisible={phase === 4} 
      />
    </motion.div>
  );
}