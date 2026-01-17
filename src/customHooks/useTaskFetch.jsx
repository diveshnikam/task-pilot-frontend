import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useTaskFetch = (url, refresh = false) => {
  const navigate = useNavigate();                

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!url) return;

    if (!token) {
      setLoading(false);
      setTasks([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");    
          navigate("/");                   
          throw new Error("Session expired");
        }
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.tasks)) setTasks(data.tasks);
        else setTasks([]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url, refresh, token]);

  return { tasks, loading, error };
};

export default useTaskFetch;
