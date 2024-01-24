import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import URL from "../API/apiURL.js";

// NewChat component is a modal popup window in the accessible in the ChatsList.js component.  The user can start chats with friends
// in his friends list or continue an ongoing chat.  The search bar will look for exisiting chats before starting a brand new chat.
// Once a message is sent, this component then routes to the Chat.js component with the new/exisiting chat data
// IMPORTANT:  Group chat origination and functionality currently not implemented
function NewChat(props) {
  const [search, setSearch] = useState();
  const [displayChat, setDisplayChat] = useState();
  const formRef = useRef();
  const searchFieldRef = useRef();
  const sendRef = useRef();
  const chatIDRef = useRef();
  const navigate = useNavigate();

  // When every search field is changed, filter the user's friends list and display the results int he UI
  const handleSearch = (e) => {
    if (!e.target.value) {
      setSearch();
      setDisplayChat();
    } else {
      const filtered = props.user.friends.filter((friend) => {
        return friend.username.indexOf(e.target.value) >= 0;
      });
      setSearch(filtered);
    }
  };

  // search bar to choose recipient of new message.  If a chat already exists with selected recipient,
  // message log will be displayed
  const chooseRecipient = (e) => {
    //e.preventDefault();
    if (e.target.value) {
      searchFieldRef.current.value = e.target.value;
      //searchFieldRef.current.disabled = true;
      sendRef.current.disabled = false;

      console.log(e.target.value);

      // Check to see if there is an existing chat by iterating through user's exisiting chats.  If so, set hidden input value to chat's ._id to be passed to API
      const chatMembers = e.target.value.split(",");
      chatMembers.push(props.user.username);
      console.log(chatMembers);

      console.log(JSON.stringify(chatMembers));

      for (const chat of props.chats) {
        console.log(chat);
        if (
          JSON.stringify(chatMembers.sort()) ===
          JSON.stringify(chat.usernames.sort())
        ) {
          chatIDRef.current.value = chat._id;
          setDisplayChat(chat.messages.reverse());
          break;
        } else {
          setDisplayChat();
        }
      }

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

      const request = await fetch(`${URL}/users/${props.user.username}/chats`, {
        mode: "cors",
        method: "POST",
        body: JSON.stringify(dataObj),
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });

      const response = await request.json();

      console.log(response.message);

      const requestChats = await fetch(
        `${URL}/users/${props.user.username}/chats`,
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

      navigate(`/${props.user.username}/chats/${response.id}`);
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
          {displayChat &&
            displayChat.map((message, i, messages) => {
              return (
                <MessageBubble
                  message={message}
                  prev={messages[i - 1]}
                  user={props.user}
                />
              );
            })}
        </div>
        <div className="new-msg-input-container">
          <input
            name="chatID"
            placeholder="chatID here"
            ref={chatIDRef}
            hidden
          ></input>
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
