import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import {
  CalendarDays,
  Award,
  BookOpen,
  Target,
  Sparkles,
  Loader2,
  AlertCircle,
  HelpCircle,
  Activity,
  History,
  TrendingUp,
  Inbox
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TimelinePage() {
  const user = useSelector((state) => state.auth.user);
  const userName = user ? user.fullName.split(' ')[0] : 'Friend';
  const token = useSelector((state) => state.auth.token);
  const preferences = useSelector((state) => state.settings.preferences);

  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'milestone' | 'reflection' | 'achievement' | 'summary'

  const fetchTimeline = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/timeline', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimeline(res.data.timeline || []);
    } catch (e) {
      toast.error('Failed to load timeline history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTimeline();
    }
  }, [token]);

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'summary': return '📊';
      case 'milestone': return '🤝';
      case 'reflection': return '🧠';
      case 'achievement': return '🏆';
      default: return '📍';
    }
  };

  const getTimelineColors = (type) => {
    switch (type) {
      case 'summary': return 'border-cyan bg-cyan/5 text-cyan';
      case 'milestone': return 'border-accent bg-accent/5 text-accent';
      case 'reflection': return 'border-rose bg-rose/5 text-rose';
      case 'achievement': return 'border-amber bg-amber/5 text-amber';
      default: return 'border-border bg-panel text-text';
    }
  };

  const filteredTimeline = timeline.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const companionName = preferences?.aiName || 'Companion';

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-extrabold font-outfit text-text flex items-center gap-2">
            <History className="w-8 h-8 text-accent animate-pulse" /> Journey Timeline
          </h2>
          <p className="text-muted text-sm mt-0.5">Chronological record of your emotional states, unlocked achievements, and weekly reflections, ${userName}.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 p-1 bg-surface border border-border rounded-xl w-fit">
          {[
            { value: 'all', label: '📍 All History' },
            { value: 'milestone', label: '🤝 Milestones' },
            { value: 'reflection', label: '🧠 Reflections' },
            { value: 'achievement', label: '🏆 Medals' },
            { value: 'summary', label: '📊 Reviews' }
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilterType(btn.value)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition capitalize cursor-pointer ${
                filterType === btn.value ? 'bg-panel text-accent shadow-sm' : 'text-muted hover:text-text'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Timeline body */}
        <div className="max-w-3xl mx-auto pt-4 relative pl-8 border-l-2 border-border/80 space-y-8">
          
          {isLoading ? (
            <div className="py-20 flex justify-center items-center gap-2 ml-4">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <span className="text-muted text-sm font-outfit">Loading milestones list...</span>
            </div>
          ) : filteredTimeline.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredTimeline.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                  className="relative group"
                >
                  {/* Floating Date Marker */}
                  <div className="absolute -left-[45px] top-1.5 w-7 h-7 rounded-full bg-surface border-2 border-border flex items-center justify-center text-xs z-10 shadow-sm group-hover:scale-110 transition duration-300">
                    {getTimelineIcon(item.type)}
                  </div>

                  {/* Card Panel */}
                  <div className={`p-6 rounded-2xl bg-surface border-2 transition duration-300 hover:-translate-y-1 shadow-card space-y-3 ${
                    getTimelineColors(item.type).split(' ')[0]
                  }`}>
                    
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 border-b border-border/40 pb-2.5">
                      <h4 className="font-extrabold text-base text-text">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-muted font-bold flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {new Date(item.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Description text */}
                    <p className="text-muted text-xs leading-relaxed font-semibold">
                      {item.description}
                    </p>

                    {/* Metadata Dropdowns based on item type */}
                    {item.type === 'reflection' && item.meta && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-border/40 text-[11px] leading-relaxed">
                        {item.meta.struggles?.length > 0 && (
                          <div className="p-2.5 bg-rose/5 border border-rose/10 rounded-xl">
                            <span className="font-bold text-rose">⚠️ Challenges Observed:</span>
                            <ul className="list-disc pl-4 mt-1 space-y-0.5 text-muted">
                              {item.meta.struggles.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                            </ul>
                          </div>
                        )}
                        {item.meta.nextWeekGoal && (
                          <div className="p-2.5 bg-emerald/5 border border-emerald/10 rounded-xl">
                            <span className="font-bold text-emerald">🎯 Suggested Action Plan:</span>
                            <p className="mt-1 text-muted font-semibold">{item.meta.nextWeekGoal}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {item.type === 'summary' && item.meta && (
                      <div className="pt-3 border-t border-border/40 text-[11px] space-y-2">
                        {item.meta.keyTopics?.length > 0 && (
                          <div>
                            <span className="font-bold text-cyan">🗣️ Key Focus Areas:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {item.meta.keyTopics.map((topic, tIdx) => (
                                <span key={tIdx} className="px-2 py-0.5 bg-cyan/10 text-cyan rounded border border-cyan/20 capitalize font-bold">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="py-20 text-center bg-surface border border-dashed border-border rounded-2xl flex flex-col items-center justify-center space-y-3 ml-4">
              <Inbox className="w-10 h-10 text-muted" />
              <div className="space-y-1">
                <h3 className="font-bold text-text">Timeline Empty</h3>
                <p className="text-muted text-xs max-w-xs mx-auto">
                  You don't have any timeline events locked yet ra. Check back after chatting with {companionName} or completing goals!
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
