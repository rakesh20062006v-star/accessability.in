import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./SupportServices.module.css";

function SupportServices() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getdetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/jobsadd/getqueries`
      );
       console.log(response.data);
      // Show only unread queries
      const unreadQueries = response.data.filter(
        (item) => item.status?.toLowerCase() !== "read"
      );

      setQueries(unreadQueries);
    } catch (err) {
      toast.error(err.message || "Failed to load queries");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/jobs/read/${id}`
      );

      // Remove from UI immediately
      setQueries((prev) =>
        prev.filter((query) => query._id !== id)
      );

      toast.success("Marked as read");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    getdetails();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <h2>Loading Queries...</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Support Queries</h1>

      {queries.length > 0 ? (
        <div className={styles.grid}>
          {queries.map((d) => (
            <div className={styles.card} key={d._id}>
  <h3>
    <span>Name:</span> {d.name }
  </h3>

  <h3>
    <span>Email:</span> {d.email }
  </h3>

  <h3>
    <span>Subject:</span> {d.subject }
  </h3>

  <div className={styles.description}>
    <strong>Description:</strong>
    <p>{d.message || "N/A"}</p>
  </div>

  <div className={styles.date}>
    📅 {new Date(d.createdAt).toLocaleString("en-IN")}
  </div>

  <button
    className={styles.readBtn}
    onClick={() => markAsRead(d._id)}
  >
    Mark as Read
  </button>
</div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>No Unread Queries Found</h2>
        </div>
      )}

      <button
        className={styles.homeBtn}
        onClick={() => navigate("/admin-dashboard")}
      >
        Home
      </button>
    </div>
  );
}

export default SupportServices;