import "./chartSetup";
import { Line } from "react-chartjs-2";
import { baseOptions } from "./chartSetup";
import { format } from "date-fns";

/**
 * Generic trend line chart for mood/stress/sleep, used across the dashboard
 * and individual tracker analytics tabs.
 */
const TrendLineChart = ({ data = [], label, color = "#A78BFA", suggestedMax, height = 220 }) => {
  const chartData = {
    labels: data.map((d) => format(new Date(d.date), "MMM d")),
    datasets: [
      {
        label,
        data: data.map((d) => d.value),
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: color,
      },
    ],
  };

  const options = {
    ...baseOptions,
    scales: {
      ...baseOptions.scales,
      y: { ...baseOptions.scales.y, suggestedMax, beginAtZero: true },
    },
  };

  if (!data.length) {
    return (
      <div style={{ height }} className="flex items-center justify-center text-sm text-slate-500">
        No entries yet — log your first one to see trends here.
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendLineChart;
