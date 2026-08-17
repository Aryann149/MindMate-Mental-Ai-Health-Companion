import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import GlassCard from "../components/ui/GlassCard";
import TrendLineChart from "../components/charts/TrendLineChart";
import MoodHeatmap from "../components/charts/MoodHeatmap";
import { MoodAPI } from "../api/endpoints";

const EMOJI_SCALE = ["😭", "😢", "😟", "😕", "😐", "🙂", "😊", "😄", "😁", "🤩"];
const TAGS = ["happy", "sad", "anxious", "calm", "angry", "grateful", "tired", "energetic", "lonely", "hopeful", "overwhelmed", "content", "irritable", "motivated", "bored", "peaceful"];

const MoodTracker = () => {
  const [rating, setRating] = useState(6);
  const [tags, setTags] = useState([]);
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: moodData }, { data: heatmapData }] = await Promise.all([
      MoodAPI.list("monthly"),
      MoodAPI.heatmap(),
    ]);
    setMoods(moodData.moods);
    setHeatmap(heatmapData.heatmap);
  };

  useEffect(() => { load(); }, []);

  const toggleTag = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const submit = async () => {
    setSaving(true);
    try {
      await MoodAPI.create({ rating, tags, note });
      toast.success("Mood logged");
      setNote(""); setTags([]);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not log mood");
    } finally {
      setSaving(false);
    }
  };

  const trendData = [...moods].reverse().map((m) => ({ date: m.date, value: m.rating }));

  return (
    <AppLayout title="Mood Tracker">
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-4">How are you feeling right now?</p>

          <div className="text-center mb-4">
            <span className="text-5xl">{EMOJI_SCALE[rating - 1]}</span>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full accent-lavender-400 mb-2"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mb-4">
            <span>Very low</span><span className="text-slate-300">{rating}/10</span><span>Excellent</span>
          </div>

          <p className="text-xs text-slate-400 mb-2">What's contributing to this? (optional)</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  tags.includes(tag)
                    ? "bg-lavender-500/20 border-lavender-500/40 text-lavender-200"
                    : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a quick note (optional)"
            rows={3}
            className="glass-input w-full mb-4 resize-none"
          />

          <button onClick={submit} disabled={saving} className="btn-primary w-full">
            {saving ? "Saving..." : "Log mood"}
          </button>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <p className="text-sm font-semibold text-slate-200 mb-3">Mood Over Time</p>
            <TrendLineChart data={trendData} label="Mood" color="#F472B6" suggestedMax={10} />
          </GlassCard>

          <GlassCard>
            <p className="text-sm font-semibold text-slate-200 mb-3">Yearly Mood Heatmap</p>
            <MoodHeatmap heatmapData={heatmap} />
          </GlassCard>
        </div>
      </div>

      <GlassCard className="mt-6">
        <p className="text-sm font-semibold text-slate-200 mb-3">Recent Entries</p>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {moods.slice(0, 15).map((m) => (
            <div key={m._id} className="flex items-start gap-3 text-sm border-b border-white/5 pb-2">
              <span className="text-xl">{m.emoji}</span>
              <div className="flex-1">
                <p className="text-slate-300">{m.rating}/10 {m.tags?.length ? `· ${m.tags.join(", ")}` : ""}</p>
                {m.note && <p className="text-xs text-slate-500">{m.note}</p>}
              </div>
              <span className="text-[10px] text-slate-600">{new Date(m.date).toLocaleDateString()}</span>
            </div>
          ))}
          {!moods.length && <p className="text-sm text-slate-500">No mood logs yet.</p>}
        </div>
      </GlassCard>
    </AppLayout>
  );
};

export default MoodTracker;
