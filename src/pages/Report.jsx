import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import useFetch from "../customHooks/useFetch";

const Report = () => {
  const week = useFetch(
    "https://task-pilot-backend-5sb3.onrender.com/report/last-week"
  );
  const pending = useFetch(
    "https://task-pilot-backend-5sb3.onrender.com/report/pending"
  );
  const closed = useFetch(
    "https://task-pilot-backend-5sb3.onrender.com/report/closed-tasks"
  );

  if (week.loading || pending.loading || closed.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="spinner-border text-dark"
          style={{ width: "3rem", height: "3rem" }}
        />
      </div>
    );
  }

  const error = week.error || pending.error || closed.error;
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-center">
        <div>
          <i className="bi bi-exclamation-triangle-fill fs-1"></i>
          <p className="fw-semibold mt-3">{error}</p>
        </div>
      </div>
    );
  }

  const weekTasks = Array.isArray(week.leadData?.tasks)
    ? week.leadData.tasks
    : [];

  const closedTeams = closed.leadData?.byTeam || {};
  const closedOwners = closed.leadData?.byOwner || {};
  const closedProjects = closed.leadData?.byProject || {};

  const chartPending = {
    labels: ["Total Days of Work Pending"],
    datasets: [
      {
        label: "Total Days of Work Pending",
        data: [pending.leadData?.totalPendingDays || 0],
        backgroundColor: "rgba(255,193,7,.7)",
      },
    ],
  };

  const chartWeek = {
    labels: weekTasks.map((t) => t.name || "Task"),
    datasets: [
      {
        label: "Tasks Closed Last Week",
        data: weekTasks.map(() => 1),
        backgroundColor: "rgba(220,53,69,.7)",
      },
    ],
  };

  const chartTeams = {
    labels: Object.keys(closedTeams),
    datasets: [
      {
        label: "Closed Tasks by Team",
        data: Object.values(closedTeams),
        backgroundColor: "rgba(13,110,253,.7)",
      },
    ],
  };

  const chartOwners = {
    labels: Object.keys(closedOwners),
    datasets: [
      {
        label: "Closed Tasks by Owner",
        data: Object.values(closedOwners),
        backgroundColor: "rgba(40,167,69,.7)",
      },
    ],
  };

  const chartProjects = {
    labels: Object.keys(closedProjects),
    datasets: [
      {
        label: "Closed Tasks by Project",
        data: Object.values(closedProjects),
        backgroundColor: "rgba(108,117,125,.7)",
      },
    ],
  };

  return (
    <div className="pb-5 mb-5">
      <div className="container-fluid px-3 px-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-3 text-center text-md-start mt-5 mb-5">
            <Link to="/app" className="btn btn-outline-dark">
              <i className="bi bi-arrow-left me-2"></i> Back
            </Link>
          </div>

          <div className="col-12 col-md-9">
            <div className="mb-5 mt-5 pb-4 text-center text-md-start">
              <h2 className="fw-bold">Analytics Reports</h2>
            </div>

            {[
              ["Pending Workload", chartPending],
              ["Tasks Closed Last Week", chartWeek],
              ["Closed Tasks by Team", chartTeams],
              ["Closed Tasks by Owner", chartOwners],
              ["Closed Tasks by Project", chartProjects],
            ].map(([title, data], i) => {
              let isEmpty = false;
              let emptyIcon = "bi-bar-chart";
              let emptyText = "No data available";

              if (title === "Pending Workload") {
                return (
                  <div key={i} className="mb-5 mt-5 text-center text-md-start">
                    <h4 className="fw-semibold mb-4">Pending Workload</h4>

                    {pending.leadData?.totalPendingTasks === 0 ? (
                      <div
                        className="bg-white p-4 shadow-sm rounded text-center d-flex flex-column justify-content-center align-items-center"
                        style={{ height: "300px" }}
                      >
                        <i className="bi bi-check-circle fs-1 text-dark"></i>
                        <p className="fw-semibold mt-3 text-dark">
                          No pending workload
                        </p>
                      </div>
                    ) : pending.leadData?.totalPendingDays === 0 ? (
                      <div
                        className="bg-white p-4 shadow-sm rounded text-center d-flex flex-column justify-content-center align-items-center"
                        style={{ height: "300px" }}
                      >
                        <i className="bi bi-exclamation-circle fs-1 text-dark"></i>
                        <p className="fw-semibold mt-3 text-dark">
                          Pending tasks are overdue
                        </p>
                      </div>
                    ) : (
                      <div
                        className="bg-white p-4 shadow-sm rounded"
                        style={{ height: "300px" }}
                      >
                        <Bar data={chartPending} />
                      </div>
                    )}
                  </div>
                );
              }

              if (
                title === "Tasks Closed Last Week" &&
                weekTasks.length === 0
              ) {
                isEmpty = true;
                emptyIcon = "bi-inbox";
                emptyText = "No tasks closed in the last 7 days";
              }

              if (
                title === "Closed Tasks by Team" &&
                Object.keys(closedTeams).length === 0
              ) {
                isEmpty = true;
                emptyIcon = "bi-people";
                emptyText = "No closed tasks by team yet";
              }

              if (
                title === "Closed Tasks by Owner" &&
                Object.keys(closedOwners).length === 0
              ) {
                isEmpty = true;
                emptyIcon = "bi-person-check";
                emptyText = "No closed tasks by owner yet";
              }

              if (
                title === "Closed Tasks by Project" &&
                Object.keys(closedProjects).length === 0
              ) {
                isEmpty = true;
                emptyIcon = "bi-folder-check";
                emptyText = "No closed tasks by project yet";
              }

              return (
                <div key={i} className="mb-5 mt-5 text-center text-md-start">
                  <h4 className="fw-semibold mb-4">{title}</h4>

                  {isEmpty ? (
                    <div className="bg-white p-4 shadow-sm rounded text-center">
                      <i className={`bi ${emptyIcon} fs-1 text-secondary`}></i>
                      <p className="fw-semibold mt-3 text-secondary">
                        {emptyText}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="bg-white p-4 shadow-sm rounded"
                      style={{ height: "300px" }}
                    >
                      <Bar data={data} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
