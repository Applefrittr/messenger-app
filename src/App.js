import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { useState, useEffect } from "react";
import "./styles/App.css";

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
      if (response.message) {
        setMsg(response.message);
        localStorage.clear();
      } else {
        setUser(response.payload);
      }
    };
    getUser();
  }, [token]);

  const updateToken = (state) => {
    setToken(state);
  };

  return (
    <div>
      {token ? (
        <Dashboard updateToken={updateToken} token={token} user={user} />
      ) : (
        <Login updateToken={updateToken} msg={msg} />
      )}
    </div>
  );
}

export default App;
