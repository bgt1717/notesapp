import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate(); // useNavigate Hook.

  const logout = () => {
    setCookies("access_token", ""); // Set cookies to an empty token.
    window.localStorage.removeItem("userID"); // Clears local Storage Key.
    navigate("/auth"); // Calls Hook to route to /auth page.
  };

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/">MyNotes</Link>
      </div>

      <div className="nav-links">
        {!cookies.access_token ? (
          <Link to="/auth">Login/Register</Link>
        ) : (
          <>
            <Link to="/createnote">Create Note</Link>
            <Link to="/savedNotes">Saved Notes</Link>
            <Link to="/auth" onClick={logout}>Logout</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
