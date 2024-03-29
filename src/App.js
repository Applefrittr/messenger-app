import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Error from "./components/Error";
import { useState, useEffect } from "react";
import "./styles/App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import URL from "./API/apiURL";

// Main App.  Uses state to determine if there is a jwt in localStorage which sets the user state to be passed to the rest of the app.  Effectively checks if a user is logged in or not and will render either
// the login page or the dashboard.  The token payload (user object) is used to to route the user's Dashboard, in which the full user object is then pulled from the API to be used for the rest of the App.
function App() {
  const [token, setToken] = useState(localStorage["webToken"]); // set token to locally stored token for logged in persistance
  const [tokenErr, setTokenErr] = useState();
  const [user, setUser] = useState(); // JWT payload with user info
  const navigate = useNavigate();

  // useEffect is called to set the user state once a token w/ user payload is retrieved from the API.  This user state will be used throughout the app until it's loggedout or
  // jwt expires
  useEffect(() => {
    // GET call to the back end to have web token decoded and the user payload sent back for use
    const getUser = async () => {
      if (token) {
        const request = await fetch(`${URL}/users/login`, {
          mode: "cors",
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const response = await request.json();

        // if token expired, navigate to to login page.  Else, navigate to user dashboard
        if (response.error) {
          localStorage.clear();
          setTokenErr(response.error);
          navigate("/");
        } else {
          setUser(response.payload);
          navigate(`/${response.payload.username}/chats`);
        }
      }
    };

    getUser();
  }, [token]);

  const updateToken = (state) => {
    setToken(state);
  };

  const updateUser = (state) => {
    setUser(state);
  };

  const updateTokenErr = (state) => {
    setTokenErr(state);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Login
            updateToken={updateToken}
            tokenErr={tokenErr}
            updateTokenErr={updateTokenErr}
          />
        }
      />

      {user && (
        <Route
          path="/*"
          element={
            <Dashboard
              updateToken={updateToken}
              updateUser={updateUser}
              updateTokenErr={updateTokenErr}
              token={token}
              user={user}
            />
          }
        />
      )}

      {!user && <Route path="/*" element={<Error />} />}
    </Routes>
  );
}

export default App;
