import "../styles/Dashboard.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Chats from "./Chats";
import Friends from "./Friends";
import Profile from "./Profile";

function Dashboard(props) {
  // This clears the local storage of web tokens, effectively logging out the user
  const clearStorage = () => {
    localStorage.clear();
    props.updateToken();
  };

  return (
    <section className="dashboard">
      <BrowserRouter>
        <div className="nav-bar">
          <div>
            <h1>Mylo Messenger</h1>
            {props.user && <p>User: {props.user.username}</p>}
          </div>
          <Link to="/" className="nav-links">
            Chats
          </Link>
          <Link to="/friends" className="nav-links">
            Friends
          </Link>
          <Link to="/profile" className="nav-links">
            Profile
          </Link>
          <button onClick={clearStorage}>Logout</button>
        </div>
        <div className="dashboard-view-container">
          <Routes>
            <Route path="/" element={<Chats />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/profile" element={<Profile user={props.user} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </section>
  );
}

export default Dashboard;
