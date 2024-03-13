import NewChat from "./NewChat";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import NewIcon from "../assets/newChat.png";
import Arrow from "../assets/forward.png";
import SOCKET from "../API/websocket";

// ChatLists displays a list of chats that the current user is involved in with each chat card displying the other user/users involded, their avatars, and the most recent message and timestamp.  Each card is a link
// which will route to the Chat.js component with that specific chat's data displayed
function ChatList(props) {
  // const [chats, setChats] = useState();
  const [renderModal, setRenderModal] = useState(false);
  const modalRef = useRef();

  const chatsRef = useRef();
  chatsRef.current = props.chats;

  //toggle New Message modal overlay
  const toggleModal = () => {
    modalRef.current.classList.toggle("toggle-modal");
    setRenderModal(!renderModal);
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

  useEffect(() => {
    if (props.chats) {
      let unreadCount = 0;

      props.chats.forEach((chat) => {
        if (chat.newMsgCounter) {
          const unreadObj = chat.newMsgCounter.find(
            (obj) => obj.user === props.user.username
          );
          if (unreadObj) unreadCount += unreadObj.unread;
        }
      });

      props.updateChatCount(unreadCount);
    }
  }, [props.chats]);

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
          {props.chats &&
            props.chats.map((chat) => {
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
                  {chat.latestMsg && (
                    <p>
                      <i>
                        {chat.latestMsg.text.length > 50
                          ? chat.latestMsg.text.substring(0, 50) + "..."
                          : chat.latestMsg.text}
                      </i>
                    </p>
                  )}
                  {chat.latestMsg && (
                    <p className="chat-card-time">
                      {timeStamped(chat.latestMsg.timestamp)}
                    </p>
                  )}
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
              chats={props.chats}
              updateChats={props.updateChats}
              friends={props.friends}
            />
          )}
        </div>
      </section>
    </section>
  );
}

export default ChatList;
