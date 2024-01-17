import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ChatList from "./ChatList";
import Chat from "./Chat";
import Friends from "./Friends";
import Profile from "./Profile";
import FriendProfile from "./FriendProfile";
import Error from "./Error";
import { useEffect, useRef, useState } from "react";

// Dashboard component, main navigation for the currently logged in user to navigate the App.  Displayed in the UI as a navigation bar with buttons that route to the other
// components: Friends.js, ChatList.js, Profile.js.  On component mount, an API call to fetch the FULL user object and stored in state to be used by ALL other component in the App.
// Also has the logout function which will clear the localstorage of the user's webtoken and route back to the login page
function Dashboard(props) {
  const [currUser, setCurrUser] = useState();
  const navigate = useNavigate();
  const viewRef = useRef();

  // CSS toggle class to disable page scrolling when a modal is open
  const toggleScroll = () => {
    viewRef.current.classList.toggle("disable-scroll");
  };

  // on Dashbaord mount, retrieve fully popualted User object (token payload is only partial object)
  useEffect(() => {
    const getCurrUser = async () => {
      const request = await fetch(
        `https://localhost:5000/users/${props.user.username}/profile`
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
  const logout = async () => {
    await fetch(`https://localhost:5000/users/${props.user.username}/logout`, {
      mode: "cors",
      method: "POST",
      headers: {
        Authorization: `Bearer ${props.token}`,
        "Content-Type": "application/json",
      },
    });

    localStorage.clear();
    props.updateToken();
    props.updateUser();
    navigate("/");
  };

  return (
    <section className="dashboard">
      <div className="nav-bar">
        <div className="nav-bar-header">
          <h1>Mylo Messenger</h1>
          {props.user && <p>User: {props.user.username}</p>}
        </div>
        <Link to={base + "/chats"} className="nav-links">
          Chats
        </Link>
        <Link to={base + "/friends"} className="nav-links">
          Friends
        </Link>
        <Link to={base + "/profile"} className="nav-links">
          Profile
        </Link>
        <button onClick={logout} className="nav-links">
          Logout
        </button>
      </div>
      <div className="dashboard-view-container" ref={viewRef}>
        {currUser && (
          <Routes>
            <Route
              path={base + "/chats"}
              element={
                <ChatList
                  user={currUser}
                  token={props.token}
                  updateUser={updateUser}
                  updateTokenErr={props.updateTokenErr}
                />
              }
            />
            <Route
              path={base + "/chats/:id"}
              element={
                <Chat
                  user={currUser}
                  token={props.token}
                  updateUser={updateUser}
                  updateTokenErr={props.updateTokenErr}
                />
              }
            />
            <Route
              path={base + "/friends"}
              element={
                <Friends
                  user={currUser}
                  token={props.token}
                  updateUser={updateUser}
                  updateTokenErr={props.updateTokenErr}
                />
              }
            />
            <Route
              path={base + "/friends/:friend"}
              element={
                <FriendProfile
                  user={currUser}
                  token={props.token}
                  updateUser={updateUser}
                  toggleScroll={toggleScroll}
                  updateTokenErr={props.updateTokenErr}
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
                  toggleScroll={toggleScroll}
                  updateTokenErr={props.updateTokenErr}
                />
              }
            />
            <Route path={base + "/error"} element={<Error />} />
          </Routes>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
