import { useRef } from "react";

function Comment(props) {
  const dropRef = useRef();

  // time stamp function returns either "today" or "yesterday" if comment was made in the past 2 day,
  // otherswise return the date
  const timeStamped = () => {
    const today = new Date().getTime();
    const commentTime = new Date(props.comment.timestamp).getTime();

    if (today - commentTime <= 86400000) return "Today";
    else if (today - commentTime > 172800000)
      return new Date(props.comment.timestamp).toDateString();
    else return "Yesterday";
  };

  const displayDropdown = () => {
    dropRef.current.classList.toggle("display-dropdown");
  };

  return (
    <section className="comment-container">
      <div className="comment-author-info">
        <img
          src={props.comment.avatar}
          alt="avatar"
          className="comment-avatar"
        />
        <div className="comment-name-date">
          <h3>{props.comment.author}</h3>
          <p>
            <i>{props.now ? props.now : timeStamped()}</i>
          </p>
        </div>
        <div className="comment-menu-btn" onClick={displayDropdown}>
          menu
        </div>
        <div className="menu-dropdown">
          <ul className="menu-list" ref={dropRef}>
            <li>Report</li>
            <li>Remove</li>
            <li>View Profile</li>
          </ul>
        </div>
      </div>
      <p>"{props.comment.text}"</p>
    </section>
  );
}

export default Comment;