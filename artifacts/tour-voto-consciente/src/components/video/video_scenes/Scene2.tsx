import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';
import { Caption } from './Caption';
import mascotImg from "@assets/Screenshot_from_2026-05-30_11-12-36_1780151261109.webp";
import quizImg from "@assets/Screenshot_from_2026-05-30_11-24-36_1780151261109.png";

const sourceIndicators = [
  { label: 'Fonte verificada', icon: '🔍', color: 'bg-blue-50 border-blue-200 text-blue-700', delay: 0 },
  { label: 'Data de publicação', icon: '📅', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', delay: 0.25 },
  { label: 'Contexto completo', icon: '📋', color: 'bg-amber-50 border-amber-200 text-amber-700', delay: 0.5 },
];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 7000),
      setTimeout(() => setPhase(4), 11000),
      setTimeout(() => setPhase(5), 15000),
      setTimeout(() => setPhase(6), 18500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary)] overflow-hidden"
      {...sceneTransitions.morphExpand}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-slate-800" />

      <motion.div
        className="absolute top-[5vw] right-[5vw] w-[20vw] h-[20vw] rounded-full bg-[var(--color-secondary)]/10 blur-3xl"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex w-full h-full items-center px-[6vw] gap-[4vw]">
        <motion.div
          className="flex-1 relative"
          initial={{ opacity: 0, y: 60, rotateX: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 60, rotateX: 20 }}
          transition={{ type: 'spring', stiffness: 130, damping: 20 }}
        >
          <div className="rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-white">
            <img src={quizImg} alt="Quiz Fake ou Fato" className="w-full object-cover" />

            <AnimatePresence>
              {phase >= 3 && phase < 4 && (
                <motion.div
                  className="absolute inset-0 bg-black/20 pointer-events-none flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white/95 backdrop-blur-md rounded-2xl p-[2vw] shadow-xl border-4 border-emerald-400"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  >
                    <div className="flex items-center gap-3 text-emerald-600 font-display font-bold" style={{ fontSize: 'clamp(18px, 2.5vw, 40px)' }}>
                      <span>✅</span> FATO!
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Source/Date/Context indicators */}
          <AnimatePresence>
            {phase >= 4 && (
              <motion.div
                className="mt-[1.5vw] flex flex-col gap-[1vw]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.p
                  className="text-white/70 font-body font-semibold uppercase tracking-widest text-center mb-1"
                  style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  O que verificar antes de compartilhar
                </motion.p>
                {sourceIndicators.map((ind, i) => (
                  <motion.div
                    key={i}
                    className={`flex items-center gap-3 px-[1.5vw] py-[0.8vw] rounded-xl border-2 ${ind.color} font-body font-bold shadow-sm`}
                    style={{ fontSize: 'clamp(12px, 1.3vw, 20px)' }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ind.delay, type: 'spring' }}
                  >
                    <span style={{ fontSize: 'clamp(14px, 1.8vw, 28px)' }}>{ind.icon}</span>
                    {ind.label}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="w-[25vw] flex-shrink-0 flex flex-col items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.4 }}
          >
            <motion.img
              src={mascotImg}
              alt="Mascote Sônia"
              className="w-full object-contain drop-shadow-2xl"
              animate={{ y: phase >= 2 ? [0, -14, 0] : 0 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            <AnimatePresence>
              {phase >= 3 && (
                <motion.div
                  className="absolute -top-[3vw] -right-[3vw] bg-white text-[var(--color-primary)] px-[1.5vw] py-[0.8vw] rounded-2xl rounded-bl-none shadow-xl font-display font-bold"
                  style={{ fontSize: 'clamp(12px, 1.4vw, 22px)' }}
                  initial={{ opacity: 0, scale: 0, originX: 0, originY: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  Excelente tentativa! 🎉
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {phase >= 2 && phase < 3 && (
              <motion.div
                className="mt-[2vw] flex flex-col gap-[1vw] w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {[
                  { text: '✅ FATO', bg: 'bg-emerald-500', delay: 0 },
                  { text: '❌ FAKE', bg: 'bg-red-500', delay: 0.15 },
                ].map((btn, i) => (
                  <motion.div
                    key={i}
                    className={`${btn.bg} text-white font-display font-bold text-center py-[0.8vw] rounded-xl shadow-lg`}
                    style={{ fontSize: 'clamp(14px, 1.8vw, 28px)' }}
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: btn.delay }}
                  >
                    {btn.text}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Caption text="Fake ou Fato? Treine seu olhar crítico!" isVisible={phase === 2} />
      <Caption text="Identifique notícias falsas antes de compartilhar." isVisible={phase === 3} />
      <Caption text="Verifique sempre: fonte, data e contexto." isVisible={phase === 4} />
      <Caption text="Informação verificada é poder nas suas mãos!" isVisible={phase === 5} />
    </motion.div>
  );
}
