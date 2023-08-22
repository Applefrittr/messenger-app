import "../styles/Dashboard.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Chats from "./Chats";
import Friends from "./Friends";
import Profile from "./Profile";
import ProfileEdit from "./ProfileEdit";

function Dashboard(props) {
  const navigate = useNavigate();
  let base; // the base to our URL paths is the current logged in user
  if (props.user) base = `/${props.user.username}`;

  // This clears the local storage of web tokens and navigates to login page, effectively logging out the user
  const clearStorage = () => {
    localStorage.clear();
    props.updateToken();
    navigate("/");
  };

  return (
    <section className="dashboard">
      <div className="nav-bar">
        <div>
          <h1>Mylo Messenger</h1>
          {props.user && <p>User: {props.user.username}</p>}
        </div>
        <Link to={base + "/"} className="nav-links">
          Chats
        </Link>
        <Link to={base + "/friends"} className="nav-links">
          Friends
        </Link>
        <Link to={base + "/profile"} className="nav-links">
          Profile
        </Link>
        <button onClick={clearStorage}>Logout</button>
      </div>
      <div className="dashboard-view-container">
        <Routes>
          <Route path={base + "/"} element={<Chats />} />
          <Route path={base + "/friends"} element={<Friends />} />
          <Route
            path={base + "/profile"}
            element={<Profile user={props.user} />}
          />
          <Route
            path={base + "/profile/edit"}
            element={<ProfileEdit user={props.user} />}
          />
        </Routes>
      </div>
    </section>
  );
}

export default Dashboard;
