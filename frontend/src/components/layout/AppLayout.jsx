import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { X, Sparkles, LayoutDashboard, Smile, BookOpen, Moon, Activity, Dumbbell, Droplets, CheckSquare, BarChart3, Settings as SettingsIcon, ShieldCheck } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import FloatingChat from "../chat/FloatingChat";
import { useAuth } from "../../context/AuthContext";

const mobileNavItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mood", label: "Mood Tracker", icon: Smile },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/sleep", label: "Sleep", icon: Moon },
  { to: "/stress", label: "Stress", icon: Activity },
  { to: "/exercise", label: "Exercise", icon: Dumbbell },
  { to: "/water", label: "Water Intake", icon: Droplets },
  { to: "/habits", label: "Habits", icon: CheckSquare },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

// Mobile drawer mirrors Sidebar's nav, since Sidebar itself is hidden below `lg`.
const MobileSidebar = ({ open, onClose }) => {
  const { isAdmin } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-0 top-0 h-full w-72 bg-base-950 z-50 lg:hidden p-4 border-r border-white/10 overflow-y-auto"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 24 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-lavender-500 to-mint-400 flex items-center justify-center">
                  <Sparkles size={16} className="text-base-950" />
                </div>
                <p className="font-display font-bold text-slate-100">MindMate</p>
              </div>
              <button onClick={onClose} className="text-slate-400"><X size={20} /></button>
            </div>

            <nav className="flex flex-col gap-1" onClick={onClose}>
              {mobileNavItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                      isActive ? "bg-lavender-500/15 text-lavender-200" : "text-slate-400 hover:bg-white/5"
                    }`
                  }
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mt-2 ${
                      isActive ? "bg-coral-500/15 text-coral-300" : "text-slate-400 hover:bg-white/5"
                    }`
                  }
                >
                  <ShieldCheck size={17} />
                  Admin Panel
                </NavLink>
              )}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const AppLayout = ({ children, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-base-900">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="flex-1 px-4 lg:px-8 py-6">
          {children}
        </main>
      </div>

      <FloatingChat />
    </div>
  );
};

export default AppLayout;
