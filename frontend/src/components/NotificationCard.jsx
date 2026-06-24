import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, Trash2 } from 'lucide-react';

export default function NotificationCard({
  item,
  getNotificationBg,
  getNotificationIcon,
  handleMarkSingleRead,
  handleDelete
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 15 }}
      className={`p-4 rounded-xl border flex justify-between items-center gap-4 transition duration-300 relative overflow-hidden group ${getNotificationBg(
        item.type,
        item.isRead
      )}`}
    >
      {/* Left Icon and Text Details */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <div className="p-2.5 bg-bg border border-border rounded-xl flex-shrink-0">
          {getNotificationIcon(item.type)}
        </div>

        <div className="space-y-1 pr-4 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`text-sm font-bold truncate ${item.isRead ? 'text-muted font-semibold' : 'text-text'}`}>
              {item.title}
            </h4>
            {!item.isRead && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping inline-block" />
            )}
          </div>
          <p className="text-muted text-xs leading-relaxed font-medium">
            {item.message}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-muted font-bold">
            <Clock className="w-3 h-3" />
            <span>
              {new Date(item.createdAt).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons (swipe overlay mockup / remove triggers) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition duration-300">
        {!item.isRead && (
          <button
            onClick={() => handleMarkSingleRead(item._id)}
            className="p-2 text-muted hover:text-accent hover:bg-panel border border-border rounded-lg transition cursor-pointer"
            title="Mark Read"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => handleDelete(item._id)}
          className="p-2 text-muted hover:text-rose hover:bg-rose/10 border border-border hover:border-rose/20 rounded-lg transition cursor-pointer"
          title="Remove Notification"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}