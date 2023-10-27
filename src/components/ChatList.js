import NewChat from "./NewChat";
import { useEffect, useRef, useState } from "react";

function ChatList(props) {
  const [chats, setChats] = useState();
  const [renderModal, setRenderModal] = useState(false);
  const modalRef = useRef();

  //toggle New Message modal overlay
  const toggleModal = () => {
    modalRef.current.classList.toggle("toggle-modal");
    setRenderModal(!renderModal);
  };

  // setChats helper function passed to NewChat component to update chat list when a new message is sent
  const updateChats = (data) => {
    setChats(data);
  };

  // on render and whenever the logged in user is updated, retrieve all active chats
  useEffect(() => {
    const getChats = async () => {
      const request = await fetch(
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

      const response = await request.json();

      console.log(response.message);
      setChats(response.chats);
    };

    getChats();
  }, [props.user]);

  return (
    <section className="component-view">
      <section className="component-container">
        <div className="chats-nav">
          <p className="chats-nav-btn">Messages</p>
          <p className="new-msg-btn" onClick={toggleModal}>
            NM
          </p>
        </div>
        <div className="chats-container">
          <p>Chats here</p>
          {/* MAP out an array of HTML elements based on the chat state data */}
          {chats &&
            chats.map((chat) => {
              const users = chat.users
                .filter((user) => user.username !== props.user.username)
                .map((user) => {
                  return { username: user.username, avatar: user.avatar };
                });

              const latestMsg = chat.messages[chat.messages.length - 1].text;
              return (
                <section className="chat-card" key={chat._id}>
                  {users.map((user) => {
                    return (
                      <div className="chat-card-header">
                        <img
                          src={user.avatar}
                          alt="avatar"
                          className="friend-avatar-smaller"
                        />
                        <h3>{user.username}</h3>
                      </div>
                    );
                  })}
                  <p>
                    <i>{latestMsg}</i>
                  </p>
                </section>
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
            />
          )}
        </div>
      </section>
    </section>
  );
}

export default ChatList;
