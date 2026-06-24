import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Sparkles } from 'lucide-react';

export default function MilestoneModal({
  isOpen,
  onClose,
  milestoneTitle = 'Bond Level Up!',
  milestoneDescription = 'You and your companion are growing closer. Keep chatting to unlock more memories and voice levels.',
  milestoneIcon = '🤝'
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-full max-w-sm bg-surface border border-border rounded-2xl shadow-card overflow-hidden text-center p-6 relative"
          >
            {/* Absolute close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-lg hover:bg-panel text-muted hover:text-text transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sparkles backdrop */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />

            {/* Animated Mascot / Badge */}
            <div className="relative w-20 h-20 mx-auto my-4 flex items-center justify-center bg-panel border-2 border-accent rounded-full text-4xl shadow-md">
              <span className="animate-bounce select-none">{milestoneIcon}</span>
              <div className="absolute -inset-1 border border-accent/20 rounded-full animate-ping" />
            </div>

            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-bold text-accent tracking-widest uppercase flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-accent" /> Milestone Achieved
              </span>
              <h3 className="text-xl font-extrabold font-outfit text-text">
                {milestoneTitle}
              </h3>
              <p className="text-muted text-xs leading-relaxed font-semibold px-2">
                {milestoneDescription}
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={onClose}
                className="w-full py-3 bg-accent text-white font-bold rounded-xl text-sm hover:opacity-90 transition cursor-pointer shadow-card"
              >
                Awesome, Thank You!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}