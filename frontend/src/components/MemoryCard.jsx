import React from 'react';
import { motion } from 'framer-motion';
import { Pin, Edit3, Tag, Trash2 } from 'lucide-react';

export default function MemoryCard({
  mem,
  handleTogglePin,
  handleOpenEditModal,
  handleDelete,
  getCategoryEmoji,
  selectedTag,
  setSelectedTag
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-5 rounded-2xl bg-surface border border-border hover:border-emerald/40 shadow-card flex flex-col justify-between relative group"
    >
      <div className="space-y-3">
        {/* Meta header */}
        <div className="flex justify-between items-start gap-2">
          <span className="text-xs font-bold bg-panel border border-border px-2.5 py-0.5 rounded-full capitalize">
            {getCategoryEmoji(mem.category)} {mem.category}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleTogglePin(mem)}
              className={`p-1.5 rounded-lg border border-border hover:bg-panel transition cursor-pointer ${
                mem.isPinned ? 'text-amber border-amber/20 bg-amber/10' : 'text-muted hover:text-text'
              }`}
              title={mem.isPinned ? 'Unstar memory' : 'Star memory'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleOpenEditModal(mem)}
              className="p-1.5 text-muted hover:text-text hover:bg-panel border border-border rounded-lg transition opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Edit Memory"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Memory Text */}
        <p className="text-text text-xs leading-relaxed font-semibold text-left">
          {mem.memory}
        </p>

        {/* Tags */}
        {mem.tags && mem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {mem.tags.map((tag) => (
              <span
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1 cursor-pointer transition capitalize ${
                  selectedTag === tag
                    ? 'bg-emerald/20 border-emerald text-emerald font-bold'
                    : 'bg-panel border-border text-muted hover:text-text'
                }`}
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center border-t border-border/40 mt-4 pt-3 text-[10px] text-muted font-bold">
        <span>Source: {mem.source === 'auto' ? '🧠 AI Autologged' : '✍️ Manual'}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDelete(mem._id)}
            className="p-1.5 text-muted hover:text-rose hover:bg-rose/10 rounded-md transition opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Forget Memory"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <span>{new Date(mem.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
}