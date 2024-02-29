import { useEffect, useRef, useState } from "react";
import Linkify from "linkify-react";
import useLinkify from "../hooks/useLinkify";

// Component for the message bubble's used in the Chat.js and NewChat.js components.  Takes 2 consecutive message objects (current and previous) to construct a message bubble with
// message text, GIF if included, and will determine if a timestamp is also to be displayed.  The timestamp is displayed in the UI if the time between the the current message and previous
// message exceeds a given threshold
function MessageBubble(props) {
  //const parsedText = useLinkify(props.message.text);
  const [dateLine, setDateLine] = useState(false);
  const msgRef = useRef();
  const timeRef = useRef();
  const imgRef = useRef();
  const containerRef = useRef();

  // resize the img to ensure it's aspect ratio is preserved
  const imgResize = () => {
    console.log(imgRef.current);
    imgRef.current.style.width = 200;
    imgRef.current.style.height = "auto";
  };

  // on render, CSS classes are added to component elements to identify sender and reciever, as well as render
  // date's between messages as well as timestamps
  useEffect(() => {
    // Add classes to differentiate messages from the sender and reciever depending on which user is logged in
    if (props.user.username === props.message.username) {
      msgRef.current.classList.add("send");
      timeRef.current.classList.add("timestamp-send");
      containerRef.current.classList.add("left");
    } else {
      msgRef.current.classList.add("recieve");
      timeRef.current.classList.add("timestamp-recieve");
      containerRef.current.classList.add("right");
    }
    setTimeout(() => {
      msgRef.current.classList.add("message-bubble-fadein");
    }, 0);

    // if the current message is sent in a leter date than the previous message, render in the date the message is sent - the date line
    if (
      props.prev &&
      new Date(props.message.timestamp).getDate() !==
        new Date(props.prev.timestamp).getDate()
    ) {
      setDateLine(true);
    } else if (!props.prev) setDateLine(true);
    else setDateLine(false);

    // if the difference between current message and previous message is less than 2 minutes, do not render timestamp
    if (
      props.prev &&
      new Date(props.message.timestamp).getTime() -
        new Date(props.prev.timestamp).getTime() <=
        120000
    ) {
      timeRef.current.classList.add("timestamp-hide");
    }
  }, []);

  const linkOptions = {
    target: "_blank",
  };

  return (
    <div className="message-container">
      {dateLine && (
        <div className="date-line">
          <p>
            <i>{new Date(props.message.timestamp).toDateString()}</i>
          </p>
          <hr></hr>
        </div>
      )}
      <p className="message-bubble-timestamp" ref={timeRef}>
        <i>
          {new Date(props.message.timestamp).toLocaleTimeString("en", {
            timeStyle: "short",
          })}
        </i>
      </p>

      <div className="avatar-bubble-container" ref={containerRef}>
        {props.message.groupChat &&
          props.message.avatar &&
          props.user.username !== props.message.username && (
            <img src={props.message.avatar} className="chat-avatar" />
          )}
        <div className="message-bubble" key={props.message._id} ref={msgRef}>
          {props.message.groupChat &&
            props.user.username !== props.message.username && (
              <i className="bubble-username-label">
                {props.message.username} says...
              </i>
            )}
          {props.message.gif && (
            <img
              src={props.message.gif}
              alt="gif"
              className="chat-view-gif"
              onLoad={imgResize}
              ref={imgRef}
            />
          )}
          <Linkify>
            <i className="linkify-text">{props.message.text}</i>
          </Linkify>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
