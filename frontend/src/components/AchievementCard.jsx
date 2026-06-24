import React from 'react';
import { motion } from 'framer-motion';

export default function AchievementCard({ item, idx, getCategoryColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.05 }}
      className="p-5 rounded-2xl bg-surface border border-border hover:border-amber/40 shadow-card flex items-start gap-4 relative overflow-hidden group"
    >
      {/* Medal Icon Box */}
      <div className="w-12 h-12 rounded-xl bg-panel border border-border/60 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition duration-300">
        {item.icon || '🏆'}
      </div>

      <div className="space-y-1.5 text-left min-w-0 flex-1">
        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold capitalize ${getCategoryColor(item.category)}`}>
          {item.category}
        </span>
        <h4 className="font-extrabold text-sm text-text truncate">
          {item.title}
        </h4>
        <p className="text-muted text-xs leading-relaxed font-medium">
          {item.description}
        </p>
        <span className="block text-[10px] text-muted font-bold pt-1">
          Unlocked: {new Date(item.achievedAt || item.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Sparkling background flare */}
      <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-amber/5 rounded-full blur-xl group-hover:bg-amber/10 transition" />
    </motion.div>
  );
}