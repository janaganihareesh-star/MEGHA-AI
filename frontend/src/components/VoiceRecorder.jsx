import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function VoiceRecorder({ onRecordComplete, status, setStatus }) {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // Setup canvas drawings
  const startVisualizer = (audioStream) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(audioStream);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 64; // 32 frequency bins
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const draw = () => {
        if (!analyserRef.current) return;
        animationFrameRef.current = requestAnimationFrame(draw);

        analyserRef.current.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;

          // Draw gradient bar
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#7C3AED'); // violet
          gradient.addColorStop(1, '#06B6D4'); // cyan

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 2;
        }
      };

      draw();
    } catch (err) {
      console.error('Visualizer setup failed:', err.message);
    }
  };

  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(audioStream);
      setStatus('Listening...');
      setIsRecording(true);

      const mediaRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const duration = 5; // mock estimate of duration in seconds
        onRecordComplete(audioBlob, duration);
      };

      mediaRecorder.start();
      startVisualizer(audioStream);
    } catch (err) {
      toast.error('Microphone permissions denied or not found.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus('Thinking...');

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      analyserRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup recorders
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, stream]);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Canvas visualizer */}
      <div className="w-full max-w-xs h-16 relative">
        <canvas
          ref={canvasRef}
          width="320"
          height="64"
          className="w-full h-full border border-border/20 rounded-xl bg-panel/30"
        />
        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Hidden placeholder */}
          </div>
        )}
      </div>

      {/* Button */}
      <div className="flex justify-center">
        {status === 'Thinking...' ? (
          <div className="w-20 h-20 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : isRecording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg relative animate-pulse cursor-pointer"
          >
            <Square className="w-10 h-10" />
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-rose-500/30 animate-ping -z-10" />
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:scale-105 transition cursor-pointer"
          >
            <Mic className="w-10 h-10" />
          </button>
        )}
      </div>
    </div>
  );
}