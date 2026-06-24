import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import {
  BookOpen,
  Plus,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Inbox,
  ArrowRight,
  UserCheck,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function WeeklyReflectionPage() {
  const user = useSelector((state) => state.auth.user);
  const userName = user ? user.fullName.split(' ')[0] : 'Friend';
  const token = useSelector((state) => state.auth.token);
  const preferences = useSelector((state) => state.settings.preferences);

  // States
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [week, setWeek] = useState('');
  const [achievements, setAchievements] = useState('');
  const [struggles, setStruggles] = useState('');
  const [lessons, setLessons] = useState('');
  const [nextWeekGoal, setNextWeekGoal] = useState('');

  // Auto-generate current week indicator (e.g., "2026-W24")
  const getYearAndWeek = () => {
    const currentdate = new Date();
    const oneJan = new Date(currentdate.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    const resultWeek = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
    return `${currentdate.getFullYear()}-W${resultWeek.toString().padStart(2, '0')}`;
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/weekly-reflection/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data.history || []);
    } catch (e) {
      toast.error('Failed to load reflection history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
      setWeek(getYearAndWeek());
    }
  }, [token]);

  const handleSubmitReflection = async (e) => {
    e.preventDefault();
    if (!week) {
      toast.error('Week indicator is required!');
      return;
    }

    setIsSaving(true);
    try {
      await axios.post('/api/weekly-reflection', {
        week,
        achievements,
        struggles,
        lessons,
        nextWeekGoal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Reflection logged! Your AI is analyzing your progress... ✨');
      setShowAddForm(false);
      resetForm();
      fetchHistory();
    } catch (err) {
      toast.error('Failed to log reflection.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setWeek(getYearAndWeek());
    setAchievements('');
    setStruggles('');
    setLessons('');
    setNextWeekGoal('');
  };

  const companionName = preferences?.aiName || 'Companion';

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold font-outfit text-text flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-rose animate-pulse" /> Weekly Reflection
            </h2>
            <p className="text-muted text-sm mt-0.5">Track your weekly challenges, celebrate successes, and get companion feedback, ${userName}.</p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="px-5 py-3 bg-rose text-white font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition shadow-card cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" /> Log Reflection
          </button>
        </div>

        {/* List of past reflections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full py-20 flex justify-center items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-rose" />
              <span className="text-muted text-sm font-outfit">Retrieving past reflections...</span>
            </div>
          ) : history.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {history.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 rounded-2xl bg-surface border border-border hover:border-rose/30 shadow-card flex flex-col justify-between space-y-4"
                >
                  {/* Title & Week */}
                  <div className="flex justify-between items-center border-b border-border/40 pb-3">
                    <span className="text-xs font-bold text-rose px-2.5 py-0.5 bg-rose/10 border border-rose/20 rounded-full">
                      Week: {item.week}
                    </span>
                    <span className="text-[10px] text-muted font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-xs text-text">
                    {item.achievements && (
                      <div>
                        <span className="font-extrabold text-[10px] text-emerald uppercase block tracking-wider">🌟 Achievements</span>
                        <p className="mt-1 font-semibold text-muted leading-relaxed pl-2.5 border-l-2 border-emerald/40">{item.achievements}</p>
                      </div>
                    )}
                    {item.struggles && (
                      <div>
                        <span className="font-extrabold text-[10px] text-rose uppercase block tracking-wider">⚠️ Challenges / Struggles</span>
                        <p className="mt-1 font-semibold text-muted leading-relaxed pl-2.5 border-l-2 border-rose/40">{item.struggles}</p>
                      </div>
                    )}
                    {item.lessons && (
                      <div>
                        <span className="font-extrabold text-[10px] text-cyan uppercase block tracking-wider">💡 Lessons Learned</span>
                        <p className="mt-1 font-semibold text-muted leading-relaxed pl-2.5 border-l-2 border-cyan/40">{item.lessons}</p>
                      </div>
                    )}
                    {item.nextWeekGoal && (
                      <div>
                        <span className="font-extrabold text-[10px] text-amber uppercase block tracking-wider">🎯 Goal for Next Week</span>
                        <p className="mt-1 font-semibold text-muted leading-relaxed pl-2.5 border-l-2 border-amber/40">{item.nextWeekGoal}</p>
                      </div>
                    )}
                  </div>

                  {/* AI Feedback */}
                  {item.aiSummary && (
                    <div className="p-4 bg-rose/5 border border-rose/20 rounded-xl space-y-1 mt-2">
                      <span className="text-[9px] font-bold text-rose uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-rose animate-pulse" /> Feedback from {companionName}
                      </span>
                      <p className="text-xs text-text leading-relaxed font-semibold">
                        {item.aiSummary}
                      </p>
                    </div>
                  )}

                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full py-20 text-center bg-surface border border-dashed border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
              <Inbox className="w-10 h-10 text-muted" />
              <div className="space-y-1">
                <h3 className="font-bold text-text">No Weekly Reflections</h3>
                <p className="text-muted text-xs max-w-xs mx-auto">
                  Take a moment to reflect on your week, ${userName}. Log achievements, obstacles, and lessons to align with {companionName}.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ADD/LOG FORM MODAL */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-card overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-border/40">
                <h3 className="text-lg font-bold font-outfit text-text flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-rose" /> Log Weekly Progress
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1.5 text-muted hover:text-text rounded-lg hover:bg-panel transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReflection} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted font-outfit">Target Week *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026-W24"
                    value={week}
                    onChange={(e) => setWeek(e.target.value)}
                    className="w-full px-4 py-3 bg-panel border border-border rounded-xl text-sm focus:border-rose outline-none text-text"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted font-outfit font-semibold">Weekly Achievements (What went well?)</label>
                  <textarea
                    placeholder={`List projects completed, goals crushed, habits kept, ${userName}...`}
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    className="w-full px-4 py-3 bg-panel border border-border rounded-xl text-sm focus:border-rose outline-none min-h-[70px] text-text"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted font-outfit">Weekly Struggles / Challenges</label>
                  <textarea
                    placeholder="List roadblocks, down times, or distractions faced..."
                    value={struggles}
                    onChange={(e) => setStruggles(e.target.value)}
                    className="w-full px-4 py-3 bg-panel border border-border rounded-xl text-sm focus:border-rose outline-none min-h-[70px] text-text"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted font-outfit font-semibold">Lessons Learned</label>
                  <textarea
                    placeholder="What did these wins or failures teach you?"
                    value={lessons}
                    onChange={(e) => setLessons(e.target.value)}
                    className="w-full px-4 py-3 bg-panel border border-border rounded-xl text-sm focus:border-rose outline-none min-h-[70px] text-text"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted font-outfit">Main Goal for Next Week</label>
                  <input
                    type="text"
                    placeholder="e.g. Finish docker pipeline integration; limit screen time to 3 hrs"
                    value={nextWeekGoal}
                    onChange={(e) => setNextWeekGoal(e.target.value)}
                    className="w-full px-4 py-3 bg-panel border border-border rounded-xl text-sm focus:border-rose outline-none text-text"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-3 border border-border text-muted font-bold rounded-xl text-sm hover:bg-panel transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-rose text-white font-bold rounded-xl text-sm hover:opacity-90 transition cursor-pointer flex items-center gap-1.5"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                      </>
                    ) : (
                      <>
                        Submit Reflection <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
