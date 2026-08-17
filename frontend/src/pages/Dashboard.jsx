import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Smile, Moon, Activity, Flame, Droplets, AlertTriangle } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import GlassCard from "../components/ui/GlassCard";
import StatPill from "../components/ui/StatPill";
import TrendLineChart from "../components/charts/TrendLineChart";
import { AnalyticsAPI } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

const FLAG_LABELS = {
  poor_sleep: "Sleep has been below your target lately",
  negative_mood_streak: "A few low-mood days in a row",
  high_stress: "Stress levels have been elevated",
  missed_habits: "Habit streaks have slipped this week",
  late_sleeping: "Bedtimes have been quite late",
};

const Dashboard = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState("weekly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    AnalyticsAPI.dashboard(period)
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <AppLayout title="Dashboard">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="label-eyebrow">Hi {user?.name?.split(" ")[0]},</p>
          <h2 className="text-xl font-display font-semibold text-slate-100">Here's your wellness overview</h2>
        </div>
        <div className="flex gap-2">
          {["weekly", "monthly", "yearly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                period === p ? "bg-lavender-500/20 text-lavender-200 border border-lavender-500/30" : "bg-white/5 text-slate-400 border border-white/10"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {data?.summary?.flags?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card mb-6 p-4 border-coral-500/30 bg-coral-500/5 flex gap-3 items-start"
        >
          <AlertTriangle size={18} className="text-coral-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-coral-300 mb-1">A few patterns worth noticing</p>
            <ul className="text-xs text-slate-400 space-y-0.5">
              {data.summary.flags.map((f) => <li key={f}>• {FLAG_LABELS[f] || f}</li>)}
            </ul>
            <p className="text-[11px] text-slate-600 mt-2">
              These are general wellness observations, not a diagnosis. Check the Analytics tab for a full weekly summary.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatPill icon={Smile} label="Avg Mood" value={data?.summary?.avgMood ? `${data.summary.avgMood.toFixed(1)}/10` : "—"} accent="bloom" />
        <StatPill icon={Activity} label="Avg Stress" value={data?.summary?.avgStress ? `${data.summary.avgStress.toFixed(1)}/10` : "—"} accent="coral" />
        <StatPill icon={Moon} label="Avg Sleep" value={data?.summary?.avgSleepHours ? `${data.summary.avgSleepHours.toFixed(1)}h` : "—"} accent="lavender" />
        <StatPill icon={Flame} label="Current Streak" value={`${data?.summary?.currentStreak ?? 0} days`} accent="mint" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <GlassCard className="lg:col-span-1">
          <p className="text-sm font-semibold text-slate-200 mb-3">Mood Trend</p>
          <TrendLineChart data={data?.trends?.mood || []} label="Mood" color="#F472B6" suggestedMax={10} height={180} />
        </GlassCard>
        <GlassCard className="lg:col-span-1">
          <p className="text-sm font-semibold text-slate-200 mb-3">Stress Trend</p>
          <TrendLineChart data={data?.trends?.stress || []} label="Stress" color="#FB923C" suggestedMax={10} height={180} />
        </GlassCard>
        <GlassCard className="lg:col-span-1">
          <p className="text-sm font-semibold text-slate-200 mb-3">Sleep Trend</p>
          <TrendLineChart data={data?.trends?.sleep || []} label="Sleep (hrs)" color="#A78BFA" suggestedMax={12} height={180} />
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-4">Habit Streaks</p>
          {!data?.habits?.length ? (
            <p className="text-sm text-slate-500">No habits tracked yet. Add one from the Habits tab.</p>
          ) : (
            <div className="space-y-3">
              {data.habits.map((h) => (
                <div key={h.id} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300 flex items-center gap-2">
                    <span>{h.icon}</span> {h.name}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-mint-500/10 text-mint-300 border border-mint-500/20">
                    🔥 {h.currentStreak}d
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-4">This Period</p>
          <div className="grid grid-cols-2 gap-4">
            <StatPill icon={Droplets} label="Water Glasses" value={data?.summary?.totalWaterGlasses ?? 0} accent="mint" />
            <StatPill icon={Activity} label="Exercise Minutes" value={data?.summary?.totalExerciseMinutes ?? 0} accent="lavender" />
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
