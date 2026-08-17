import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Sparkles, HeartHandshake, Phone } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import GlassCard from "../components/ui/GlassCard";
import { AnalyticsAPI } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

const FLAG_LABELS = {
  poor_sleep: "Poor sleep pattern",
  negative_mood_streak: "Negative mood streak",
  high_stress: "High stress levels",
  missed_habits: "Missed habits",
  late_sleeping: "Late sleeping",
};

const Analytics = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [severeRisk, setSevereRisk] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await AnalyticsAPI.weeklySummary();
      setSummary(data.summary);
      setSevereRisk(data.severeRiskDetected);
    } catch (err) {
      toast.error("Could not generate weekly summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const showEmergencyPrompt = severeRisk && user?.emergencySupport?.enabled;

  return (
    <AppLayout title="Analytics & Insights">
      {showEmergencyPrompt && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card mb-6 p-5 border-coral-500/40 bg-coral-500/5">
          <div className="flex items-start gap-3">
            <HeartHandshake className="text-coral-400 shrink-0" size={22} />
            <div>
              <p className="text-sm font-semibold text-coral-300 mb-1">It looks like things have been tough lately</p>
              <p className="text-xs text-slate-400 mb-3">
                A few patterns across your recent entries suggest you might be going through a difficult stretch.
                MindMate isn't a substitute for professional support — please consider reaching out to someone you trust or a mental health professional.
              </p>
              {user.emergencySupport.trustedContacts?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {user.emergencySupport.trustedContacts.map((c) => (
                    <span key={c._id} className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      <Phone size={12} /> {c.name} {c.phone ? `· ${c.phone}` : ""}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-slate-500">
                In a crisis, please contact your local emergency number or a crisis helpline right away.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <GlassCard className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-lavender-300" />
          <p className="text-sm font-semibold text-slate-200">AI Weekly Summary</p>
        </div>
        {loading ? (
          <p className="text-sm text-slate-500">Generating your weekly summary...</p>
        ) : (
          <>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {summary?.aiSummaryText || "Not enough data yet this week to generate a summary — log a few more entries."}
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <p className="text-xl font-display font-bold text-bloom-300">{summary?.avgMood ?? "—"}</p>
                <p className="text-[10px] text-slate-500">Avg Mood</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-display font-bold text-coral-400">{summary?.avgStress ?? "—"}</p>
                <p className="text-[10px] text-slate-500">Avg Stress</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-display font-bold text-lavender-300">{summary?.avgSleepHours ?? "—"}</p>
                <p className="text-[10px] text-slate-500">Avg Sleep (hrs)</p>
              </div>
            </div>
            {summary?.flags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {summary.flags.map((f) => (
                  <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-coral-500/10 text-coral-300 border border-coral-500/20">
                    {FLAG_LABELS[f] || f}
                  </span>
                ))}
              </div>
            )}
            <p className="text-[11px] text-slate-600 mt-4 italic">
              This summary reflects general wellness patterns only and is not a medical assessment.
            </p>
          </>
        )}
      </GlassCard>
    </AppLayout>
  );
};

export default Analytics;
