import React from 'react';
import { Target, Calendar } from 'lucide-react';

export default function GoalCard({ goal, onToggleComplete }) {
  if (!goal) return null;

  return (
    <div className="p-4 rounded-xl bg-surface border border-border flex flex-col justify-between space-y-3">
      <div className="space-y-1">
        <h4 className={`text-sm font-bold text-text ${goal.isCompleted ? 'line-through text-muted' : ''}`}>
          {goal.title}
        </h4>
        {goal.description && <p className="text-[11px] text-muted line-clamp-2">{goal.description}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold">
          <span className="text-muted">Progress</span>
          <span className="text-accent">{goal.progress}%</span>
        </div>
        <div className="w-full h-1 bg-panel rounded-full overflow-hidden">
          <div className="h-full bg-accent transition-all duration-300" style={{ width: `${goal.progress}%` }} />
        </div>
      </div>
    </div>
  );
}