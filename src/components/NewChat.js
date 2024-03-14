import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import SOCKET from "../API/websocket";

// NewChat component is a modal popup window in the accessible in the ChatsList.js component.  The user can start chats with friends
// in his friends list or continue an ongoing chat.  The search bar will look for exisiting chats before starting a brand new chat.
// Once a message is sent, this component then routes to the Chat.js component with the new/exisiting chat data
// IMPORTANT:  Group chat origination and functionality currently not implemented
function NewChat(props) {
  const [search, setSearch] = useState();
  const [displayChat, setDisplayChat] = useState();
  const [recipients, setRecipients] = useState([]);
  const [eligibleRecipients, setEligibleRecipients] = useState(props.friends);
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
      const filtered = eligibleRecipients.filter((friend) => {
        return friend.username.indexOf(e.target.value) >= 0;
      });
      setSearch(filtered);
    }
  };

  // search bar to choose recipient of new message.  If a chat already exists with selected recipient(s),
  // message log will be displayed.  Will remove the selected target from eligible recipeint list
  const chooseRecipient = (e) => {
    if (e.target.value) {
      searchFieldRef.current.value = e.target.value;
      sendRef.current.disabled = false;

      // Check to see if there is an existing chat by iterating through user's exisiting chats.  If so, set hidden input value to chat's ._id to be passed to API
      const chatMembers = [props.user.username, e.target.value, ...recipients];

      for (const chat of props.chats) {
        if (
          JSON.stringify(chatMembers.sort()) ===
          JSON.stringify(chat.usernames.sort())
        ) {
          chatIDRef.current.value = chat._id;
          setDisplayChat(chat.messages.reverse());
          break;
        } else {
          chatIDRef.current.value = null;
          setDisplayChat();
        }
      }
      searchFieldRef.current.value = "";
      setRecipients((prev) => [e.target.value, ...prev]);
      setEligibleRecipients(
        eligibleRecipients.filter(
          (recipient) => !chatMembers.includes(recipient.username)
        )
      );
      setSearch();
    } else return;
  };

  // onCLick function to remove target from recipeint list and add it back to the eligible recipient list
  const removeRecipient = (target) => {
    const chatMembers = recipients.filter((recipient) => recipient !== target);
    setRecipients(chatMembers);
    const recipient = props.friends.find(
      (friend) => friend.username === target
    );
    setEligibleRecipients((prev) => [recipient, ...prev]);

    const chatGroup = [props.user.username, ...chatMembers];

    for (const chat of props.chats) {
      if (
        JSON.stringify(chatGroup.sort()) ===
        JSON.stringify(chat.usernames.sort())
      ) {
        chatIDRef.current.value = chat._id;
        setDisplayChat(chat.messages.reverse());
        break;
      } else {
        chatIDRef.current.value = null;
        setDisplayChat();
      }
    }
  };

  const sendMsg = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const dataObj = Object.fromEntries(formData.entries());
    // create an array of users to be passed to the API
    dataObj.users = recipients;

    SOCKET.emit(
      "send new message",
      props.user.username,
      dataObj,
      (response) => {
        navigate(`/${props.user.username}/chats/${response.id}`);
      }
    );
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
        <div className="recipients-container">
          {recipients &&
            recipients.map((recipient) => {
              return (
                <div className="recipient-name">
                  <i>{recipient}</i>
                  <p onClick={() => removeRecipient(recipient)}>x</p>
                </div>
              );
            })}
        </div>

        <div className="search-field">
          <label htmlFor="search">To:</label>
          <input
            name="users"
            onChange={handleSearch}
            ref={searchFieldRef}
          ></input>
        </div>

        <div className="chat-view">
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
