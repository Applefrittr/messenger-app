import { useEffect, useRef, useState } from "react";

function NewChat(props) {
  const [search, setSearch] = useState();
  const formRef = useRef();
  const searchFieldRef = useRef();
  const sendRef = useRef();

  // When every search field is changed, filter the user's friends list and display the results int he UI
  const handleSearch = (e) => {
    if (!e.target.value) setSearch();
    else {
      const filtered = props.user.friends.filter((friend) => {
        return friend.username.indexOf(e.target.value) >= 0;
      });
      setSearch(filtered);
    }
  };

  const chooseRecipient = (e) => {
    //e.preventDefault();
    if (e.target.value) {
      searchFieldRef.current.value = e.target.value;
      //searchFieldRef.current.disabled = true;
      sendRef.current.disabled = false;

      setSearch();
    } else return;
  };

  const sendMsg = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const dataObj = Object.fromEntries(formData.entries());

    if (!dataObj.users) console.log("Choose recipient");
    else {
      // create an array of users to be passed to the API
      dataObj.users = dataObj.users.split(",");

      const request = await fetch(
        `http://localhost:5000/users/${props.user.username}/chats`,
        {
          mode: "cors",
          method: "POST",
          body: JSON.stringify(dataObj),
          headers: {
            Authorization: `Bearer ${props.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const response = await request.json();

      console.log(response.message);

      const requestChats = await fetch(
        `http://localhost:5000/users/${props.user.username}/chats`,
        {
          mode: "cors",
          method: "GET",
          headers: {
            Authorization: `Bearer ${props.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseChats = await requestChats.json();
      props.updateChats(responseChats.chats);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      formRef.current.classList.add("toggle-msg-form");
    }, 0);
  }, []);

  return (
    <form className="new-msg-form" ref={formRef}>
      <div className="new-msg-header">
        <h2>New Message</h2>
        <p onClick={props.toggleModal} className="form-close">
          <b>X</b>
        </p>
      </div>
      <div className="chat-container">
        <div className="search-field">
          <label htmlFor="search">To:</label>
          <input
            name="users"
            onChange={handleSearch}
            ref={searchFieldRef}
          ></input>
        </div>
        {search && (
          <div className="search-results">
            {search.map((friend) => {
              return (
                <button
                  className="result-card"
                  key={friend.username}
                  onClick={chooseRecipient}
                  type="button"
                  value={friend.username}
                >
                  <img
                    src={friend.avatar}
                    alt="avatar"
                    className="friend-avatar-small"
                  />
                  {friend.username}
                </button>
              );
            })}
          </div>
        )}
        <div className="chat-view">
          <p>messages here</p>
        </div>
        <div className="new-msg-input-container">
          <input
            name="text"
            placeholder="New message here..."
            className="msg-input"
          ></input>
          <button
            type="button"
            className="nav-links"
            ref={sendRef}
            onClick={sendMsg}
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
}

export default NewChat;
