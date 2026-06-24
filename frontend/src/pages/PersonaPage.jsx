import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import { fetchPreferences, updatePreferences } from '../store/settingsSlice';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Award,
  Heart,
  Smile,
  BookOpen,
  GraduationCap,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PersonaPage() {
  const user = useSelector((state) => state.auth.user);
  const userName = user ? user.fullName.split(' ')[0] : 'Friend';
  const dispatch = useDispatch();
  const { preferences, isLoading } = useSelector((state) => state.settings);

  // States
  const [activePersona, setActivePersona] = useState('maya_companion');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (preferences) {
      setActivePersona(preferences.activePersonaId || 'maya_companion');
    }
  }, [preferences]);

  const personas = [
    {
      id: 'maya_companion',
      name: 'Companion (The Empathic Friend)',
      description: 'Warm, supportive, and emotionally intelligent. Focuses on validation, friendly banter, and daily stress reduction, ${userName}.',
      icon: '💖',
      traits: ['Empathetic', 'Encouraging', 'Good Listener'],
      bg: 'from-pink-500/10 to-rose-500/5 hover:border-pink-500/40'
    },
    {
      id: 'arjun_mentor',
      name: 'Arjun (The Strict Tech Coach)',
      description: 'Professional, direct, and focused on your goals. Skips small talk to analyze code files, review resumes, and run interviews.',
      icon: '💻',
      traits: ['Structured', 'Analytical', 'Challenging'],
      bg: 'from-cyan-500/10 to-indigo-500/5 hover:border-cyan-500/40'
    },
    {
      id: 'priya_therapist',
      name: 'Priya (The Wellness Counselor)',
      description: 'Deeply calm, patient, and wellness-oriented. Specializes in handling panic, identifying emotional struggles, and suggesting breathing exercises.',
      icon: '🍃',
      traits: ['Calm', 'Mindful', 'Non-judgmental'],
      bg: 'from-emerald-500/10 to-teal-500/5 hover:border-emerald-500/40'
    },
    {
      id: 'kavi_philosopher',
      name: 'Kavi (The Creative Philosopher)',
      description: 'Poetic, philosophical, and reflective. Likes to frame your daily challenges as heroic journeys, often adding Telugu/English quotes.',
      icon: '📜',
      traits: ['Reflective', 'Poetic', 'Intelligent'],
      bg: 'from-amber-500/10 to-orange-500/5 hover:border-amber-500/40'
    }
  ];

  const handleSelectPersona = async (personaId) => {
    if (personaId === activePersona) return;

    setIsSaving(true);
    setActivePersona(personaId);
    try {
      await dispatch(updatePreferences({ activePersonaId: personaId })).unwrap();
      toast.success('Companion cognitive archetype updated successfully! 🧠');
    } catch (err) {
      toast.error('Failed to change persona archetype.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentCompanionName = preferences?.aiName || 'Companion';

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-extrabold font-outfit text-text flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-accent animate-pulse" /> Cognitive Archetype Selector
          </h2>
          <p className="text-muted text-sm mt-0.5">Customize {currentCompanionName}'s voice persona parameters and emotional responses, {userName}.</p>
        </div>

        {/* Info card */}
        <div className="p-5 bg-surface border border-border rounded-2xl shadow-card max-w-3xl leading-relaxed text-xs">
          <p className="font-semibold text-muted">
            💡 Toggling archetypes updates the AI system prompts dynamically. Switching to Arjun will focus responses on career roadmaps and direct checks, while Priya focuses heavily on breathing check-ins and mood distribution tracking.
          </p>
        </div>

        {/* Persona list grid */}
        {isLoading && !isSaving ? (
          <div className="py-20 flex justify-center items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
            <span className="text-muted text-sm font-outfit">Loading companion archetypes...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {personas.map((pers) => {
              const isActive = activePersona === pers.id;
              return (
                <div
                  key={pers.id}
                  onClick={() => handleSelectPersona(pers.id)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition duration-300 relative group flex flex-col justify-between overflow-hidden bg-gradient-to-r ${
                    pers.bg
                  } ${
                    isActive ? 'border-accent shadow-card' : 'border-border/60'
                  }`}
                >
                  <div className="space-y-4 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-4xl">{pers.icon}</span>
                      {isActive && (
                        <CheckCircle2 className="w-6 h-6 text-accent fill-accent/10 animate-scale" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-extrabold text-base text-text group-hover:text-accent transition">
                        {pers.name}
                      </h3>
                      <p className="text-muted text-xs leading-relaxed font-semibold">
                        {pers.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-border/30">
                    {pers.traits.map((trait) => (
                      <span key={trait} className="px-2 py-0.5 bg-panel border border-border/80 rounded text-[9px] font-bold text-muted uppercase">
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Ribbon tag if active */}
                  {isActive && (
                    <div className="absolute top-0 right-10 bg-accent text-white px-3 py-0.5 rounded-b-md text-[9px] font-bold tracking-wider">
                      ACTIVE COGNITIVE STATE
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
