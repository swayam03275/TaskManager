import { useEffect, useState } from "react";
import apiClient from "../api/apiClient.js";
import StatsCard from "../components/StatsCard.jsx";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await apiClient.get("/dashboard");
        setStats(data.totals);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard");
      }
    };
    load();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats)  return <div>Loading dashboard...</div>;

  const cards = [
    { title: "Total Tasks", value: stats.total,      accent: "primary",  helper: "All active tasks"    },
    { title: "To Do",       value: stats.todo,        accent: "warning",  helper: "Not started"         },
    { title: "In Progress", value: stats.inProgress,  accent: "info",     helper: "Currently moving"    },
    { title: "Done",        value: stats.done,        accent: "success",  helper: "Completed"           },
    { title: "Overdue",     value: stats.overdue,     accent: "danger",   helper: "Needs attention"     },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <div className="page-hero">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h1 className="fw-bold mb-2">Dashboard</h1>
            <p className="mb-0">Keep tabs on every task and project status.</p>
          </div>
          <div className="d-flex align-items-center gap-2 pill">
            <span
              className="rounded-circle bg-success pulse"
              style={{ display: "block", width: 8, height: 8 }}
            />
            Live overview
          </div>
        </div>
      </div>

      {/* 5 cards: 1 col mobile → 2 col tablet → 5 col desktop */}
      <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-xl-5">
        {cards.map((c) => (
          <div key={c.title} className="col">
            <StatsCard {...c} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;