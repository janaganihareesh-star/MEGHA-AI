import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bell, User, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { notifications } = useSelector((state) => state.notification);

  const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;

  return (
    <header className="h-16 border-b border-border bg-surface flex justify-between items-center px-6 z-20 sticky top-0">
      <div className="flex items-center gap-2 font-bold text-lg text-text">
        <span>Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* Notifications Icon */}
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 hover:bg-panel rounded-xl text-muted hover:text-text transition relative cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-rose text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 p-1.5 hover:bg-panel rounded-xl transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
            {user ? user.fullName[0].toUpperCase() : 'U'}
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-text">
            {user ? user.fullName.split(' ')[0] : 'User'}
          </span>
        </button>
      </div>
    </header>
  );
}