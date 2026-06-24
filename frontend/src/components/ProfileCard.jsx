import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';
import AIAvatar from './AIAvatar';

export default function ProfileCard({
  profileEmoji,
  setProfileEmoji,
  showEmojiSelector,
  setShowEmojiSelector,
  emojis,
  showEditName,
  setShowEditName,
  fullName,
  setFullName,
  handleUpdateName,
  preferences,
  user,
  stats,
  className = ''
}) {
  return (
    <div className={`p-6 rounded-2xl bg-surface border border-border shadow-card text-center space-y-4 relative overflow-hidden flex flex-col justify-center ${className}`}>
      {/* Floating decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

      {/* Avatar with Hover Edit Overlay */}
      <div className="relative w-24 h-24 mx-auto group cursor-pointer">
        <div className="w-24 h-24 rounded-full bg-accent text-white flex items-center justify-center text-4xl shadow-md border-2 border-border/80 group-hover:opacity-80 transition duration-300">
          {profileEmoji}
        </div>
        {/* Photo Edit Overlay */}
        <div
          onClick={() => setShowEmojiSelector(!showEmojiSelector)}
          className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
        >
          <Camera className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Emoji Dropdown */}
      <AnimatePresence>
        {showEmojiSelector && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-3 bg-panel border border-border rounded-xl grid grid-cols-6 gap-2 w-fit mx-auto relative z-20"
          >
            {emojis.map((em) => (
              <button
                key={em}
                onClick={() => { setProfileEmoji(em); setShowEmojiSelector(false); }}
                className="text-lg hover:scale-125 transition cursor-pointer"
              >
                {em}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1">
        {showEditName ? (
          <form onSubmit={handleUpdateName} className="flex gap-2 justify-center max-w-xs mx-auto">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="px-3 py-1.5 bg-panel border border-border rounded-lg text-xs focus:border-accent outline-none text-text w-full text-center"
            />
            <button type="submit" className="px-3 py-1 bg-accent text-white rounded-lg text-xs font-bold hover:opacity-90">
              Save
            </button>
          </form>
        ) : (
          <h3 className="text-xl font-bold font-outfit text-text flex items-center justify-center gap-1.5">
            {preferences?.userNickname || user?.fullName || 'Companion user'}{' '}
            <button
              onClick={() => setShowEditName(true)}
              className="text-[10px] text-accent hover:underline font-semibold"
            >
              (Edit)
            </button>
          </h3>
        )}
        <p className="text-muted text-xs">Email: {user?.email}</p>
      </div>

      {/* Connection facts */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/40 text-left">
        <div className="p-3 bg-panel/40 border border-border rounded-xl">
          <span className="block text-[10px] font-bold text-muted uppercase">Bond score</span>
          <span className="text-lg font-black text-text font-outfit">
            🤝 {stats?.trustScore || 10}%
          </span>
        </div>
        <div className="p-3 bg-panel/40 border border-border rounded-xl">
          <span className="block text-[10px] font-bold text-muted uppercase">Companion</span>
          <span className="text-sm font-bold text-accent truncate flex items-center gap-1.5 mt-0.5">
            <AIAvatar size="w-4 h-4" status={null} ringColor="" /> {preferences?.aiName || 'Companion'}
          </span>
        </div>
      </div>
    </div>
  );
}