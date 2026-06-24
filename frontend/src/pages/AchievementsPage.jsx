import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import AchievementCard from '../components/AchievementCard';
import { fetchAchievements } from '../store/goalSlice';
import { Award, Trophy, Star, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function AchievementsPage() {
  const user = useSelector((state) => state.auth.user);
  const userName = user ? user.fullName.split(' ')[0] : 'Friend';
  const dispatch = useDispatch();
  const { achievements, isLoading } = useSelector((state) => state.goal);

  useEffect(() => {
    dispatch(fetchAchievements());
  }, [dispatch]);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'career': return 'text-cyan bg-cyan/10 border-cyan/20';
      case 'health': return 'text-rose bg-rose/10 border-rose/20';
      case 'learning': return 'text-amber bg-amber/10 border-amber/20';
      case 'finance': return 'text-emerald bg-emerald/10 border-emerald/20';
      default: return 'text-accent bg-accent/10 border-accent/20';
    }
  };

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-extrabold font-outfit text-text flex items-center gap-2">
            <Trophy className="w-8 h-8 text-amber animate-pulse" /> Achievements Vault
          </h2>
          <p className="text-muted text-sm mt-0.5">Unlocked milestones and badges earned during your productive journey, ${userName}.</p>
        </div>

        {/* Analytics Counter */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-card flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-left space-y-1">
            <h3 className="text-xl font-extrabold font-outfit text-text">Achievements Scoreboard</h3>
            <p className="text-muted text-xs">Your AI automatically unlocks achievements whenever you complete 100% of your roadmap goals.</p>
          </div>
          <div className="flex items-center gap-2 bg-amber/10 border border-amber/20 px-6 py-3 rounded-2xl text-amber">
            <Award className="w-6 h-6 text-amber animate-spin-slow" />
            <div>
              <span className="block text-2xl font-black font-outfit leading-none">{achievements?.length || 0}</span>
              <span className="text-[9px] font-bold text-muted uppercase">Badges Earned</span>
            </div>
          </div>
        </div>

        {/* Grid List */}
        {isLoading ? (
          <div className="py-20 flex justify-center items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber" />
            <span className="text-muted text-sm">Querying achievements locker...</span>
          </div>
        ) : achievements && achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((item, idx) => (
              <AchievementCard
                key={item._id}
                item={item}
                idx={idx}
                getCategoryColor={getCategoryColor}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-surface border border-dashed border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
            <AlertCircle className="w-10 h-10 text-muted" />
            <div className="space-y-1">
              <h3 className="font-bold text-text">No Achievements Yet</h3>
              <p className="text-muted text-xs max-w-xs mx-auto">
                No medals unlocked yet, ${userName}. Set a new goal, list steps, check them all off, and Your AI will hand you your first badge!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
