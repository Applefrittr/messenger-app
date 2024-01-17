import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Login component will log returning user's into the App or provide the ability for a new user to sign up.  Will also display errors if user fails either login or does not fill out
// user sign up correctly.  On successful login, a webtoken is passed back to component in which it is saved to localstorage for session persistance and the user is routed to the Dashboard component.
// IMPORTANT:  Current webtoken expiration set to 24 hours with no refresh token functionality.  SEE API for details
function Login(props) {
  const [errors, setErrors] = useState();
  const navigate = useNavigate();

  const signinRef = useRef();
  const signupRef = useRef();

  const toggleForms = () => {
    signinRef.current.classList.toggle("hide-form");
    signupRef.current.classList.toggle("hide-form");
    setErrors();
  };

  // Sign up function, sends form data input by user to the API for user creation
  const signUp = async (e) => {
    e.preventDefault();

    // FormData API to pull info from the form then convert to standard JS object
    const formData = new FormData(signupRef.current);
    const dataObj = Object.fromEntries(formData.entries());

    const submit = await fetch(`https://localhost:5000/users/create`, {
      mode: "cors",
      method: "Post",
      body: JSON.stringify(dataObj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await submit.json();
    if (response.errors) {
      console.log(response.errors);
      const errorArray = [];
      response.errors.forEach((error) => {
        errorArray.push(<p>- {error.msg}</p>);
      });
      setErrors(errorArray);
    } else {
      console.log(response.message);
      toggleForms();
    }
  };

  // Login function sends user credentials to the API for authentication
  const signIn = async (e) => {
    e.preventDefault();
    props.updateTokenErr();

    // FormData API to pull info from the form then convert to standard JS object
    const formData = new FormData(signinRef.current);
    const dataObj = Object.fromEntries(formData.entries());

    const request = await fetch(`https://localhost:5000/users/login`, {
      mode: "cors",
      method: "Post",
      body: JSON.stringify(dataObj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await request.json();
    if (response.errors) {
      console.log(response.errors);
      const errorArray = [];
      response.errors.forEach((error) => {
        errorArray.push(<p>- {error.msg}</p>);
      });
      setErrors(errorArray);
    } else {
      if (response.accessToken) {
        localStorage.setItem("webToken", response.accessToken); // Store token in localStorage
        props.updateToken(localStorage["webToken"]); // Call updateToken to update token state in App.js
        setErrors();
        navigate(`/${dataObj.username}/`); // navigate to the Dashboard component with the current username as the URL base
      }
    }
  };

  return (
    <div className="Login">
      {props.tokenErr && (
        <div className="login-msg-container">{props.tokenErr}</div>
      )}
      <div className="login-container">
        <form className="signin-form" action="" method="POST" ref={signinRef}>
          <h1>Sign In</h1>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" />
          <div className="login-buttons">
            <button type="submit" onClick={signIn} className="nav-links">
              Sign in
            </button>
            <p>-OR-</p>
            <button type="button" onClick={toggleForms} className="nav-links">
              Sign Up
            </button>
          </div>
        </form>
        <form className="signup-form hide-form" ref={signupRef}>
          <h1>Sign Up</h1>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" required />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" required />
          <label htmlFor="confirm-password">Confirm Password</label>
          <input type="password" name="confirm-password" required />
          <div className="login-buttons">
            <button type="submit" onClick={signUp} className="nav-links">
              Sign Up
            </button>
            <p>-OR-</p>
            <button type="button" onClick={toggleForms} className="nav-links">
              Cancel
            </button>
          </div>
        </form>
        {errors && <div className="login-msg-container">{errors}</div>}
        <div className="label">Mylo Messenger</div>
      </div>
    </div>
  );
}

export default Login;
