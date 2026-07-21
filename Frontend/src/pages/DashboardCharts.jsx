import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const DashboardCharts = ({ stats }) => {
  const pieData = {
    labels: ["Completed", "Pending", "Overdue"],
    datasets: [
      {
        data: [
          stats.completed,
          stats.pending,
          stats.overdue,
        ],
        backgroundColor: [
          "#10b981",
          "#3b82f6",
          "#ef4444",
        ],
      },
    ],
  };

  const barData = {
    labels: [
      "Total",
      "Completed",
      "Pending",
      "Overdue",
    ],

    datasets: [
      {
        label: "Tasks",

        data: [
          stats.total,
          stats.completed,
          stats.pending,
          stats.overdue,
        ],

        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
        ],
      },
    ],
  };

  return (
    <div className="charts-grid">

      <div className="chart-card">

        <h2>Status Distribution</h2>

        <Pie data={pieData} />

      </div>

      <div className="chart-card">

        <h2>Task Analytics</h2>

        <Bar data={barData} />

      </div>

    </div>
  );
};

export default DashboardCharts;