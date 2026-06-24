import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import useSocket from '../hooks/useSocket';
import useAuth from '../hooks/useAuth';
import { googleTTS } from '../utils/tts';

export default function VoiceCallOverlay({ onClose, currentConversation, companionName = 'MEGHA', isInline = false }) {
  const [isActive, setIsActive] = useState(false);
  const [callState, setCallState] = useState('DORMANT'); // DORMANT, LISTENING, THINKING, SPEAKING
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [audioEmotion, setAudioEmotion] = useState('NEUTRAL');
  const callStateRef = useRef('DORMANT');
  const isActiveRef = useRef(false);
  const transcriptRef = useRef('');
  
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const { socket } = useSocket();
  const { user } = useAuth();
  
  // Timer for detecting pause in speech
  const speechTimeoutRef = useRef(null);

  const canvasRef = useRef(null);
  const visualizerAnimationFrameRef = useRef(null);

  const updateCallState = (newState) => {
    setCallState(newState);
    callStateRef.current = newState;
  };

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition. Try Google Chrome.');
      if (onClose) onClose();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'te-IN'; // Defaulting to Telugu as requested
    recognitionRef.current = recognition;

    // --- Audio Emotion Setup ---
    const initAudioEmotion = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100
          } 
        });
        streamRef.current = stream;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const drawVisualizer = () => {
          if (!canvasRef.current || !analyserRef.current) return;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          const width = canvas.width;
          const height = canvas.height;

          analyserRef.current.getByteFrequencyData(dataArray);
          ctx.clearRect(0, 0, width, height);

          const centerX = width / 2;
          const centerY = height / 2;
          const radius = 100;

          const gradient = ctx.createLinearGradient(0, 0, width, height);
          if (callStateRef.current === 'SPEAKING') {
            gradient.addColorStop(0, '#A78BFA');
            gradient.addColorStop(1, '#F43F5E');
          } else if (callStateRef.current === 'THINKING') {
            gradient.addColorStop(0, '#06B6D4');
            gradient.addColorStop(1, '#10B981');
          } else if (callStateRef.current === 'LISTENING') {
            gradient.addColorStop(0, '#EEF0FF');
            gradient.addColorStop(1, '#A0A8D0'); 
          } else {
            gradient.addColorStop(0, '#333333');
            gradient.addColorStop(1, '#555555');
          }

          ctx.beginPath();
          // If dormant, draw a flat circle instead of jagged lines
          if (callStateRef.current === 'DORMANT') {
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          } else {
            for (let i = 0; i < bufferLength; i++) {
              const val = dataArray[i];
              const percent = val / 255;
              const h = (radius * percent);
              const offset = radius + (callStateRef.current === 'LISTENING' || callStateRef.current === 'SPEAKING' ? h : h * 0.2);
              const angle = (i * 2 * Math.PI) / bufferLength;

              const x = centerX + Math.cos(angle) * offset;
              const y = centerY + Math.sin(angle) * offset;

              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.lineWidth = 4;
          ctx.strokeStyle = gradient;
          ctx.stroke();
          
          ctx.shadowBlur = callStateRef.current === 'DORMANT' ? 0 : 30;
          ctx.shadowColor = callStateRef.current === 'SPEAKING' ? '#A78BFA' : (callStateRef.current === 'DORMANT' ? 'transparent' : 'rgba(255,255,255,0.2)');

          visualizerAnimationFrameRef.current = requestAnimationFrame(drawVisualizer);
        };
        drawVisualizer();

        const checkEmotion = () => {
          if (!analyserRef.current) return;
          if (callStateRef.current !== 'DORMANT') {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const averageVolume = sum / bufferLength;
            
            if (averageVolume > 40 && callStateRef.current === 'SPEAKING') {
              console.log("VAD: User interrupted the AI with voice spike!");
              googleTTS.cancel();
              updateCallState('LISTENING');
              setAiResponse('...interrupted...');
            }

            if (averageVolume > 80) setAudioEmotion('EXCITED/ANGRY');
            else if (averageVolume < 15 && averageVolume > 2) setAudioEmotion('CALM/SAD');
            else if (averageVolume >= 15 && averageVolume <= 80) setAudioEmotion('NEUTRAL');
          }
          animationFrameRef.current = requestAnimationFrame(checkEmotion);
        };
        checkEmotion();

        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        let audioChunks = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          audioChunks = [];
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            window.lastAudioBase64 = reader.result;
          };
        };
        window.mediaRecorderInstance = mediaRecorder;
        
      } catch (err) {
        console.error("AudioContext initialization failed", err);
      }
    };
    initAudioEmotion();

    recognition.onresult = (event) => {
      if (!isActiveRef.current) return; // ignore results if dormant

      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
        else interimTranscript += event.results[i][0].transcript;
      }

      let newAcc = transcriptRef.current + finalTranscript;
      if (finalTranscript) {
        transcriptRef.current = newAcc;
      }
      setTranscript(newAcc + interimTranscript);

      if (callStateRef.current === 'SPEAKING') {
        const spokenText = finalTranscript || interimTranscript;
        if (spokenText.trim().length > 15) {
          console.log("User interrupted the AI!");
          googleTTS.cancel();
          updateCallState('LISTENING');
          setAiResponse('...interrupted...');
        }
      }

      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      
      if (finalTranscript || interimTranscript) {
        speechTimeoutRef.current = setTimeout(() => {
          const fullText = transcriptRef.current + interimTranscript;
          // Filter out random background noise (must be > 2 chars)
          // Actually, we should allow short utterances too, just ignore empty space
          if (isActiveRef.current && fullText.trim().length > 0 && callStateRef.current === 'LISTENING') {
            handleUserFinishedSpeaking(fullText);
          } else if (isActiveRef.current && fullText.trim().length === 0 && callStateRef.current === 'LISTENING') {
            // It was probably just noise, reset transcript
            setTranscript('');
            transcriptRef.current = '';
          }
        }, 1000); // Reduced timeout to 1 second for ultra-fast response
      }
    };

    recognition.onerror = (event) => {
      // Abort is normal when we stop it manually
      if (event.error !== 'aborted') {
        console.error('Speech recognition error', event.error);
      }
      // If network or no-speech, and we are still active, restart it
      if (isActiveRef.current && (event.error === 'network' || event.error === 'no-speech')) {
        try { recognition.start(); } catch (e) {}
      }
    };

    recognition.onend = () => {
      // Auto-restart if we are still supposed to be listening and not thinking/speaking
      if (isActiveRef.current && callStateRef.current === 'LISTENING') {
        try { recognition.start(); } catch (e) {}
      }
    };
    
    recognition.onstart = () => {
      if (window.mediaRecorderInstance && window.mediaRecorderInstance.state === 'inactive' && isActiveRef.current) {
        window.mediaRecorderInstance.start();
      }
    };

    // Listen for AI responses via socket
    if (socket) {
      socket.on('ai_voice_stream_response', (data) => {
        if (!isActiveRef.current) return; // ignore if user turned mic off
        if (callStateRef.current !== 'SPEAKING') {
          updateCallState('SPEAKING');
          setAiResponse('');
        }
        
        let spokenText = data.chunk.replace(/```[\s\S]*?```/g, ' [Code provided in chat] ');
        spokenText = spokenText.replace(/[*_`]/g, '');

        setAiResponse(prev => prev + ' ' + spokenText);
        
        // Buffer text until a sentence is complete to prevent TTS stuttering
        if (!window.ttsBuffer) window.ttsBuffer = '';
        window.ttsBuffer += ' ' + spokenText;
        
        if (/[.!?।]/.test(spokenText) || window.ttsBuffer.length > 80) {
          if (window.ttsBuffer.trim()) {
            googleTTS.speak(window.ttsBuffer.trim(), 'te');
            window.ttsBuffer = '';
          }
        }
      });

      socket.on('ai_stopped', () => {
        setIsSpeaking(false);
        if (window.ttsBuffer && window.ttsBuffer.trim()) {
          googleTTS.speak(window.ttsBuffer.trim(), 'te');
          window.ttsBuffer = '';
        }
      });

      socket.on('ai_voice_stream_end', (data) => {
        let checkInterval = setInterval(() => {
          if (!googleTTS.isPlaying && callStateRef.current === 'SPEAKING') {
            clearInterval(checkInterval);
            if (isActiveRef.current) {
              updateCallState('LISTENING');
              setAiResponse('');
              try { recognitionRef.current.start(); } catch(e) {}
            }
          }
        }, 500);
      });

      socket.on('ai_voice_stream_error', (data) => {
        console.error("Voice OS Error:", data.error);
        if (isActiveRef.current) {
          updateCallState('LISTENING');
          try { recognitionRef.current.start(); } catch(e) {}
        }
      });
    }

    return () => {
      recognition.stop();
      googleTTS.cancel();
      if (socket) {
        socket.off('ai_voice_stream_response');
        socket.off('ai_voice_stream_end');
        socket.off('ai_voice_stream_error');
      }
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (visualizerAnimationFrameRef.current) cancelAnimationFrame(visualizerAnimationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const handleUserFinishedSpeaking = (finalText) => {
    if (!finalText.trim() || !isActiveRef.current) return;
    
    updateCallState('THINKING');
    recognitionRef.current?.stop();
    setTranscript('');
    transcriptRef.current = '';
    
    if (window.mediaRecorderInstance && window.mediaRecorderInstance.state === 'recording') {
      window.mediaRecorderInstance.stop();
    }
    
    const emotionTag = audioEmotion !== 'NEUTRAL' ? `[AudioEmotion Detected: ${audioEmotion}] ` : '';
    const messagePayload = emotionTag + finalText;

    setTimeout(() => {
      if (socket && isActiveRef.current) {
        socket.emit('voice_stream_chunk', {
          text: messagePayload,
          audioBase64: window.lastAudioBase64 || null,
          userId: localStorage.getItem('userId'),
          conversationId: currentConversation?._id || null
        });
      }
      if (window.mediaRecorderInstance && window.mediaRecorderInstance.state === 'inactive' && isActiveRef.current) {
        window.mediaRecorderInstance.start();
      }
    }, 200); 
  };

  const toggleActive = () => {
    const newState = !isActive;
    setIsActive(newState);
    isActiveRef.current = newState;

    if (newState) {
      updateCallState('LISTENING');
      setTranscript('');
      transcriptRef.current = '';
      setAiResponse('');
      try { recognitionRef.current?.start(); } catch(e) {}
      if (window.mediaRecorderInstance && window.mediaRecorderInstance.state === 'inactive') {
        window.mediaRecorderInstance.start();
      }
    } else {
      updateCallState('DORMANT');
      recognitionRef.current?.stop();
      googleTTS.cancel();
      if (window.mediaRecorderInstance && window.mediaRecorderInstance.state === 'recording') {
        window.mediaRecorderInstance.stop();
      }
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      setTranscript('');
      transcriptRef.current = '';
      setAiResponse('');
    }
  };

  const orbVariants = {
    DORMANT: { scale: 1, opacity: 0.3, transition: { duration: 0.5 } },
    LISTENING: { scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5], transition: { repeat: Infinity, duration: 2 } },
    THINKING: { scale: [1, 1.05, 1], rotate: [0, 180, 360], borderRadius: ["50%", "40%", "50%"], transition: { repeat: Infinity, duration: 1.5 } },
    SPEAKING: { scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8], transition: { repeat: Infinity, duration: 0.8 } }
  };

  const containerClasses = isInline 
    ? "w-full h-full flex flex-col items-center justify-center relative bg-transparent"
    : "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]/90 backdrop-blur-2xl";

  return (
    <div className={containerClasses}>
      
      <div className={`text-center ${isInline ? 'mt-8' : 'absolute top-10'}`}>
        <h2 className="text-2xl font-outfit font-bold text-text tracking-widest">{companionName}</h2>
        <p className="text-accent tracking-widest text-sm uppercase mt-2 font-mono">
          {callState === 'DORMANT' ? 'TAP MIC TO START' : callState}
        </p>
        <p className="text-[10px] text-text/40 uppercase mt-1 tracking-widest h-4">
          {isActive && audioEmotion !== 'NEUTRAL' && callState !== 'DORMANT' ? `Detected: ${audioEmotion}` : ''}
        </p>
      </div>

      <div className={`relative flex items-center justify-center w-[300px] h-[300px] ${isInline ? 'my-8' : 'mt-10'}`}>
        <canvas ref={canvasRef} width={300} height={300} className="absolute z-0" />
        <motion.div
          variants={orbVariants}
          animate={callState}
          className={`w-24 h-24 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)] z-10 flex items-center justify-center border border-white/10 backdrop-blur-sm transition-colors ${
            callState === 'DORMANT' ? 'bg-black/20' :
            callState === 'LISTENING' ? 'bg-black/60' : 
            callState === 'THINKING' ? 'bg-black/80' : 
            'bg-black/40'
          }`}
        >
          {callState === 'SPEAKING' ? <Volume2 className={`w-8 h-8 ${isActive ? 'text-white/90' : 'text-white/30'}`} /> : <Mic className={`w-8 h-8 ${isActive ? 'text-white/50' : 'text-white/20'}`} />}
        </motion.div>
      </div>

      {/* Subtitles / Transcripts */}
      <div className={`h-24 max-w-lg px-6 text-center flex flex-col justify-center ${isInline ? 'mb-4' : 'mt-16'}`}>
        {callState === 'DORMANT' && (
          <p className="text-muted/60 font-outfit text-sm">
            Mic is off. Tap the microphone button to start conversing.
          </p>
        )}
        {callState === 'LISTENING' && (
          <p className="text-text/60 font-outfit text-lg">
            {transcript || "Listening..."}
          </p>
        )}
        {callState === 'SPEAKING' && (
          <p className="text-accent/90 font-outfit text-xl font-medium drop-shadow-md">
            "{aiResponse}"
          </p>
        )}
      </div>

      {/* Controls */}
      <div className={`flex items-center justify-center ${isInline ? 'mt-auto mb-12' : 'absolute bottom-16'}`}>
        <button 
          onClick={toggleActive}
          className={`p-6 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
            isActive 
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]' 
              : 'bg-surface/50 border border-border/50 text-text/60 hover:text-text hover:bg-surface'
          }`}
        >
          {isActive ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>
      </div>
    </div>
  );
}
