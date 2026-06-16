import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1>Admin Dashboard</h1>

        <button
          className={style.logoutBtn}
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <p className={style.subtitle}>
        Manage jobs and accessibility services.
      </p>

      <div className={style.cardGrid}>
        <div
          className={style.card}
          onClick={() => navigate("/add-job")}
        >
          <h2>➕ Add Job</h2>
          <p>Create a new accessible job opportunity.</p>
        </div>

        <div
          className={style.card}
          onClick={() => navigate("/manage-jobs")}
        >
          <h2>📋 Manage Jobs</h2>
          <p>View, edit and delete jobs.</p>
        </div>

        <div
          className={style.card}
          onClick={() => navigate("/applications")}
        >
          <h2>👥 Applications</h2>
          <p>View candidate applications.</p>
        </div>

        <div
          className={style.card}
          onClick={() => navigate("/support-services")}
        >
          <h2>♿ Support Services</h2>
          <p>Manage accessibility resources.</p>
        </div>
      </div>
    </div>
  );
}