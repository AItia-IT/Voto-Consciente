import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';
import { Caption } from './Caption';
import mascotImg from "@assets/Screenshot_from_2026-05-30_11-12-36_1780151261109.webp";

const elders = [
  { skin: '#4A2C1A', hair: '#2C1810', label: 'Sr. Carlos', device: 'tablet', glasses: true, hearing: false },
  { skin: '#F5CBA7', hair: '#A0A0A0', label: 'Dona Maria', device: 'phone', glasses: true, hearing: false },
  { skin: '#8D5524', hair: '#4A3728', label: 'Sr. João', device: 'computer', glasses: false, hearing: true },
  { skin: '#D4A574', hair: '#888', label: 'Dona Ana', device: 'tablet', glasses: true, hearing: false },
];

function ElderAvatar({ skin, hair, glasses, hearing, device, delay }: {
  skin: string; hair: string; glasses: boolean; hearing: boolean; device: string; delay: number; label?: string;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="relative w-[8vw] h-[8vw]">
        <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-lg">
          <circle cx="40" cy="40" r="40" fill="#FFF8EE" />
          <ellipse cx="40" cy="52" rx="22" ry="16" fill={skin} />
          <circle cx="40" cy="30" r="16" fill={skin} />
          <ellipse cx="40" cy="18" rx="17" ry="12" fill={hair} />
          {glasses && (
            <g stroke="#1E3A5F" strokeWidth="2" fill="none">
              <rect x="24" y="28" width="12" height="8" rx="4" fill="rgba(200,220,255,0.4)" />
              <rect x="44" y="28" width="12" height="8" rx="4" fill="rgba(200,220,255,0.4)" />
              <line x1="36" y1="32" x2="44" y2="32" />
            </g>
          )}
          {hearing && (
            <ellipse cx="57" cy="32" rx="4" ry="6" fill="#F5A623" />
          )}
          <rect x="28" y="66" width="24" height="12" rx="4" fill={skin} />
        </svg>
        <div className="absolute -bottom-1 -right-1 bg-[var(--color-secondary)] rounded-full w-[2.5vw] h-[2.5vw] flex items-center justify-center text-white shadow-md" style={{ fontSize: 'clamp(8px, 1.2vw, 16px)' }}>
          {device === 'tablet' ? '📱' : device === 'phone' ? '📲' : '💻'}
        </div>
      </div>
    </motion.div>
  );
}

export function Scene1() {
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
      className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-light)] overflow-hidden"
      {...sceneTransitions.clipCircle}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-bg-muted)] to-[var(--color-bg-light)] opacity-60" />

      <motion.div
        className="absolute w-[50vw] h-[50vw] rounded-full bg-[var(--color-accent)]/10 blur-3xl -top-[15vw] -right-[10vw]"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[30vw] h-[30vw] rounded-full bg-[var(--color-secondary)]/10 blur-3xl bottom-[5vw] left-[5vw]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      <div className="relative z-10 flex w-full h-full items-center px-[8vw]">
        <motion.div
          className="w-[28vw] flex-shrink-0"
          initial={{ x: '-25vw', opacity: 0, rotate: -8 }}
          animate={{
            x: phase >= 1 ? 0 : '-25vw',
            opacity: phase >= 1 ? 1 : 0,
            rotate: phase >= 1 ? 0 : -8,
            y: phase >= 2 ? [0, -12, 0] : 0
          }}
          transition={{
            x: { type: 'spring', stiffness: 180, damping: 22 },
            opacity: { duration: 0.5 },
            rotate: { duration: 0.5 },
            y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <img src={mascotImg} alt="Mascote Sônia" className="w-full object-contain drop-shadow-2xl" />
        </motion.div>

        <div className="ml-[4vw] flex-1 flex flex-col justify-center">
          <motion.h1
            className="font-display font-bold text-[var(--color-primary)] leading-tight mb-[2vw]"
            style={{ fontSize: 'clamp(28px, 5vw, 72px)' }}
            initial={{ opacity: 0, x: 60 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 160 }}
          >
            Bem-vindo ao
            <br />
            <span className="text-[var(--color-secondary)]">Voto Consciente</span>
          </motion.h1>

          <motion.div
            className="h-[3px] bg-[var(--color-accent)] rounded-full mb-[2.5vw]"
            initial={{ width: 0 }}
            animate={phase >= 1 ? { width: '12rem' } : { width: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
          />

          <motion.p
            className="text-[var(--color-text-secondary)] font-body mb-[3vw]"
            style={{ fontSize: 'clamp(16px, 1.8vw, 28px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            Para você que quer votar com mais consciência e segurança.
          </motion.p>

          <motion.div
            className="grid grid-cols-4 gap-[1.5vw]"
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {elders.map((elder, i) => (
              <ElderAvatar key={i} {...elder} delay={phase >= 3 ? 0.15 * i : 0} />
            ))}
          </motion.div>

          <motion.div
            className="mt-[2vw] flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {['Quiz Fake ou Fato', 'Academia', 'Match', 'Chat Sônia'].map((feature, i) => (
              <motion.div
                key={i}
                className="px-[1.2vw] py-[0.6vw] bg-[var(--color-primary)] text-white rounded-full font-bold shadow-md"
                style={{ fontSize: 'clamp(10px, 1.1vw, 16px)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.1 * i, type: 'spring' }}
              >
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <Caption text="Olá! Sou a Sônia, sua guia no Voto Consciente!" isVisible={phase === 2} />
      <Caption text="Aqui você aprende a votar com mais consciência." isVisible={phase === 3} />
      <Caption text="Feito para todos os brasileiros — de todos os contextos." isVisible={phase === 4} />
      <Caption text="Vamos descobrir juntos?" isVisible={phase === 5} />
    </motion.div>
  );
}
