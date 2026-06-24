import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex w-full mb-3 justify-start pl-2">
      <div className="glass-bubble-ai px-4 py-3 mr-auto flex items-center gap-3 h-10 rounded-2xl rounded-tl-sm">
        <div className="thinking-orb"></div>
        <span className="text-xs text-muted font-medium tracking-wider uppercase">Processing</span>
      </div>
    </div>
  );
}