import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./ManageApplication.module.css";

function ManageApplication() {
  const [jobapplications, setjobapplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getdetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/application/jobdetails`
      );

      setjobapplications(response.data.data || []);
    } catch (err) {
      toast.warning(err.message || "No applications found");
    } finally {
      setLoading(false);
    }
  };

 const deleteApplication = async (id) => {
  console.log("Deleting:", id);

  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/application/deletejob/${id}`
    );

    console.log(response.data);

    setjobapplications(
      jobapplications.filter((app) => app._id !== id)
    );

    toast.success(response.data.message);
  } catch (err) {
    console.log(err.response?.data);
    toast.error(
      err.response?.data?.message || err.message
    );
  }
};

  useEffect(() => {
    getdetails();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading Applications...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Manage Applications</h1>

      {jobapplications.length === 0 ? (
        <div className={styles.empty}>
          <h2>No Applications Found</h2>
        </div>
      ) : (
        <div className={styles.grid}>
          {jobapplications.map((d) => (
            <div className={styles.card} key={d._id}>
              

              <h3>
                <span>Title:</span> {d.title}
              </h3>

              <h3>
                <span>Company:</span> {d.company}
              </h3>

              <h3>
                <span>Location:</span> {d.location}
              </h3>

              <h3>
                <span>Type:</span> {d.type}
              </h3>

              <h3>
                <span>Disability:</span> {d.disability}
              </h3>

              <h3>
                <span>Salary:</span> ₹{d.salary}
              </h3>

              <h3>
                <span>Last Date:</span> {d.lastDate}
              </h3>

              <p>
                <span>Description:</span> {d.description}
              </p>

              <div className={styles.buttonGroup}>
                <button
                  className={styles.updateBtn}
                  onClick={() =>
                    navigate(`/edit-application/${d._id}`)
                  }
                >
                  Update
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteApplication(d._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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

export default ManageApplication;