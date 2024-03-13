import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ChatList from "./ChatList";
import Chat from "./Chat";
import Friends from "./Friends";
import Profile from "./Profile";
import FriendProfile from "./FriendProfile";
import Error from "./Error";
import { useEffect, useRef, useState } from "react";
import SOCKET from "../API/websocket";
import CommentIcon from "../assets/comment.png";
import MsgIcon from "../assets/message.png";
import RequestIcon from "../assets/request.png";
import Menu from "../assets/menu.png";

// Dashboard component, main navigation for the currently logged in user to navigate the App.  Displayed in the UI as a navigation bar with buttons that route to the other
// components: Friends.js, ChatList.js, Profile.js.  On component mount, an API call to fetch the FULL user object and stored in state to be used by ALL other component in the App.
// Also has the logout function which will clear the localstorage of the user's webtoken and route back to the login page
function Dashboard(props) {
  const [currUser, setCurrUser] = useState();
  const [friends, setFriends] = useState();
  const [notification, setNotification] = useState();
  const [chats, setChats] = useState();
  const [chatCount, setChatCount] = useState(0);
  const navigate = useNavigate();
  const viewRef = useRef();
  const chatIDRef = useRef();
  const notificationRef = useRef();
  const navbarRef = useRef();
  const friendsRef = useRef();
  const menuRef = useRef();
  friendsRef.current = friends;

  // CSS toggle class to disable page scrolling when a modal is open
  const toggleScroll = () => {
    viewRef.current.classList.toggle("disable-scroll");
  };

  const slideNavbar = () => {
    navbarRef.current.classList.toggle("nav-bar-slide");
    menuRef.current.classList.toggle("spin");
    //SOCKET.emit("all connections");
  };

  const updateFriends = (data) => {
    setFriends(data);
  };

  const updateUser = (state) => {
    console.log("state", state);
    setCurrUser(state);
  };

  const updateCurrChat = (id) => {
    chatIDRef.current = id;
  };

  const updateChatCount = (count) => {
    setChatCount(count);
  };

  // setChats helper function passed to NewChat component to update chat list when a new message is sent
  const updateChats = (data) => {
    setChats(data);
  };

  let base; // the base to our URL paths is the current logged in user
  if (props.user) base = `/${props.user.username}`;

  // This clears the local storage of web tokens and navigates to login page, effectively logging out the user.
  // Also emits to the server that the user has logged out, which will inturn update DB and broadcast
  // th logout to other users
  const logout = async () => {
    SOCKET.emit("user logout", props.user.username);
    localStorage.clear();
    props.updateToken();
    props.updateUser();
    navigate("/");
  };

  // logs the user out of the app but keeps webtoken of user saved to save the user's session
  const appClose = async () => {
    SOCKET.emit("user logout", props.user.username);
  };

  const closeNotification = () => {
    notificationRef.current.classList.remove("notification-animate");
    setTimeout(() => {
      setNotification();
    }, 500);
  };

  // on Dashbaord mount, retrieve fully populated User object (token payload is only partial object)
  useEffect(() => {
    SOCKET.auth.token = props.token;
    SOCKET.connect();

    SOCKET.on("connect", () => {
      if (SOCKET.recovered) {
        console.log("connection re-established");
      } else {
        console.log("new connection established", SOCKET.recovered);
        SOCKET.emit("user login", props.user.username, (response) => {
          setCurrUser(response.user);
          setFriends(response.user.friends);
        });
        SOCKET.emit("get all chats", props.user.username, (response) => {
          setChats(response.chats);
        });
      }
    });

    SOCKET.on("notification", (msg, id) => {
      if (chatIDRef.current !== id) {
        notificationRef.current.classList.add("notification-animate");
        setNotification(msg);
        setTimeout(() => {
          notificationRef.current.classList.remove("notification-animate");
          setTimeout(() => {
            setNotification();
          }, 500);
        }, 5000);
      } else {
        setChatCount((prev) => prev - 1);
      }
      if ((msg.type = "message")) setChatCount((prev) => prev + 1);
    });

    SOCKET.on("friend login", (friendname) => {
      if (friendsRef.current.find((friend) => friend.username === friendname)) {
        SOCKET.emit("get friends", props.user.username, (response) => {
          updateFriends(response.friends);
        });
      }
    });

    SOCKET.on("friend logout", (friendname) => {
      if (friendsRef.current.find((friend) => friend.username === friendname)) {
        SOCKET.emit("get friends", props.user.username, (response) => {
          updateFriends(response.friends);
        });
      }
    });

    SOCKET.on("connect_error", (err) => {
      props.updateTokenErr(err.message);
      navigate("/");
    });

    SOCKET.on("duplicate login", () => {
      props.updateTokenErr("Account logged in elsewhere...");
      navigate("/");
    });

    SOCKET.on("update chat list", () => {
      console.log("updaing list...");
      SOCKET.emit("get all chats", props.user.username, (response) => {
        setChats(response.chats);
      });
    });

    window.addEventListener("unload", appClose);

    return () => {
      window.removeEventListener("unload", appClose);
      SOCKET.off("connect");
      SOCKET.off("notification");
      SOCKET.off("connect_error");
      SOCKET.off("friend login");
      SOCKET.off("friend logout");
      SOCKET.off("duplicate login");
      SOCKET.off("update chat list");
      SOCKET.disconnect();
    };
  }, []);

  return (
    <section className="dashboard">
      <div className="nav-bar" ref={navbarRef}>
        <div className="nav-bar-header">
          <h1>Mylo Messenger</h1>
          {props.user && (
            <div className="nav-bar-user">
              <img src={props.user.avatar} className="friend-avatar-smaller" />
              <p>{props.user.username}</p>
            </div>
          )}
        </div>
        <Link to={base + "/chats"} className="nav-links" onClick={slideNavbar}>
          Chats
          {chatCount > 0 && (
            <div className="new-counter">
              <p>{chatCount}</p>
            </div>
          )}
        </Link>
        <Link
          to={base + "/friends"}
          className="nav-links"
          onClick={slideNavbar}
        >
          Friends
        </Link>
        <Link
          to={base + "/profile"}
          className="nav-links"
          onClick={slideNavbar}
        >
          Profile
        </Link>
        <button onClick={logout} className="nav-links">
          Logout
        </button>
      </div>
      <div className="dashboard-view-container" ref={viewRef}>
        <img
          src={Menu}
          alt="Navbar"
          className="nav-bar-toggle-btn"
          onClick={slideNavbar}
          ref={menuRef}
        ></img>
        <div className="notification-container" ref={notificationRef}>
          {notification && (
            <div className="notification-bubble">
              <p onClick={closeNotification} className="close">
                x
              </p>
              {notification.type === "message" && <img src={MsgIcon} />}
              {notification.type === "comment" && <img src={CommentIcon} />}
              {notification.type === "request" && <img src={RequestIcon} />}
              <span>{notification.msg}</span>
            </div>
          )}
        </div>

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
                  updateChatCount={updateChatCount}
                  friends={friends}
                  chats={chats}
                  updateChats={updateChats}
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
                  updateCurrChat={updateCurrChat}
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
                  friends={friends}
                  updateFriends={updateFriends}
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
                  friends={friends}
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
