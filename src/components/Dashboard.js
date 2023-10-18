import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import Chats from "./Chats";
import Friends from "./Friends";
import Profile from "./Profile";
import FriendProfile from "./FriendProfile";
import { useEffect, useState } from "react";

function Dashboard(props) {
  const [currUser, setCurrUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrUser = async () => {
      const request = await fetch(
        `http://localhost:5000/users/${props.user.username}/profile`
      );

      const response = await request.json();

      console.log("dashboard user", response.user);
      setCurrUser(response.user);
    };

    getCurrUser();
  }, []);

  const updateUser = (state) => {
    console.log("state", state);
    setCurrUser(state);
  };

  let base; // the base to our URL paths is the current logged in user
  if (props.user) base = `/${props.user.username}`;

  // This clears the local storage of web tokens and navigates to login page, effectively logging out the user
  const logout = () => {
    localStorage.clear();
    props.updateToken();
    props.updateUser();
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
        <button onClick={logout}>Logout</button>
      </div>
      <div className="dashboard-view-container">
        {currUser && (
          <Routes>
            <Route path={base + "/"} element={<Chats />} />
            <Route
              path={base + "/friends"}
              element={
                <Friends
                  user={currUser}
                  token={props.token}
                  updateUser={updateUser}
                />
              }
            />
            <Route
              path={base + "/friends/:friend"}
              element={
                <FriendProfile
                  user={props.user}
                  token={props.token}
                  updateUser={updateUser}
                />
              }
            />
            <Route
              path={base + "/profile"}
              element={
                <Profile
                  user={currUser}
                  token={props.token}
                  updateUser={updateUser}
                />
              }
            />
          </Routes>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
