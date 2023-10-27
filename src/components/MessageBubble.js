import { useEffect, useRef } from "react";

function MessageBubble(props) {
  const msgRef = useRef();

  useEffect(() => {
    if (props.user.username === props.message.username) {
      msgRef.current.classList.add("bubble-user");
    } else msgRef.current.classList.add("bubble-other");
  }, []);

  return (
    <div className="message-bubble" ref={msgRef}>
      <p>{props.message.text}</p>
    </div>
  );
}

export default MessageBubble;
