import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Smile, BookOpen, Moon, Activity, Dumbbell,
  Droplets, CheckSquare, BarChart3, Settings, ShieldCheck, Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mood", label: "Mood Tracker", icon: Smile },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/sleep", label: "Sleep", icon: Moon },
  { to: "/stress", label: "Stress", icon: Activity },
  { to: "/exercise", label: "Exercise", icon: Dumbbell },
  { to: "/water", label: "Water Intake", icon: Droplets },
  { to: "/habits", label: "Habits", icon: CheckSquare },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

const Sidebar = () => {
  const { isAdmin } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-white/10 bg-base-950/60 backdrop-blur-xl px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-lavender-500 to-mint-400 flex items-center justify-center">
          <Sparkles size={18} className="text-base-950" />
        </div>
        <div>
          <p className="font-display font-bold text-slate-100 leading-tight">MindMate</p>
          <p className="text-[10px] text-slate-500 leading-tight">Wellness Companion</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-lavender-500/15 text-lavender-200 border border-lavender-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
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
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mt-2 transition-colors ${
                isActive
                  ? "bg-coral-500/15 text-coral-300 border border-coral-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
              }`
            }
          >
            <ShieldCheck size={17} />
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="text-[11px] text-slate-600 px-2 pt-4 border-t border-white/5">
        General wellness support only — not a substitute for therapy.
      </div>
    </aside>
  );
};

export default Sidebar;
