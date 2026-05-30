import { motion, AnimatePresence } from 'framer-motion';

interface CaptionProps {
  text: string;
  isVisible: boolean;
}

export function Caption({ text, isVisible }: CaptionProps) {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-slate-900/80 text-white px-8 py-4 rounded-2xl max-w-[80%] text-center backdrop-blur-sm border border-white/10"
          >
            <p style={{ fontSize: 'clamp(20px, 2vw, 36px)' }} className="font-display font-medium leading-snug">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
