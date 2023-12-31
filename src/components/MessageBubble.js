import { useEffect, useRef, useState } from "react";

function MessageBubble(props) {
  const [dateLine, setDateLine] = useState(false);
  const msgRef = useRef();
  const timeRef = useRef();

  // on render, CSS classes are added to component elements to identify sender and reciever, as well as render
  // date's between messages as well as timestamps
  useEffect(() => {
    // Add classes to differentiate messages from the sender and reciever depending on which user is logged in
    if (props.user.username === props.message.username) {
      msgRef.current.classList.add("send");
      timeRef.current.classList.add("timestamp-send");
    } else {
      msgRef.current.classList.add("recieve");
      timeRef.current.classList.add("timestamp-recieve");
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

      <div className="message-bubble" ref={msgRef} key={props.message._id}>
        {props.message.gif && (
          <img src={props.message.gif} alt="gif" className="chat-view-gif" />
        )}
        <p>{props.message.text}</p>
      </div>
    </div>
  );
}

export default MessageBubble;
