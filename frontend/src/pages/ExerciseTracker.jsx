import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import GlassCard from "../components/ui/GlassCard";
import { ExerciseAPI } from "../api/endpoints";

const TYPES = [
  { key: "meditation", label: "Meditation", icon: "🧘" },
  { key: "walking", label: "Walking", icon: "🚶" },
  { key: "workout", label: "Workout", icon: "🏋️" },
  { key: "breathing", label: "Breathing", icon: "🌬️" },
  { key: "yoga", label: "Yoga", icon: "🤸" },
  { key: "other", label: "Other", icon: "✨" },
];

const ExerciseTracker = () => {
  const [type, setType] = useState("meditation");
  const [duration, setDuration] = useState(10);
  const [intensity, setIntensity] = useState("moderate");
  const [logs, setLogs] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => ExerciseAPI.list("weekly").then(({ data }) => setLogs(data.exerciseLogs));
  useEffect(() => { load(); }, []);

  const submit = async () => {
    setSaving(true);
    try {
      await ExerciseAPI.create({ type, durationMinutes: duration, intensity });
      toast.success("Activity logged");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save activity");
    } finally {
      setSaving(false);
    }
  };

  const totalMinutes = logs.reduce((s, l) => s + l.durationMinutes, 0);

  return (
    <AppLayout title="Exercise & Mindfulness">
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-4">Log an activity</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => setType(t.key)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs ${type === t.key ? "bg-lavender-500/20 border-lavender-500/40 text-lavender-200" : "bg-white/5 border-white/10 text-slate-400"}`}
              >
                <span className="text-lg">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <label className="text-xs text-slate-400 mb-1 block">Duration (minutes)</label>
          <input type="number" min={0} className="glass-input w-full mb-4" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />

          <label className="text-xs text-slate-400 mb-1 block">Intensity</label>
          <div className="flex gap-2 mb-4">
            {["low", "moderate", "high"].map((i) => (
              <button key={i} onClick={() => setIntensity(i)} className={`flex-1 py-2 rounded-lg text-xs capitalize border ${intensity === i ? "bg-mint-500/20 border-mint-500/40 text-mint-300" : "bg-white/5 border-white/10 text-slate-400"}`}>
                {i}
              </button>
            ))}
          </div>

          <button onClick={submit} disabled={saving} className="btn-primary w-full">{saving ? "Saving..." : "Log activity"}</button>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-1">This week</p>
          <p className="text-3xl font-display font-bold text-mint-300 mb-4">{totalMinutes} min</p>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {logs.map((l) => (
              <div key={l._id} className="flex justify-between text-sm border-b border-white/5 pb-2">
                <span className="text-slate-300 capitalize">{l.type} · {l.durationMinutes}min</span>
                <span className="text-[10px] text-slate-600">{new Date(l.date).toLocaleDateString()}</span>
              </div>
            ))}
            {!logs.length && <p className="text-sm text-slate-500">No activity logged this week.</p>}
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default ExerciseTracker;
