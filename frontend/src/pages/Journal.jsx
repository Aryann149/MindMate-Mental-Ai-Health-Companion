import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import GlassCard from "../components/ui/GlassCard";
import { JournalAPI } from "../api/endpoints";

const Journal = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);

  const load = async () => {
    const { data } = await JournalAPI.list();
    setEntries(data.entries);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!content.trim()) return toast.error("Write something first");
    setSaving(true);
    try {
      await JournalAPI.create({ title, content });
      toast.success("Journal entry saved");
      setTitle(""); setContent("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save entry");
    } finally {
      setSaving(false);
    }
  };

  const analyze = async (id) => {
    setAnalyzingId(id);
    try {
      await JournalAPI.analyze(id);
      toast.success("AI analysis complete");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Analysis failed");
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <AppLayout title="Journal">
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-4">New Entry</p>
          <input
            className="glass-input w-full mb-3"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="glass-input w-full resize-none mb-4"
            rows={10}
            placeholder="Write freely about your day..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={submit} disabled={saving} className="btn-primary w-full">
            {saving ? "Saving..." : "Save entry"}
          </button>
          <p className="text-[11px] text-slate-600 mt-3">
            After saving, you can run an AI analysis for general wellness insight — this is never a diagnosis.
          </p>
        </GlassCard>

        <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
          {entries.map((entry) => (
            <GlassCard key={entry._id}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  {entry.title && <p className="font-medium text-slate-200">{entry.title}</p>}
                  <p className="text-[11px] text-slate-600">{new Date(entry.date).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => analyze(entry._id)}
                  disabled={analyzingId === entry._id}
                  className="btn-secondary !px-3 !py-1.5 text-xs"
                >
                  {analyzingId === entry._id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  Analyze
                </button>
              </div>
              <p className="text-sm text-slate-400 whitespace-pre-line mb-3">{entry.content}</p>

              {entry.aiAnalysis?.analyzedAt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-white/10 pt-3 mt-2 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-lavender-500/15 text-lavender-200 border border-lavender-500/20 capitalize">
                      {entry.aiAnalysis.sentiment}
                    </span>
                    {entry.aiAnalysis.riskLevel !== "none" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-coral-500/15 text-coral-300 border border-coral-500/20 capitalize">
                        {entry.aiAnalysis.riskLevel} risk signal
                      </span>
                    )}
                  </div>
                  {entry.aiAnalysis.recurringThemes?.length > 0 && (
                    <p className="text-xs text-slate-500"><span className="text-slate-400">Themes:</span> {entry.aiAnalysis.recurringThemes.join(", ")}</p>
                  )}
                  {entry.aiAnalysis.positiveHabits?.length > 0 && (
                    <p className="text-xs text-slate-500"><span className="text-slate-400">Going well:</span> {entry.aiAnalysis.positiveHabits.join(", ")}</p>
                  )}
                  {entry.aiAnalysis.areasToImprove?.length > 0 && (
                    <p className="text-xs text-slate-500"><span className="text-slate-400">Worth attention:</span> {entry.aiAnalysis.areasToImprove.join(", ")}</p>
                  )}
                  <p className="text-[10px] text-slate-600 italic">{entry.aiAnalysis.disclaimer}</p>
                </motion.div>
              )}
            </GlassCard>
          ))}
          {!entries.length && <p className="text-sm text-slate-500">No journal entries yet.</p>}
        </div>
      </div>
    </AppLayout>
  );
};

export default Journal;
