
import "./Task.css"
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskModal from "../components/TaskModal";
import api from "../api/axiosApi";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const loadTasks = async () => {
    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (priority) params.append("priority", priority);

      const { data } = await api.get(`/tasks?${params.toString()}`);

      setTasks(data.tasks);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [status, priority]);

  const handleCreate = async (taskData) => {
    await api.post("/tasks", taskData);
    setModalOpen(false);
    loadTasks();
  };

  const handleUpdate = async (taskData) => {
    await api.put(`/tasks/${selectedTask._id}`, taskData);

    setSelectedTask(null);
    setModalOpen(false);

    loadTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    await api.delete(`/tasks/${id}`);

    loadTasks();
  };

  const handleToggle = async (id) => {
    await api.patch(`/tasks/${id}/toggle`);
    loadTasks();
  };

  return (
    <>
      <Navbar />

      <main className="tasks-page">

        {/* Header */}

        <div className="tasks-header">

          <div>

            <h1>Task Manager</h1>

            <p>
              Organize, manage and complete your daily work efficiently.
            </p>

          </div>

          <button
            className="new-task-btn"
            onClick={() => {
              setSelectedTask(null);
              setModalOpen(true);
            }}
          >
            + New Task
          </button>

        </div>

        {/* Filters */}

        <div className="filter-card">

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") loadTasks();
            }}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="TO-DO">TO-DO</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            className="search-btn"
            onClick={loadTasks}
          >
            Search
          </button>

        </div>

        {/* Tasks Grid */}
                <div className="tasks-grid">

          {tasks.length === 0 ? (

            <div className="empty-state">

              <h2>No Tasks Found</h2>

              <p>Create your first task to start managing your work.</p>

            </div>

          ) : (

            tasks.map((task) => (

              <div className="task-card" key={task._id}>

                <div className="task-top">

                  <span className={`priority priority-${task.priority}`}>
                    {task.priority}
                  </span>

                  <span
                    className={`status ${
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

                <h2 className="task-title">
                  {task.title}
                </h2>

                <p className="task-description">
                  {task.description}
                </p>

                <div className="task-info">

                  <div>
                    <strong>Category</strong>
                    <span>{task.category}</span>
                  </div>

                  <div>
                    <strong>Due Date</strong>

                    <span>

                      {task.duedate
                        ? new Date(task.duedate).toLocaleDateString()
                        : "No Date"}

                    </span>

                  </div>

                </div>

                <div className="task-actions">

                  <button
                    className="toggle-btn"
                    onClick={() => handleToggle(task._id)}
                  >
                    Toggle
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => {
                      setSelectedTask(task);
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </main>

      <TaskModal
        isOpen={modalOpen}
        task={selectedTask}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={selectedTask ? handleUpdate : handleCreate}
      />

    </>
  );
};

export default Tasks;