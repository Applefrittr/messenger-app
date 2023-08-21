import { useEffect, useRef, useState } from "react";

function Dashboard(props) {
  const [user, setUser] = useState();

  // GET call to the back end to have web token decoded and the user payload sent back for use
  useEffect(() => {
    const getUser = async () => {
      const token = await fetch("http://localhost:5000/users", {
        mode: "cors",
        method: "GET",
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });

      const response = await token.json();
      if (response.message) {
        setUser(response.message);
        clearStorage();
      } else {
        setUser(response.payload.username);
      }
    };
    getUser();
  }, []);

  // This clears the local storage of web tokens, effectively logging out the user
  const clearStorage = () => {
    localStorage.clear();
    props.updateToken();
  };

  return (
    <section>
      <h1>Dashboard</h1>
      <p>{user}</p>
      <button onClick={clearStorage}>Logout</button>
    </section>
  );
}

export default Dashboard;
