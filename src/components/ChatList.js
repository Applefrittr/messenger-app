import NewChat from "./NewChat";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NewIcon from "../assets/newChat.png";
import Arrow from "../assets/forward.png";
import URL from "../API/apiURL.js";
import SOCKET from "../API/websocket";

// ChatLists displays a list of chats that the current user is involved in with each chat card displying the other user/users involded, their avatars, and the most recent message and timestamp.  Each card is a link
// which will route to the Chat.js component with that specific chat's data displayed
// IMPORTANT:  Group chat origination and functionality currently not implemented
function ChatList(props) {
  const [chats, setChats] = useState();
  const [renderModal, setRenderModal] = useState(false);
  const modalRef = useRef();
  const navigate = useNavigate();

  const chatsRef = useRef();
  chatsRef.current = chats;

  //toggle New Message modal overlay
  const toggleModal = () => {
    modalRef.current.classList.toggle("toggle-modal");
    setRenderModal(!renderModal);
  };

  // setChats helper function passed to NewChat component to update chat list when a new message is sent
  const updateChats = (data) => {
    setChats(data);
  };

  const readMessages = (chatID, username) => {
    SOCKET.emit("read messages", chatID, username);
  };

  // Time stamp function which will take timestamp attribute of a Message object and convert to a user friendly timestamp
  const timeStamped = (time) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const messageTime = new Date(time).getDate();

    if (today.getDate() === messageTime)
      return new Date(time).toLocaleTimeString("en", {
        timeStyle: "short",
      });
    else if (yesterday.getDate() === messageTime) return "Yesterday";
    else return new Date(time).toLocaleString("en", { dateStyle: "short" });
  };

  // on render and whenever the logged in user is updated, retrieve all active chats
  useEffect(() => {
    SOCKET.emit("get all chats", props.user.username, (response) => {
      setChats(response.chats);
    });

    SOCKET.on("update chat list", () => {
      SOCKET.emit("get all chats", props.user.username, (response) => {
        setChats(response.chats);
      });
    });
    return () => {
      SOCKET.off("update chat list");
    };
  }, []);

  useEffect(() => {
    if (chats) {
      let unreadCount = 0;

      chats.forEach((chat) => {
        if (chat.newMsgCounter) {
          const unreadObj = chat.newMsgCounter.find(
            (obj) => obj.user === props.user.username
          );
          if (unreadObj) unreadCount += unreadObj.unread;
        }
      });

      props.updateChatCount(unreadCount);
    }
  }, [chats]);

  return (
    <section className="component-view">
      <section className="component-container">
        <div className="chats-nav">
          <p className="chats-nav-btn">Messages</p>
          {/* <p className="new-msg-btn" onClick={toggleModal}>
            NM
          </p> */}
          <img
            src={NewIcon}
            alt="new chat"
            onClick={toggleModal}
            className="new-msg-btn"
          />
        </div>
        <div className="chats-list-container">
          {/* MAP out an array of HTML elements based on the chat state data */}
          {chats &&
            chats.map((chat) => {
              const users = chat.users
                .filter((user) => user.username !== props.user.username)
                .map((user) => {
                  return { username: user.username, avatar: user.avatar };
                });

              //const latestMsg = chat.messages[0];
              let unreadMsgs;
              if (chat.newMsgCounter) {
                const unreadObj = chat.newMsgCounter.find(
                  (obj) => obj.user === props.user.username
                );
                if (unreadObj) unreadMsgs = unreadObj.unread;
              }

              return (
                <Link
                  to={"/" + props.user.username + "/chats/" + chat._id}
                  className="chat-card"
                  key={chat._id}
                  onClick={() => readMessages(chat._id, props.user.username)}
                >
                  {unreadMsgs > 0 && <div className="unread-marker" />}
                  <div className="chat-card-users">
                    {users.map((user) => {
                      return (
                        <div className="chat-card-header" key={user._id}>
                          <img
                            src={user.avatar}
                            alt="avatar"
                            className="friend-avatar-smaller"
                          />
                          <h3>{user.username}</h3>
                        </div>
                      );
                    })}
                  </div>
                  <p>
                    <i>{chat.latestMsg.text}</i>
                  </p>
                  <p className="chat-card-time">
                    {timeStamped(chat.latestMsg.timestamp)}
                  </p>
                  <img src={Arrow} alt="Open" className="chat-arrow"></img>
                </Link>
              );
            })}
        </div>

        <div className="modal" ref={modalRef}>
          {renderModal && (
            <NewChat
              toggleModal={toggleModal}
              user={props.user}
              token={props.token}
              updateUser={props.updateUser}
              chats={chats}
              updateChats={updateChats}
              friends={props.friends}
            />
          )}
        </div>
      </section>
    </section>
  );
}

export default ChatList;
