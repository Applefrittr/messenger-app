import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import GIFSearch from "./GIFSearch";

function Chat(props) {
  const [chat, setChat] = useState();
  const [renderModal, setRenderModal] = useState(false);
  const [gif, setGif] = useState();
  //const [messages, setMessages] = useState();
  const { id } = useParams();
  const formRef = useRef();
  const chatEndRef = useRef();
  const modalRef = useRef(); // modal overlay
  const topRef = useRef();

  const toggleModal = () => {
    modalRef.current.classList.toggle("toggle-modal");
    setRenderModal(!renderModal);
    //props.toggleScroll();
  };

  const renderGif = (url) => {
    setGif(url);
  };

  const removeGif = () => {
    setGif();
  };

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
    setGif();
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
      // let test = [...response.chat.messages];
      // //console.log(test.reverse().splice(0, 10));
      // setMessages(test.slice(0, 10));
    };

    getChat();

    // const observer = new IntersectionObserver(async (entries) => {
    //   if (entries[0].intersectionRatio <= 0) return;

    //   //console.log("TOP OF THE LIST");
    // });

    // observer.observe(topRef.current);
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
            <div ref={topRef}>TOP</div>
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
            {gif && (
              <div className="chat-view-gif-container">
                <img src={gif} alt="GIF URL" className="chat-view-gif" />
                <p onClick={removeGif} className="chat-gif-clear">
                  <b>X</b>
                </p>
              </div>
            )}
            <div className="chat-view-form-elements">
              <button type="button" className="nav-links" onClick={toggleModal}>
                GIF
              </button>
              <input name="text" placeholder="New Message here..."></input>
              <input name="gif" hidden value={gif}></input>
              <button type="button" className="nav-links" onClick={sendMsg}>
                Send
              </button>
            </div>
          </form>
        </div>

        <div className="modal" ref={modalRef}>
          {renderModal && (
            <GIFSearch
              toggleModal={toggleModal}
              token={props.token}
              renderGif={renderGif}
            />
          )}
        </div>
      </section>
    </section>
  );
}

export default Chat;
