import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import GlassCard from "../components/ui/GlassCard";
import TrendLineChart from "../components/charts/TrendLineChart";
import { StressAPI } from "../api/endpoints";

const COMMON_TRIGGERS = ["work", "academics", "relationships", "finances", "health", "deadlines", "social", "family"];

const StressTracker = () => {
  const [level, setLevel] = useState(5);
  const [triggers, setTriggers] = useState([]);
  const [causeNotes, setCauseNotes] = useState("");
  const [logs, setLogs] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => StressAPI.list("monthly").then(({ data }) => setLogs(data.stressLogs));
  useEffect(() => { load(); }, []);

  const toggleTrigger = (t) => setTriggers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const submit = async () => {
    setSaving(true);
    try {
      await StressAPI.create({ level, triggers, causeNotes });
      toast.success("Stress level logged");
      setCauseNotes(""); setTriggers([]);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save entry");
    } finally {
      setSaving(false);
    }
  };

  const trendData = [...logs].reverse().map((l) => ({ date: l.date, value: l.level }));

  return (
    <AppLayout title="Stress Tracker">
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-4">Rate your current stress</p>
          <input type="range" min={1} max={10} value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full accent-coral-500 mb-2" />
          <div className="flex justify-between text-[10px] text-slate-500 mb-4">
            <span>Relaxed</span><span className="text-slate-300">{level}/10</span><span>Overwhelmed</span>
          </div>

          <p className="text-xs text-slate-400 mb-2">Triggers (optional)</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {COMMON_TRIGGERS.map((t) => (
              <button
                key={t}
                onClick={() => toggleTrigger(t)}
                className={`text-xs px-2.5 py-1 rounded-full border ${triggers.includes(t) ? "bg-coral-500/20 border-coral-500/40 text-coral-300" : "bg-white/5 border-white/10 text-slate-400"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <textarea className="glass-input w-full resize-none mb-4" rows={3} placeholder="What's causing this stress?" value={causeNotes} onChange={(e) => setCauseNotes(e.target.value)} />
          <button onClick={submit} disabled={saving} className="btn-primary w-full">{saving ? "Saving..." : "Log stress"}</button>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-3">Stress Trend</p>
          <TrendLineChart data={trendData} label="Stress" color="#FB923C" suggestedMax={10} />
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default StressTracker;
