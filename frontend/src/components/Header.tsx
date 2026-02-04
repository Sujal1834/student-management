import { NavLink } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const token = localStorage.getItem("access_token")
  return (
    <>
    <header className="app-header">
      <div className="logo">
        Student Management
      </div>

      <nav className="nav-links">
        {!token && 
          <>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Login
          </NavLink>
          </>
        }
        {token && (
          <>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

        {/* <NavLink
          to="/course"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Courses
        </NavLink>

        <NavLink
          to="/student"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Students
        </NavLink> */}
        </>
      )}
      </nav>
    </header>
    </>
  );
};

export default Header;
