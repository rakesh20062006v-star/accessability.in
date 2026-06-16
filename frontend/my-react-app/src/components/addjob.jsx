import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./AddJob.module.css";
import axios from "axios";
import { toast } from "react-toastify";
export default function AddJob() {
  const navigate = useNavigate();

 const [job, setJob] = useState({
  title: "",
  email:"",
  company: "",
  location: "",
  type: "",
  disability: "",
  salary: "",
  lastDate: "",
  description: "",
});

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/jobsadd/add-job`,
      job
    );

    toast.info("Job Added Successfully");

    setJob({
      title: "",
      email:"",
      company: "",
      location: "",
      type: "",
      disability: "",
      description: "",
      salary: "",
      lastDate: "",
    });

    navigate("/admin-dashboard");
  } catch (err) {
    console.error(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to add job"
    );
  }
};

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={handleSubmit}>
        <h1>Add New Job</h1>

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          required
        />
         <input
          type="email"
          name="email"
          placeholder="abc@gmail.com"
          value={job.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={job.company}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          value={job.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Work Type</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Onsite">Onsite</option>
        </select>

        <select
          name="disability"
          value={job.disability}
          onChange={handleChange}
          required
        >
          <option value="">Support Category</option>
          <option value="Visual">Visual</option>
          <option value="Hearing">Hearing</option>
          <option value="Mobility">Mobility</option>
          <option value="Multiple">Multiple Disabilities</option>
        </select>

        <input
          type="date"
          name="lastDate"
          value={job.lastDate}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="salary"
          placeholder="Salary (e.g. ₹30,000/month or ₹6 LPA)"
          value={job.salary}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Job Description"
          rows="5"
          value={job.description}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Add Job
        </button>
      </form>
    </div>
  );
}