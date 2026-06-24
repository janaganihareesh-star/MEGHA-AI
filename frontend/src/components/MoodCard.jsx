import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, XAxis, Tooltip, Bar } from 'recharts';
import { Smile } from 'lucide-react';

export default function MoodCard({
  moodTrend = [],
  currentMood = 'calm',
  cardVariants = {}
}) {
  return (
    <motion.div
      variants={cardVariants}
      className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold font-outfit text-lg flex items-center gap-2">
          <Smile className="w-5 h-5 text-accent" /> Mood Analytics
        </h3>
        <span className="text-xs text-muted font-bold capitalize">
          Current: {currentMood}
        </span>
      </div>

      {/* BarChart */}
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={moodTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)' }} />
            <Bar dataKey="percentage" fill="var(--accent-violet)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}