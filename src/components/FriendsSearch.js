import { useEffect, useRef, useState } from "react";

function FriendsSearch(props) {
  const [users, setUsers] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const formRef = useRef();

  const sendRequest = async (e) => {
    const request = await fetch(
      `http://localhost:5000/users/${props.user.username}/request/${e.target.value}`,
      {
        mode: "cors",
        method: "POST",
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = await request.json();

    console.log(response.message);
  };

  useEffect(() => {
    const getUsers = async () => {
      const request = await fetch("http://localhost:5000/users");

      const response = await request.json();
      setUsers(response.users);
    };

    getUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const dataObj = Object.fromEntries(formData.entries());

    //console.log(dataObj);

    if (!dataObj.search) {
      setFilteredUsers([]);
      return;
    }

    const filteredObjs = users.filter((user) => {
      //console.log(user.username, dataObj.search);
      return user.username.indexOf(dataObj.search) >= 0;
    });

    const searchResults = [];

    filteredObjs.forEach((user) => {
      searchResults.push(
        <div className="friend-card" key={user.username}>
          <div className="friend-avatar">
            <img src={user.avatar} alt="avatar" />
          </div>
          <h1>
            <i>{user.username}</i>
          </h1>
          <div className="search-card-btns">
            <button value={user.username} onClick={sendRequest}>
              Add friend
            </button>
          </div>
        </div>
      );
    });

    setFilteredUsers(searchResults);
  };

  return (
    <section className="search-container">
      <form ref={formRef}>
        <input
          name="search"
          type="text"
          onChange={handleSearch}
          placeholder="enter username..."
        ></input>
        <button className="nav-links">Search</button>
      </form>
      <div className="search-results-container">
        {filteredUsers.length > 0 && filteredUsers}
        {filteredUsers.length === 0 && (
          <p>
            <i>No Results...</i>
          </p>
        )}
      </div>
    </section>
  );
}

export default FriendsSearch;
