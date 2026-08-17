import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Droplets, Plus } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import GlassCard from "../components/ui/GlassCard";
import { WaterAPI } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

const WaterTracker = () => {
  const { user } = useAuth();
  const goal = user?.goals?.waterGlassesGoal || 8;
  const [today, setToday] = useState({ glasses: 0 });
  const [logging, setLogging] = useState(false);

  const load = () => WaterAPI.today().then(({ data }) => setToday(data.water));
  useEffect(() => { load(); }, []);

  const addGlass = async () => {
    setLogging(true);
    try {
      await WaterAPI.log(250);
      toast.success("Glass logged 💧");
      load();
    } finally {
      setLogging(false);
    }
  };

  const pct = Math.min(100, Math.round(((today?.glasses || 0) / goal) * 100));

  return (
    <AppLayout title="Water Intake">
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="flex flex-col items-center py-10">
          <div className="relative w-40 h-40 mb-6">
            <svg className="w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
              <motion.circle
                cx="80" cy="80" r="70" stroke="#5EEAD4" strokeWidth="12" fill="none" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 70}
                initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - pct / 100) }}
                transition={{ duration: 0.6 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplets className="text-mint-300 mb-1" size={22} />
              <p className="text-2xl font-display font-bold text-slate-100">{today?.glasses || 0}/{goal}</p>
              <p className="text-[10px] text-slate-500">glasses today</p>
            </div>
          </div>

          <button onClick={addGlass} disabled={logging} className="btn-primary">
            <Plus size={16} /> Add a glass
          </button>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-3">Why hydration matters</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Staying hydrated supports focus, mood regulation, and energy levels throughout the day.
            MindMate reminds you to drink water at your preferred time — adjust this anytime in Settings.
          </p>
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default WaterTracker;
