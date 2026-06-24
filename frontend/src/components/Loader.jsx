import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ size = 'medium', text = 'Loading...' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <Loader2 className={`animate-spin text-accent ${sizeClasses[size] || sizeClasses.medium}`} />
      {text && <span className="text-muted text-xs font-semibold">{text}</span>}
    </div>
  );
}