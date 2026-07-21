
import DashboardCharts from "./DashboardCharts"
import "./Dashboard.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosApi";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get("/tasks/stats"),
          api.get("/tasks"),
        ]);

        setStats(statsRes.data);
        setRecentTasks(tasksRes.data.tasks || []);
      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning ☀";
    if (hour < 17) return "Good Afternoon 🌤";
    return "Good Evening 🌙";
  };

  const completion =
    stats.total === 0
      ? 0
      : Math.round((stats.completed / stats.total) * 100);

  const filteredTasks = useMemo(() => {
    return recentTasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [recentTasks, search]);

  return (
  <main className="dashboard">

    {/* Top Header */}

    <section className="top-header">

      <div>

        <h1>{greeting()}</h1>

        <p>
          Welcome back! Here's an overview of your productivity.
        </p>

      </div>

      <div className="header-right">

        <div className="time-card">

          <h2>{time.toLocaleTimeString()}</h2>

          <span>{time.toDateString()}</span>

        </div>

        <Link className="create-btn" to="/tasks">
          + Create Task
        </Link>

      </div>

    </section>

    {/* Search */}

    <section className="search-area">

      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    </section>

    {/* Statistics */}

    <section className="stats">

      <div className="stat blue">

        <div>

          <h3>Total Tasks</h3>

          <h1>{stats.total}</h1>

        </div>

        <div className="icon">📋</div>

      </div>

      <div className="stat green">

        <div>

          <h3>Completed</h3>

          <h1>{stats.completed}</h1>

        </div>

        <div className="icon">✅</div>

      </div>

      <div className="stat orange">

        <div>

          <h3>Pending</h3>

          <h1>{stats.pending}</h1>

        </div>

        <div className="icon">⏳</div>

      </div>

      <div className="stat red">

        <div>

          <h3>Overdue</h3>

          <h1>{stats.overdue}</h1>

        </div>

        <div className="icon">⚠️</div>

      </div>

      <div className="stat purple">

        <div>

          <h3>Completion</h3>

          <h1>{completion}%</h1>

        </div>

        <div className="icon">📈</div>

      </div>

      <div className="stat cyan">

        <div>

          <h3>Today's Goal</h3>

          <h1>80%</h1>

        </div>

        <div className="icon">🎯</div>

      </div>

    </section>

    {/* Next parts will be added here */}
    {/* Main Content */}

<section className="main-grid">

  {/* Recent Tasks */}

  <div className="dashboard-card">

    <div className="card-top">

      <h2>Recent Tasks</h2>

      <Link to="/tasks">View All →</Link>

    </div>

    {filteredTasks.length === 0 ? (

      <div className="empty-card">

        <h3>No Tasks Available</h3>

        <p>Create your first task.</p>

      </div>

    ) : (

      filteredTasks.slice(0, 6).map((task) => (

        <div className="task-row" key={task._id}>

          <div>

            <h4>{task.title}</h4>

            <small>{task.category}</small>

          </div>

          <span
            className={`task-status ${
              task.status === "Done"
                ? "done"
                : task.status === "In Progress"
                ? "progress"
                : "todo"
            }`}
          >
            {task.status}
          </span>

        </div>

      ))

    )}

  </div>

  {/* Productivity */}

  <div className="dashboard-card">

    <h2>Today's Productivity</h2>

   <div className="stats-list">

  <div className="status-card completed">

    <span>✅ Completed</span>

    <strong>{stats.completed}</strong>

  </div>

  <div className="status-card pending">

    <span>⏳ Pending</span>

    <strong>{stats.pending}</strong>

  </div>

  <div className="status-card overdue">

    <span>⚠ Overdue</span>

    <strong>{stats.overdue}</strong>

  </div>

</div>

  </div>

</section>
{/* Bottom Grid */}

<section className="bottom-grid">

  {/* Upcoming Tasks */}

  <div className="dashboard-card">

    <div className="card-top">

      <h2>📅 Upcoming Tasks</h2>

      <Link to="/tasks">Manage</Link>

    </div>

    {filteredTasks.slice(0,4).map((task)=>(
      <div className="upcoming-row" key={task._id}>

        <div>

          <h4>{task.title}</h4>

          <small>{task.category}</small>

        </div>

        <span>{task.dueDate ?
          new Date(task.dueDate).toLocaleDateString()
          : "No Date"}
        </span>

      </div>
    ))}

  </div>

  

</section>

  </main>
  
);
};

export default Dashboard;