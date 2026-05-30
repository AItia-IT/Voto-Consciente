import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';
import { Caption } from './Caption';
import mascotImg from "@assets/Screenshot_from_2026-05-30_11-12-36_1780151261109.webp";

const topics = [
  { text: "Saúde?", color: "bg-rose-100 text-rose-600 border-rose-200" },
  { text: "Educação?", color: "bg-blue-100 text-blue-600 border-blue-200" },
  { text: "Segurança?", color: "bg-emerald-100 text-emerald-600 border-emerald-200" },
  { text: "Transporte?", color: "bg-amber-100 text-amber-600 border-amber-200" }
];

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 6000),
      setTimeout(() => setPhase(4), 11000),
      setTimeout(() => setPhase(5), 15000),
      setTimeout(() => setPhase(6), 18500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-light)] overflow-hidden"
      {...sceneTransitions.perspectiveFlip}
    >
      <div className="relative z-10 flex w-full h-full items-center px-[8vw]">
        <div className="flex-1 flex flex-col items-center">
          <motion.h2 
            className="text-[4.5vw] font-display font-bold text-[var(--color-primary)] mb-[2vw]"
            initial={{ opacity: 0, y: -20 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          >
            Match de Candidatos
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-[2vw] max-w-[50vw]">
            {topics.map((topic, i) => (
              <motion.div
                key={i}
                className={`px-[2vw] py-[1vw] rounded-full border-2 text-[2vw] font-bold shadow-sm ${topic.color}`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={phase >= 3 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
                transition={{ delay: i * 0.2, type: 'spring' }}
              >
                {topic.text}
              </motion.div>
            ))}
          </div>

          {/* Percentages Panel */}
          <motion.div
            className="mt-[4vw] bg-white rounded-3xl p-[2vw] shadow-xl border border-slate-100 w-[40vw]"
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            animate={phase >= 4 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 45 }}
            transition={{ type: 'spring', bounce: 0.4 }}
          >
            <div className="text-center mb-[1vw] text-[var(--color-text-secondary)] font-medium text-[1.5vw]">
              Compatibilidade Neutra
            </div>
            <div className="flex flex-col gap-3">
              {[85, 72, 64].map((val, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0" />
                  <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[var(--color-secondary)] rounded-full"
                      initial={{ width: 0 }}
                      animate={phase >= 4 ? { width: `${val}%` } : { width: 0 }}
                      transition={{ delay: 0.5 + (i * 0.2), duration: 1 }}
                    />
                  </div>
                  <div className="w-16 font-bold text-[var(--color-primary)] text-right text-[1.5vw]">{val}%</div>
                </div>
              ))}
            </div>
            
            <motion.div 
              className="mt-[2vw] text-center text-[1.8vw] font-display font-bold text-[var(--color-success)] bg-emerald-50 py-2 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 1.5 }}
            >
              Sua escolha é totalmente livre.
            </motion.div>
          </motion.div>
        </div>

        {/* Mascot on right */}
        <motion.div
          className="w-[25vw] flex-shrink-0 relative"
          initial={{ opacity: 0, x: 50 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        >
          <motion.img 
            src={mascotImg} 
            alt="Mascote Sônia" 
            className="w-full object-contain drop-shadow-xl -scale-x-100"
            animate={{ y: phase >= 2 ? [0, -15, 0] : 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      <Caption 
        text="Descubra sua compatibilidade com candidatos." 
        isVisible={phase === 2 || phase === 3} 
      />
      <Caption 
        text="Sua escolha é totalmente livre e sua." 
        isVisible={phase === 4} 
      />
    </motion.div>
  );
}