import "./dashboard.css";
import bgImage from "../images/main.jpeg";
import { useNavigate } from "react-router-dom";
import Navbar from "../services/servicedashboard";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <Navbar />

      <section
        className="hero"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="overlay"></div>

        <div className="hero-content">
          <h1>
            Empowering Accessibility
            <br />
            For Everyone
          </h1>

          <p>
            Find accessible jobs, transport, restaurants and support
            services tailored to your needs.
          </p>

          <button
            className="hero-btn"
            onClick={() => navigate("/restaurants")}
          >
            Explore Services
          </button>
        </div>
      </section>

      <section className="cards-section">
        <div className="cards-container">
          <div className="card">
            <h2>💼 Jobs</h2>
            <p>Find accessible job opportunities.</p>
          </div>

          <div className="card">
            <h2>🚌 Transport</h2>
            <p>Accessible travel and mobility options.</p>
          </div>

          <div className="card">
            <h2>🍽 Restaurants</h2>
            <p>Discover accessibility-friendly places.</p>
          </div>

          <div className="card">
            <h2>🤝 Support</h2>
            <p>Resources and community support.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;