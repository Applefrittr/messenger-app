import { useEffect, useRef, useState } from "react";
import "../styles/Friends.css";

function Friends() {
  const [users, setUsers] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const formRef = useRef();

  useEffect(() => {
    const getUsers = async () => {
      const request = await fetch("http://localhost:5000/users");

      const response = await request.json();
      setUsers(response.users);
    };

    getUsers();
  }, []);

  // filteredUsers.forEach(user => {

  // })

  const handleSearch = (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const dataObj = Object.fromEntries(formData.entries());

    console.log(dataObj);

    if (!dataObj.search) {
      setFilteredUsers([]);
      return;
    }

    const filteredObjs = users.filter((user) => {
      console.log(user.username, dataObj.search);
      return user.username.indexOf(dataObj.search) >= 0;
    });

    const searchResults = [];

    filteredObjs.forEach((user) => {
      searchResults.push(
        <div className="search-card">
          <div className="search-avatar">
            <img src={user.avatar} alt="avatar" />
          </div>
          <h1>
            <i>{user.username}</i>
          </h1>
          <div className="search-card-btns">
            <button>Add friend</button>
          </div>
        </div>
      );
    });

    setFilteredUsers(searchResults);
  };

  return (
    <section>
      <p>Friends component</p>
      <form ref={formRef}>
        <label htmlFor="search">Search</label>
        <input name="search" type="text" onChange={handleSearch}></input>
        <button className="nav-links">Get Users</button>
      </form>
      <div className="search-results-container">{filteredUsers}</div>
    </section>
  );
}

export default Friends;
