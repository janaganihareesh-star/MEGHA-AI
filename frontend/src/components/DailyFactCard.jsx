import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function DailyFactCard({ fact }) {
  if (!fact) return null;

  return (
    <div className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-500 text-left space-y-2 relative">
      <span className="text-xs font-bold text-amber flex items-center gap-1">
        <Lightbulb className="w-4 h-4" /> Did you know?
      </span>
      <p className="text-text text-xs leading-relaxed font-medium">
        {fact.fact || fact}
      </p>
    </div>
  );
}