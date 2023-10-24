import { useEffect, useRef, useState } from "react";

function FriendSearch(props) {
  const [users, setUsers] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const formRef = useRef();

  // Friend request function.  Call to API to add targeted user to the current logged in user's pending friend requests and then update UI with returned user
  const sendRequest = async (e) => {
    e.target.classList.add("disabled");
    e.target.innerText = "Pending...";

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
    // from Dashboard.js, updates the logged in user to reflect changes in UI
    props.updateUser(response.user);
  };

  // On the Search component mount, retrieve all users in the DB and filter out the current logged in User from the result - also filter out friends of current User
  useEffect(() => {
    const getUsers = async () => {
      const request = await fetch("http://localhost:5000/users");

      const response = await request.json();

      const allUsers = response.users.filter(
        (user) => user.username !== props.user.username
      );
      setUsers(allUsers);
    };

    getUsers();
  }, []);

  // handleSearch is fired everythime there is a change to the search input.  Will filter the Users state varible by the current input value and then create DOM elements based on the results.
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
      let button;

      if (
        props.user.requestIn.some(
          (friend) => friend.username === user.username
        ) ||
        props.user.requestOut.some(
          (friend) => friend.username === user.username
        )
      ) {
        button = (
          <button disabled className="disabled">
            Pending...
          </button>
        );
      } else if (
        props.user.friends.some((friend) => friend.username === user.username)
      ) {
        button = (
          <button disabled className="disabled">
            Friend
          </button>
        );
      } else {
        button = (
          <button value={user.username} onClick={sendRequest}>
            Add friend
          </button>
        );
      }

      searchResults.push(
        <div className="friend-card" key={user.username}>
          <div className="friend-card-info">
            <div className="friend-avatar">
              <img src={user.avatar} alt="avatar" />
            </div>
            <h1>
              <i>{user.username}</i>
            </h1>
          </div>
          <div className="friend-card-btns">{button}</div>
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

export default FriendSearch;
