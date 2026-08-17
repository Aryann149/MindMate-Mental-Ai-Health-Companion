import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import GlassCard from "../components/ui/GlassCard";
import TrendLineChart from "../components/charts/TrendLineChart";
import { SleepAPI } from "../api/endpoints";

const SleepTracker = () => {
  const [form, setForm] = useState({ bedTime: "23:00", wakeTime: "07:00", quality: 3, notes: "" });
  const [logs, setLogs] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => SleepAPI.list("monthly").then(({ data }) => setLogs(data.sleepLogs));
  useEffect(() => { load(); }, []);

  const submit = async () => {
    setSaving(true);
    try {
      await SleepAPI.create(form);
      toast.success("Sleep logged");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save sleep log");
    } finally {
      setSaving(false);
    }
  };

  const trendData = [...logs].reverse().map((l) => ({ date: l.date, value: l.hours }));

  return (
    <AppLayout title="Sleep Tracker">
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-4">Log Last Night's Sleep</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Bed time</label>
              <input type="time" className="glass-input w-full" value={form.bedTime} onChange={(e) => setForm({ ...form, bedTime: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Wake time</label>
              <input type="time" className="glass-input w-full" value={form.wakeTime} onChange={(e) => setForm({ ...form, wakeTime: e.target.value })} />
            </div>
          </div>
          <label className="text-xs text-slate-400 mb-1 block">Sleep quality</label>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((q) => (
              <button
                key={q}
                onClick={() => setForm({ ...form, quality: q })}
                className={`flex-1 py-2 rounded-lg text-xs border ${form.quality === q ? "bg-lavender-500/20 border-lavender-500/40 text-lavender-200" : "bg-white/5 border-white/10 text-slate-400"}`}
              >
                {["Poor", "Fair", "Okay", "Good", "Great"][q - 1]}
              </button>
            ))}
          </div>
          <textarea
            className="glass-input w-full resize-none mb-4"
            rows={2}
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <button onClick={submit} disabled={saving} className="btn-primary w-full">
            {saving ? "Saving..." : "Log sleep"}
          </button>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-3">Sleep Hours Trend</p>
          <TrendLineChart data={trendData} label="Hours" color="#A78BFA" suggestedMax={12} />
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default SleepTracker;
