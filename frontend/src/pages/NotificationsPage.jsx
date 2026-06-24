import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationCard from '../components/NotificationCard';
import {
  fetchNotifications,
  markNotificationsRead,
  deleteNotification
} from '../store/notificationSlice';
import {
  Bell,
  Trash2,
  Check,
  CheckSquare,
  AlertCircle,
  Award,
  BookOpen,
  Target,
  Clock,
  Sparkles,
  Inbox,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const user = useSelector((state) => state.auth.user);
  const userName = user ? user.fullName.split(' ')[0] : 'Friend';
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector((state) => state.notification);

  // Pagination & Filters
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
      if (unreadIds.length === 0) {
        toast.success(`All clear! No unread notifications, ${userName}.`);
        return;
      }
      await dispatch(markNotificationsRead(unreadIds)).unwrap();
      toast.success('Marked all as read! Checkmark updated.');
    } catch (e) {
      toast.error('Failed to mark notifications read.');
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await dispatch(markNotificationsRead([id])).unwrap();
      toast.success('Alert marked as read.');
    } catch (e) {
      toast.error('Failed to mark read.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteNotification(id)).unwrap();
      toast.success('Notification removed.');
    } catch (e) {
      toast.error('Failed to delete notification.');
    }
  };

  // Get filtered list
  const filteredList = notifications
    ? notifications.filter((n) => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'read') return n.isRead;
        return true;
      })
    : [];

  // Paginated slices
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'wellness': return <Heart className="w-5 h-5 text-rose" />;
      case 'goal': return <Target className="w-5 h-5 text-accent" />;
      case 'achievement': return <Award className="w-5 h-5 text-amber" />;
      case 'learning': return <BookOpen className="w-5 h-5 text-cyan" />;
      default: return <Bell className="w-5 h-5 text-muted" />;
    }
  };

  const getNotificationBg = (type, isRead) => {
    if (isRead) return 'bg-surface/50 border-border/40 opacity-75';
    switch (type) {
      case 'wellness': return 'bg-rose/5 border-rose/20 hover:bg-rose/10';
      case 'goal': return 'bg-accent/5 border-accent/20 hover:bg-accent/10';
      case 'achievement': return 'bg-amber/5 border-amber/20 hover:bg-amber/10';
      case 'learning': return 'bg-cyan/5 border-cyan/20 hover:bg-cyan/10';
      default: return 'bg-panel border-border/80 hover:bg-panel/90';
    }
  };

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold font-outfit text-text flex items-center gap-2">
              <Bell className="w-8 h-8 text-accent animate-swing" /> Notifications Inbox
            </h2>
            <p className="text-muted text-sm mt-0.5">Stay updated with wellness checkups, goals status, and achievements, ${userName}.</p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2.5 bg-panel border border-border hover:border-accent/40 text-text font-bold rounded-xl flex items-center gap-2 transition cursor-pointer text-xs"
          >
            <CheckSquare className="w-4 h-4 text-accent" /> Mark All Read
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex gap-2 p-1 bg-surface border border-border rounded-xl w-fit">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition capitalize cursor-pointer ${
                filter === f ? 'bg-panel text-accent shadow-sm' : 'text-muted hover:text-text'
              }`}
            >
              {f} ({
                f === 'all' 
                  ? notifications?.length || 0 
                  : f === 'unread' 
                    ? notifications?.filter(n => !n.isRead).length || 0 
                    : notifications?.filter(n => n.isRead).length || 0
              })
            </button>
          ))}
        </div>

        {/* Notifications Grid list */}
        <div className="space-y-4 max-w-4xl">
          {isLoading ? (
            <div className="py-20 flex justify-center items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <span className="text-muted text-sm">Querying inbox logs...</span>
            </div>
          ) : currentItems.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {currentItems.map((item) => (
                  <NotificationCard
                    key={item._id}
                    item={item}
                    getNotificationBg={getNotificationBg}
                    getNotificationIcon={getNotificationIcon}
                    handleMarkSingleRead={handleMarkSingleRead}
                    handleDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center border-t border-border/40 pt-4 mt-6 text-xs font-bold text-muted">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-4 py-2 border border-border hover:border-accent/40 rounded-lg disabled:opacity-50 hover:bg-panel transition cursor-pointer"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 border border-border hover:border-accent/40 rounded-lg disabled:opacity-50 hover:bg-panel transition cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center bg-surface border border-dashed border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
              <Inbox className="w-10 h-10 text-muted" />
              <div className="space-y-1">
                <h3 className="font-bold text-text">Inbox Empty</h3>
                <p className="text-muted text-xs max-w-xs mx-auto">
                  You are all caught up, ${userName}! No active alerts matching: "{filter}" found.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
