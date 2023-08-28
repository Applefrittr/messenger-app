import { useEffect, useState } from "react";

function Friends() {
  const [users, setUsers] = useState();

  useEffect(() => {
    const getUsers = async () => {
      const request = await fetch("http://localhost:5000/users");

      const response = await request.json();
      setUsers(response.users);
    };

    getUsers();
  }, []);

  const userList = () => {
    console.log(users);
  };

  return (
    <section>
      <p>Friends component</p>
      <button className="nav-links" onClick={userList}>
        Get Users
      </button>
    </section>
  );
}

export default Friends;
