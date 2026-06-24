import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, FastForward } from 'lucide-react';

export default function VoicePlayer({ audioUrl, onFinished }) {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (!audioUrl || !containerRef.current) return;

    // Get current theme styling colors
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const waveColor = isDark ? '#7C3AED' : '#4338CA'; // violet vs indigo
    const progressColor = '#06B6D4'; // cyan

    // Initialize WaveSurfer
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor,
      progressColor,
      cursorColor: 'transparent',
      barWidth: 2,
      barGap: 3,
      barRadius: 2,
      height: 48,
      normalize: true
    });

    wavesurferRef.current = ws;

    ws.load(audioUrl);

    ws.on('ready', () => {
      ws.play();
      setIsPlaying(true);
    });

    ws.on('finish', () => {
      setIsPlaying(false);
      if (onFinished) onFinished();
    });

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(wavesurferRef.current.isPlaying());
    }
  };

  const handleSpeed = (rate) => {
    setPlaybackRate(rate);
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(rate);
    }
  };

  return (
    <div className="w-full bg-surface border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
      {/* Play/Pause Control */}
      <button
        onClick={togglePlay}
        className="p-3 bg-accent text-white rounded-full hover:opacity-90 transition cursor-pointer flex-shrink-0"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>

      {/* Wavesurfer Container */}
      <div ref={containerRef} className="flex-1 w-full min-w-[200px]" />

      {/* Speed Controls */}
      <div className="flex gap-1.5 flex-shrink-0">
        {[0.75, 1.0, 1.25, 1.5].map((rate) => (
          <button
            key={rate}
            onClick={() => handleSpeed(rate)}
            className={`text-xs px-2 py-1 rounded-md font-semibold transition cursor-pointer ${
              playbackRate === rate
                ? 'bg-accent/15 text-accent border border-accent/25'
                : 'text-muted hover:text-text'
            }`}
          >
            {rate}x
          </button>
        ))}
      </div>
    </div>
  );
}