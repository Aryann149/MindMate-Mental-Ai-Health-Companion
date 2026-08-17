const StatPill = ({ icon: Icon, label, value, accent = "lavender" }) => {
  const accentMap = {
    lavender: "text-lavender-300 bg-lavender-500/10 border-lavender-500/20",
    mint: "text-mint-300 bg-mint-500/10 border-mint-500/20",
    coral: "text-coral-400 bg-coral-500/10 border-coral-500/20",
    bloom: "text-bloom-400 bg-bloom-500/10 border-bloom-500/20",
  };
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${accentMap[accent]}`}>
      {Icon && <Icon size={18} />}
      <div>
        <p className="text-xs opacity-70">{label}</p>
        <p className="text-lg font-display font-semibold text-slate-100">{value}</p>
      </div>
    </div>
  );
};

export default StatPill;
