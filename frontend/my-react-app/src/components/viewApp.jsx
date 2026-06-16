import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./Application.module.css";

import { useNavigate } from "react-router-dom";


function Application() {
    
const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/application/details"
      );

      setApplications(response.data.newdata || []);
    } catch (err) {
      toast.error(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <h2>Loading Applications...</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Job Applications</h1>

      {applications.length > 0 ? (
        <div className={styles.grid}>
          {applications.map((d, index) => (
            <div className={styles.card} key={index}>
              <h3>
                <span>Applicant:</span> {d.username}
              </h3>

              <h3>
                <span>Job:</span> {d.jobname}
              </h3>

              <h3>
                <span>Company:</span> {d.companyname}
              </h3>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>No Applications Found</h2>
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

export default Application;