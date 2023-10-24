import NewChat from "./NewChat";
import { useRef, useState } from "react";

function ChatList(props) {
  const [chats, setChats] = useState(props.user.chats);
  const [renderModal, setRenderModal] = useState(false);
  const modalRef = useRef();
  const msgFormRef = useRef();

  //toggle New Message modal overlay
  const toggleModal = () => {
    modalRef.current.classList.toggle("toggle-modal");
    setRenderModal(!renderModal);
  };

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
          {chats &&
            chats.map((chat) => {
              return (
                <section>
                  <p>Chat User</p>
                  <p>recent msg</p>
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
            />
          )}
        </div>
      </section>
    </section>
  );
}

export default ChatList;
