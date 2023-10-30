import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";

function Chat(props) {
  const [chat, setChat] = useState();
  const { id } = useParams();

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
        <div className="chat-view-messages">
          {chat &&
            chat.messages.map((message) => {
              return <MessageBubble message={message} user={props.user} />;
            })}
        </div>
      </section>
    </section>
  );
}

export default Chat;
