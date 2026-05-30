import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';
import { Caption } from './Caption';
import mascotImg from "@assets/Screenshot_from_2026-05-30_11-12-36_1780151261109.webp";

export function Scene5() {
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
      className="absolute inset-0 flex items-center justify-center bg-slate-900 overflow-hidden"
      {...sceneTransitions.clipPolygon}
    >
      {/* Dramatic background that turns red when alert happens */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        initial={{ backgroundColor: '#1e293b' }}
        animate={{ backgroundColor: phase >= 3 ? '#ef4444' : '#1e293b' }}
      />

      <div className="relative z-10 flex w-full h-full items-center justify-center">
        
        {/* Floating fake messages */}
        <AnimatePresence>
          {phase >= 2 && phase < 3 && (
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                className="absolute top-[20%] left-[10%] bg-white p-4 rounded-xl shadow-2xl text-[1.5vw] font-bold text-slate-800 rotate-[-10deg]"
                initial={{ opacity: 0, scale: 0, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
              >
                URGENTE: Nova lei proíbe...
              </motion.div>
              <motion.div 
                className="absolute bottom-[30%] right-[15%] bg-white p-4 rounded-xl shadow-2xl text-[1.5vw] font-bold text-slate-800 rotate-[5deg]"
                initial={{ opacity: 0, scale: 0, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }} transition={{ delay: 0.2 }}
              >
                Compartilhe antes que apaguem!!!
              </motion.div>
              <motion.div 
                className="absolute top-[40%] right-[30%] bg-white p-4 rounded-xl shadow-2xl text-[1.5vw] font-bold text-slate-800 rotate-[15deg]"
                initial={{ opacity: 0, scale: 0, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }} transition={{ delay: 0.4 }}
              >
                Link secreto revelado: http://...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot with "Stop" gesture */}
        <motion.div
          className="w-[35vw] flex-shrink-0 relative z-20"
          initial={{ opacity: 0, y: 100 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <img src={mascotImg} alt="Mascote Sônia" className="w-full object-contain drop-shadow-2xl" />
        </motion.div>

        {/* Alert Icons */}
        <AnimatePresence>
          {phase >= 3 && (
            <div className="absolute inset-0 flex items-center justify-around px-[10vw]">
              {[
                { label: "Link Suspeito", delay: 0 },
                { label: "Sem Fonte", delay: 0.2 },
                { label: "Alarmismo", delay: 0.4 }
              ].map((alert, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: alert.delay, type: 'spring', bounce: 0.5 }}
                >
                  <div className="w-[12vw] h-[12vw] bg-white rounded-full flex items-center justify-center p-[2vw] shadow-[0_0_50px_rgba(239,68,68,0.5)]">
                    <img src={`${import.meta.env.BASE_URL}images/shield-alert.png`} className="w-full h-full object-contain" />
                  </div>
                  <div className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full font-bold text-[1.5vw] uppercase tracking-wider">
                    {alert.label}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <Caption 
        text="Cuidado com notícias alarmistas!" 
        isVisible={phase >= 2 && phase < 4} 
      />
      <Caption 
        text="Sempre verifique a fonte antes de acreditar." 
        isVisible={phase >= 4} 
      />
    </motion.div>
  );
}