import React from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Volume2 } from 'lucide-react';

export default function VoiceSelector({
  activeVoices,
  selectedVoice,
  setSelectedVoice,
  playingVoice,
  handlePlayPreview
}) {
  return (
    <div className="space-y-4 pt-2">
      {activeVoices.map((voice, idx) => (
        <motion.div
          key={voice.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          onClick={() => setSelectedVoice(voice.id)}
          className={`p-5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
            selectedVoice === voice.id
              ? 'ring-2 ring-accent border-accent bg-panel'
              : 'bg-surface border-border hover:border-accent/40'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${selectedVoice === voice.id ? 'bg-accent/10 text-accent' : 'bg-panel text-muted'}`}>
              <Volume2 className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-text text-lg">{voice.name}</h3>
              <p className="text-xs text-muted">{voice.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Playing Wave Indicator */}
            {playingVoice === voice.id && (
              <div className="flex gap-0.5 items-end h-5 px-2">
                <div className="w-1 bg-accent rounded-full animate-wave" style={{ animationDelay: '0s' }} />
                <div className="w-1 bg-accent rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 bg-accent rounded-full animate-wave" style={{ animationDelay: '0.4s' }} />
                <div className="w-1 bg-accent rounded-full animate-wave" style={{ animationDelay: '0.6s' }} />
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPreview(voice);
              }}
              className="p-2 rounded-xl bg-panel border border-border text-text hover:bg-opacity-80 transition cursor-pointer"
            >
              {playingVoice === voice.id ? (
                <Square className="w-4 h-4 text-rose" />
              ) : (
                <Play className="w-4 h-4 text-accent" />
              )}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}