import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";

function Chat(props) {
  const [chat, setChat] = useState();
  const { id } = useParams();
  const formRef = useRef();

  // sendMsg POSTs a new message to an exisiting chat then GETs the updated chat from teh DB to be rendered, effectively showing
  // new messages in the UI immediately
  const sendMsg = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const dataObj = Object.fromEntries(formData.entries());

    const request = await fetch(
      `http://localhost:5000/users/${props.user.username}/chats/${id}`,
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

    const requestChat = await fetch(
      `http://localhost:5000/users/${props.user.username}/chats/${id}`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseChat = await requestChat.json();

    setChat(responseChat.chat);
    formRef.current.reset();
  };

  useEffect(() => {
    const getChat = async () => {
      const request = await fetch(
        `http://localhost:5000/users/${props.user.username}/chats/${id}`,
        {
          mode: "cors",
          method: "GET",
          headers: {
            Authorization: `Bearer ${props.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const response = await request.json();

      console.log(response.chat);
      setChat(response.chat);
    };

    getChat();
  }, []);

  return (
    <section className="component-view">
      <section className="component-container">
        <div className="chat-view-header">
          {chat &&
            chat.users
              .filter((user) => user.username !== props.user.username)
              .map((user) => {
                return (
                  <>
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="friend-avatar-smaller"
                    />
                    <b>{user.username}</b>
                  </>
                );
              })}
        </div>
        <div className="chat-view-container">
          <div className="chat-view-messages">
            {chat &&
              chat.messages.map((message) => {
                return <MessageBubble message={message} user={props.user} />;
              })}
          </div>
          <form className="chat-view-form" ref={formRef}>
            <button type="button" className="nav-links">
              GIF
            </button>
            <input name="text" placeholder="New Message here..."></input>
            <button type="button" className="nav-links" onClick={sendMsg}>
              Send
            </button>
          </form>
        </div>
      </section>
    </section>
  );
}

export default Chat;
