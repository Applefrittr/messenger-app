import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";

function Chat(props) {
  const [chat, setChat] = useState();
  const { id } = useParams();
  const formRef = useRef();
  const chatEndRef = useRef();

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

  // On component mount, retrieve a specific chat using the ID in the url parameters, set the component state chat to the returned object
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

      setChat(response.chat);
    };

    getChat();
  }, []);

  // Whenever chat state is set, scroll chat view to dummy div representing the bottom of the scrollable element,
  // showing most recent messages
  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <section className="component-view">
      <section className="component-container chat-component-container">
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
              chat.messages.map((message, i, messages) => {
                return (
                  <MessageBubble
                    message={message}
                    prev={messages[i - 1]}
                    user={props.user}
                  />
                );
              })}
            <div className="chat-last-el" ref={chatEndRef}></div>
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
