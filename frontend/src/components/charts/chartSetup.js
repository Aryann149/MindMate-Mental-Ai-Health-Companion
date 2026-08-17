import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#111827",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleColor: "#E5E7EB",
      bodyColor: "#CBD5E1",
      padding: 10,
      cornerRadius: 10,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#64748B", font: { size: 11 } },
    },
    y: {
      grid: { color: "rgba(255,255,255,0.06)" },
      ticks: { color: "#64748B", font: { size: 11 } },
    },
  },
};
