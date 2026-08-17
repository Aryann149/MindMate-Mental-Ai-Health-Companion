import { useEffect, useRef, useState } from "react";
import { Bell, LogOut, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { NotificationAPI } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";

const Topbar = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const loadNotifications = async () => {
    try {
      const { data } = await NotificationAPI.list();
      setNotifications(data.notifications);
      setUnread(data.unreadCount);
    } catch {
      /* silent — notifications are non-critical */
    }
  };

  useEffect(() => {
    loadNotifications();
    const id = setInterval(loadNotifications, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const markAllRead = async () => {
    await NotificationAPI.markAllRead();
    loadNotifications();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-4 border-b border-white/5 bg-base-900/70 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-slate-300">
          <Menu size={22} />
        </button>
        <h1 className="font-display text-lg font-semibold text-slate-100">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative p-2 rounded-xl hover:bg-white/5 text-slate-300"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-bloom-500 text-[10px] flex items-center justify-center text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto glass-card p-3 shadow-glass"
              >
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="text-sm font-semibold text-slate-200">Notifications</p>
                  <button onClick={markAllRead} className="text-xs text-lavender-300 hover:underline">
                    Mark all read
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 px-1 py-4 text-center">You're all caught up.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`px-3 py-2 rounded-lg text-xs ${n.isRead ? "text-slate-500" : "text-slate-200 bg-white/5"}`}
                      >
                        <p className="font-medium">{n.title}</p>
                        <p className="text-slate-500">{n.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lavender-400 to-bloom-400 flex items-center justify-center text-xs font-semibold text-base-950">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="hidden md:block text-sm text-slate-300">{user?.name}</span>
        </div>

        <button
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-coral-400 transition-colors"
          aria-label="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
