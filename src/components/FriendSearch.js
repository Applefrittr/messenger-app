import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import URL from "../API/apiURL.js";
import SOCKET from "../API/websocket";

// FriendSearch component filters through all users in the database by the characters entered into the search field by the user.  results displayed in the UI.
// IMPORTANT: currently component pulls ENTIRE user list from DB.  THIS DOES NOT scale well has userbase grows, will have to refactor API to return subsets of users based
// on user's search criteria
function FriendSearch(props) {
  const [users, setUsers] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const formRef = useRef();
  const navigate = useNavigate();

  // Friend request function.  Call to API to add targeted user to the current logged in user's pending friend requests and then update UI with returned user
  const sendRequest = async (e) => {
    e.target.classList.add("disabled");
    e.target.innerText = "Pending...";

    SOCKET.emit(
      "new request",
      props.user.username,
      e.target.value,
      (response) => {
        props.updateOutgoing(response.requests);
      }
    );
  };

  // On the Search component mount, retrieve all users in the DB and filter out the current logged in User from the result - also filter out friends of current User
  useEffect(() => {
    SOCKET.emit("get users", (response) => {
      const allUsers = response.users.filter(
        (user) => user.username !== props.user.username
      );
      setUsers(allUsers);
    });
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

    setFilteredUsers(filteredObjs);
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
        {filteredUsers.length > 0 &&
          filteredUsers.map((user) => {
            let button;
            if (
              props.incoming.some(
                (friend) => friend.username === user.username
              ) ||
              props.outgoing.some((friend) => friend.username === user.username)
            ) {
              button = (
                <button disabled className="disabled nav-links">
                  Pending...
                </button>
              );
            } else if (
              props.currFriends.some(
                (friend) => friend.username === user.username
              )
            ) {
              button = (
                <button disabled className="disabled nav-links">
                  Friend
                </button>
              );
            } else {
              button = (
                <button
                  value={user.username}
                  onClick={sendRequest}
                  className="nav-links"
                >
                  Add friend
                </button>
              );
            }
            return (
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
          })}
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
