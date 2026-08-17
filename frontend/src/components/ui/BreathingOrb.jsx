import { motion } from "framer-motion";

/**
 * Signature visual for MindMate: a slow-pulsing orb that mimics a
 * calm breathing rhythm (4s inhale / 4s exhale-ish cadence via the
 * "breathe" keyframe). Used on auth screens and empty states to set
 * a calm, non-clinical tone distinct from generic dashboard chrome.
 */
const BreathingOrb = ({ size = 220 }) => (
  <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    <motion.div
      className="absolute inset-0 rounded-full bg-gradient-to-tr from-lavender-500/40 via-bloom-500/20 to-mint-400/30 blur-2xl animate-breathe"
    />
    <motion.div
      className="absolute inset-6 rounded-full bg-gradient-to-tr from-lavender-400/60 to-mint-300/40 backdrop-blur-3xl border border-white/10 animate-breathe"
      style={{ animationDelay: "0.3s" }}
    />
    <div className="absolute inset-14 rounded-full bg-base-900/40 border border-white/10 flex items-center justify-center">
      <span className="text-xs text-slate-300 tracking-wide">breathe</span>
    </div>
  </div>
);

export default BreathingOrb;
