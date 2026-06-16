import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logo-icon">♿</span>
        <span>AccessAbility</span>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/Dashboard">Home</Link>
        </li>

        <li>
          <Link to="/jobs">Jobs</Link>
        </li>

        <li>
          <Link to="/restaurants">Transport</Link>
        </li>

        <li>
          <Link to="/restaurants">Restaurants</Link>
        </li>

        <li>
          <Link to="/Contact">Contact</Link>
        </li>
      </ul>

      {user ? (
        <Link
          to="/"
          className="profile-btn"
          onClick={logout}
        >
          Sign Out
        </Link>
      ) : (
        <Link
          to="/auth/login"
          className="profile-btn"
        >
          Login
        </Link>
      )}
    </nav>
  );
}

export default Navbar;