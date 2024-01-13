import { Link } from "react-router-dom"
import {useCookies} from "react-cookie";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate(); //useNavigate Hook.

    const logout = () => {
        setCookies("access_token", "") //Set cookies to an empty token.
        window.localStorage.removeItem("userID"); //Clears local Storage Key.
        navigate("/auth"); //Calls Hook to route to /auth page.
    }
  return (
    <div className="navbar">
      <Link to="/"> Home </Link>
      

      {!cookies.access_token ? (<Link to="/auth"> Login/Register </Link> //If there is not an access token in cookies, route to Login/Register page.  
      ) : ( 
        <>
      <Link to="/createnote"> Create Note </Link>
      <Link to="/savedNotes"> Saved Notes </Link>

      <button onClick={logout}>Logout </button>                   
      </> //Otherwise, Display a button to Logout. When pressed, it calls the logout function.
      )}
    </div>
  )
}

export default Navbar