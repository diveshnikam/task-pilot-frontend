import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useFetch = (url, refresh, initialData = []) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leadData, setLeadData] = useState(initialData);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!url) return;

    if (!token) {
      setLoading(false);
      setLeadData([]);
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
          throw new Error("Session expired. Please login again.");
        }
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setLeadData(data);
        else if (Array.isArray(data.data)) setLeadData(data.data);
        else if (typeof data === "object") setLeadData(data);   
        else setLeadData([]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url, refresh, token]);

  return { leadData, loading, error };
};

export default useFetch;
