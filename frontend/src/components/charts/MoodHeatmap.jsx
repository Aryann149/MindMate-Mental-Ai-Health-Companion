import { useMemo } from "react";
import { format, eachDayOfInterval, startOfYear, endOfYear } from "date-fns";

/**
 * GitHub-style contribution heatmap for mood ratings across a year.
 * Color intensity maps to average mood rating (1-10) for that day.
 */
const colorForRating = (rating) => {
  if (rating === undefined) return "bg-white/5";
  if (rating <= 3) return "bg-coral-500/70";
  if (rating <= 5) return "bg-lavender-500/30";
  if (rating <= 7) return "bg-lavender-500/60";
  return "bg-mint-400/80";
};

const MoodHeatmap = ({ heatmapData = [], year = new Date().getFullYear() }) => {
  const ratingByDate = useMemo(() => {
    const map = {};
    heatmapData.forEach((d) => {
      map[d._id] = d.avgRating;
    });
    return map;
  }, [heatmapData]);

  const days = useMemo(
    () => eachDayOfInterval({ start: startOfYear(new Date(year, 0, 1)), end: endOfYear(new Date(year, 0, 1)) }),
    [year]
  );

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          return (
            <div
              key={key}
              title={`${key}${ratingByDate[key] ? `: ${ratingByDate[key].toFixed(1)}/10` : ""}`}
              className={`w-3 h-3 rounded-sm ${colorForRating(ratingByDate[key])}`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-500">
        <span>Low</span>
        <span className="w-3 h-3 rounded-sm bg-coral-500/70" />
        <span className="w-3 h-3 rounded-sm bg-lavender-500/30" />
        <span className="w-3 h-3 rounded-sm bg-lavender-500/60" />
        <span className="w-3 h-3 rounded-sm bg-mint-400/80" />
        <span>High</span>
      </div>
    </div>
  );
};

export default MoodHeatmap;
