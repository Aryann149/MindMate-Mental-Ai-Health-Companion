import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Check, Trash2, Award } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import GlassCard from "../components/ui/GlassCard";
import { HabitAPI } from "../api/endpoints";

const ICONS = ["✅", "💧", "📖", "🧘", "🏃", "🥗", "😴", "🙏"];

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("✅");
  const [adding, setAdding] = useState(false);

  const load = () => HabitAPI.list().then(({ data }) => setHabits(data.habits));
  useEffect(() => { load(); }, []);

  const addHabit = async () => {
    if (!name.trim()) return;
    setAdding(true);
    try {
      await HabitAPI.create({ name, icon });
      setName("");
      toast.success("Habit added");
      load();
    } finally {
      setAdding(false);
    }
  };

  const toggle = async (id) => {
    await HabitAPI.toggle(id);
    load();
  };

  const remove = async (id) => {
    await HabitAPI.archive(id);
    toast.success("Habit archived");
    load();
  };

  const todayKey = new Date().toDateString();
  const isCompletedToday = (habit) =>
    habit.completions?.some((c) => new Date(c.date).toDateString() === todayKey && c.completed);

  return (
    <AppLayout title="Habit Tracker">
      <GlassCard className="mb-6">
        <p className="text-sm font-semibold text-slate-200 mb-3">Add a new habit</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {ICONS.map((i) => (
            <button
              key={i}
              onClick={() => setIcon(i)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center border ${icon === i ? "bg-lavender-500/20 border-lavender-500/40" : "bg-white/5 border-white/10"}`}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="glass-input flex-1" placeholder="e.g. Drink water first thing, 10 min stretch..." value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={addHabit} disabled={adding} className="btn-primary !px-4"><Plus size={16} /></button>
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((h) => {
          const done = isCompletedToday(h);
          return (
            <GlassCard key={h._id} hover className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{h.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{h.name}</p>
                    <p className="text-[11px] text-slate-500">🔥 {h.currentStreak}d streak · best {h.longestStreak}d</p>
                  </div>
                </div>
                <button onClick={() => remove(h._id)} className="text-slate-600 hover:text-coral-400">
                  <Trash2 size={15} />
                </button>
              </div>

              {h.achievements?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {h.achievements.map((a, i) => (
                    <span key={i} className="text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full bg-mint-500/10 text-mint-300 border border-mint-500/20">
                      <Award size={10} /> {a.title}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => toggle(h._id)}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  done ? "bg-mint-500/20 border-mint-500/40 text-mint-300" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                }`}
              >
                <Check size={14} /> {done ? "Completed today" : "Mark done today"}
              </button>
            </GlassCard>
          );
        })}
        {!habits.length && <p className="text-sm text-slate-500 col-span-full">No habits yet — add your first one above.</p>}
      </div>
    </AppLayout>
  );
};

export default HabitTracker;
