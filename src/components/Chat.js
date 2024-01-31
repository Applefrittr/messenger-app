import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import GIFSearch from "./GIFSearch";
import Back from "../assets/back.png";
import SOCKET from "../API/websocket.js";

// Displays the current chat data to the user.  The functionalty to add new messages to the chat as well as GIFs displayed at the botom of the chat log.
// Uses Websockets for live chatting between users
function Chat(props) {
  const [chat, setChat] = useState();
  const [messages, setMessages] = useState([]);
  const [renderModal, setRenderModal] = useState(false);
  const [gif, setGif] = useState();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [prevScrollHeight, setPrevScrollHeight] = useState();

  const { id } = useParams();

  const hasMoreRef = useRef();
  const pageRef = useRef();
  const formRef = useRef();
  const chatEndRef = useRef();
  const modalRef = useRef(); // modal overlay
  const topRef = useRef();
  const chatViewRef = useRef();
  const navigate = useNavigate();
  pageRef.current = page; // ensure we have reference to page state, so callbacks use current page value
  hasMoreRef.current = hasMore;

  const toggleModal = () => {
    modalRef.current.classList.toggle("toggle-modal");
    setRenderModal(!renderModal);
  };

  const renderGif = (url) => {
    setGif(url);
  };

  const removeGif = () => {
    setGif();
  };

  const back = () => {
    navigate(-1);
  };

  // Emitter event to retrieve a new page of messages from the back end, fired when user scrolls to the top of the message log
  const getChatPage = async () => {
    if (!hasMoreRef.current) return;
    SOCKET.emit("get chat page", id, pageRef.current, (response) => {
      setHasMore(response.hasMore);
      response.messages.reverse();
      setMessages((prevMsgs) => [...response.messages, ...prevMsgs]);
      setPrevScrollHeight(chatViewRef.current.scrollHeight);
      setPage((prev) => prev + 1);
    });
  };

  // Callback for intersectionalObserver object linked to the top element in the chat log, fires a fetch request to the API
  // to retrieve a chunk of messages within the Chat object to be displayed in the UI.  Pagination opposed to retrieving the entire
  // chat history.
  const observerCallback = async (entries) => {
    if (entries[0].intersectionRatio <= 0) return;
    getChatPage();
  };

  // sendMsg POSTs a new message to an exisiting chat then GETs the updated chat from the DB to be rendered, effectively showing
  // new messages in the UI immediately
  const sendMsg = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const dataObj = Object.fromEntries(formData.entries());

    SOCKET.emit("send msg", props.user.username, id, dataObj, (response) => {
      setMessages((prevMsgs) => [...prevMsgs, response.message]);
      formRef.current.reset();
      setGif();
      setTimeout(() => {
        chatEndRef.current.scrollIntoView(false);
      }, 0);
    });
  };

  // On component mount, initialize the observer and observe the TOP placeholder div in the chat log; firecall back when in view.  Also, retrieve chat info
  useEffect(() => {
    SOCKET.emit("get chat", id, (response) => {
      setChat(response.chat);
    });

    props.updateCurrChat(id);

    const observer = new IntersectionObserver(observerCallback);
    observer.observe(topRef.current);

    // Socket event listener for new messages recieved from the API
    SOCKET.on("new msg", (message, chatID) => {
      if (chatID === id) {
        setMessages((prevMsgs) => [...prevMsgs, message]);
        setTimeout(() => {
          chatEndRef.current.scrollIntoView(false);
        }, 0);
      }
    });

    return () => {
      if (topRef.current) observer.unobserve(topRef.current);
      SOCKET.off("new msg");
      props.updateCurrChat();
    };
  }, []);

  // Whenever prevScrollHieght state is set, scroll chat view to maintain the scroll position for user, creating a seemless experience
  // when new message data is added to inifinte scroll
  useEffect(() => {
    setTimeout(() => {
      chatViewRef.current.scrollTo({
        top: chatViewRef.current.scrollHeight - prevScrollHeight,
        behavior: "instant",
      });
    }, 0);
  }, [prevScrollHeight]);

  return (
    <section className="chat-component-view">
      <section className="chat-component-container">
        <div className="chat-view-header">
          <img src={Back} alt="Back" className="back-btn" onClick={back}></img>
          {chat &&
            chat.users
              .filter((user) => user.username !== props.user.username)
              .map((user) => {
                return (
                  <Link
                    to={`/${props.user.username}/friends/${user.username}`}
                    className="friend-card-link"
                  >
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="friend-avatar-smaller"
                    />
                    <b>{user.username}</b>
                  </Link>
                );
              })}
        </div>
        <div className="chat-view-container">
          <div className="chat-view-messages" ref={chatViewRef}>
            <div ref={topRef} className="top-fetch-trigger"></div>
            {messages &&
              messages.map((message, i, messages) => {
                return (
                  <MessageBubble
                    message={message}
                    prev={messages[i - 1]}
                    user={props.user}
                    key={message._id}
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
