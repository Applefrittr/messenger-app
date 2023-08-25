import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { useState, useEffect } from "react";
import "./styles/App.css";
import { Routes, Route } from "react-router-dom";

// Main App.  Uses state to determine if there is a jwt in localStorage which sets the user state to be passed to the rest of the app.  Effectively checks if a user is logged in or not and will render either
// the login page or the dashboard
function App() {
  const [token, setToken] = useState(localStorage["webToken"]);
  const [user, setUser] = useState();
  const [msg, setMsg] = useState();

  // useEffect is called to set the user state once a token w/ user payload is retrieved from the API.  This user state will be used throughout the app until it's loggedout or
  // jwt expires
  useEffect(() => {
    // GET call to the back end to have web token decoded and the user payload sent back for use
    const getUser = async () => {
      const request = await fetch("http://localhost:5000/users", {
        mode: "cors",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const response = await request.json();

      //console.log(response.payload);

      if (response.message) {
        setMsg(response.message);
        localStorage.clear();
      } else {
        console.log("user reset");
        console.log("user", user);
        console.log("payload", response.payload);
        setUser(response.payload);
      }
    };

    getUser();
  }, [token]);

  const updateToken = (state) => {
    setToken(state);
  };

  // const updateUser = (state) => {
  //   setUser(state);
  // };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Login updateToken={updateToken} msg={msg} />}
        />

        {user && (
          <Route
            path="/*"
            element={
              <Dashboard updateToken={updateToken} token={token} user={user} />
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
