import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./Jobs.module.css";
import Navbar from "./servicedashboard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function Jobs() {
    const navigate=useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const fetchAppliedJobs = async () => {
  try {
    const userData = localStorage.getItem("user");

    if (!userData) return;

    const user = JSON.parse(userData);

    const { data } = await axios.get(
      `http://localhost:5000/api/application/${user.username}`
    );

    setAppliedJobs(data.jobIds || []);
  } catch (error) {
    console.log(error);
  }
};

const applyJob = async (jobId) => {
  try {
    const userData = localStorage.getItem("user");

    if (!userData) {
      toast.error("Please login first");
       
      setTimeout(() => {
        navigate("/");
      }, 1000);

      return;
    }

    const user = JSON.parse(userData);

    const response = await axios.post(
      "http://localhost:5000/api/application/apply",
      {
        username: user.username,
        jobId: jobId,
      }
    );

  setAppliedJobs((prev) => [
  ...prev,
  jobId
]);
    toast.success(response.data.message);

  } catch (error) {
  console.log(error);
  console.log(error.response);

  toast.error(
    error.response?.data?.message || "Application Failed"
  );
}
};

useEffect(() => {
  fetchJobs();
  fetchAppliedJobs();
}, []);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/jobs/jobapply"
      );

      console.log("Jobs:", data);

      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      setSearch(event.results[0][0].transcript);
    };

    recognition.start();
  };

  const speakJob = (job) => {
    const speech = new SpeechSynthesisUtterance(
      `${job.title} at ${job.company}.
      Located in ${job.location}.
      Work type ${job.type}.
      Salary ${job.salary || "Not Mentioned"}.
      Suitable for ${job.disability}.
      Last date to apply is ${
        job.lastDate
          ? new Date(job.lastDate).toLocaleDateString()
          : "Not Available"
      }.`
    );

    window.speechSynthesis.speak(speech);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "" ||
      job.disability?.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={style.jobContainer}>
          <h2 className={style.heading}>Loading Jobs...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className={style.jobContainer}>
        <h1 className={style.heading}>
          Accessible Job Portal
        </h1>

        <div className={style.controls}>
          <input
            className={style.input}
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className={style.voiceBtn}
            onClick={startVoiceSearch}
          >
            🎤 Voice Search
          </button>

          <select
            className={style.select}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Disabilities</option>
            <option value="Visual">Visual</option>
            <option value="Hearing">Hearing</option>
            <option value="Mobility">Mobility</option>
            <option value="Multiple">Multiple</option>
          </select>
        </div>

        <div className={style.jobGrid}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className={style.jobCard}
              >
                <h2 className={style.jobTitle}>
                  {job.title}
                </h2>

                <p className={style.info}>
                  <strong>Company:</strong> {job.company}
                </p>

                <p className={style.info}>
                  <strong>Location:</strong> {job.location}
                </p>

                <p className={style.info}>
                  <strong>Type:</strong> {job.type}
                </p>

                <p className={style.info}>
                  <strong>Salary:</strong>{" "}
                  {job.salary || "Not Mentioned"}
                </p>

                <p className={style.info}>
                  <strong>Description:</strong>{" "}
                  {job.description ||
                    "No Description Available"}
                </p>

                <p className={style.info}>
                  <strong>Last Date:</strong>{" "}
                  {job.lastDate
                    ? new Date(
                        job.lastDate
                      ).toLocaleDateString()
                    : "Not Available"}
                </p>

                <span className={style.tag}>
                  {job.disability} Support
                </span>

                <div className={style.buttonGroup}>
                  <button
                    className={style.listenBtn}
                    onClick={() => speakJob(job)}
                  >
                    🔊 Listen
                  </button>
                <button
                          className={style.applyBtn}
                         disabled={appliedJobs.includes(job._id)}
                       onClick={() => applyJob(job._id)}
>
                          {appliedJobs.includes(job._id)
                         ? "Applied ✓"
                          : "Apply Now"}
                         </button>
                  

  
                </div>
              </div>
            ))
          ) : (
            <p className={style.noJobs}>
              No jobs found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}