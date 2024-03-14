import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../assets/menu.png";
import SOCKET from "../API/websocket";
import Linkify from "linkify-react";

// Comment component is rendered in iether the Profile or the FriendProfile components.  Displays a dynamic timestamp depending on the current time as well as the commenter's name, avatar and a GIF if included.
// Also included is a drop down menu which has a few options avaiable to the current logged in user.  Delete funtionality if the current user wrote the comment.
// IMPORTANT:  The REPORT button in the dropdown menu currently does nothing, just there as a placeholder
function Comment(props) {
  const dropRef = useRef();
  const [isRemovable, setIsRemovable] = useState(false);
  const navigate = useNavigate();

  // time stamp function returns either "today" or "yesterday" if comment was made in the past 2 day,
  // otherswise return the date
  const timeStamped = (time) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const messageTime = new Date(time).getTime();

    if (today.getTime() <= messageTime)
      return new Date(time).toLocaleTimeString("en", {
        timeStyle: "short",
      });
    else if (
      yesterday.getTime() <= messageTime &&
      today.getTime() > messageTime
    )
      return "Yesterday";
    else return new Date(time).toLocaleString("en", { dateStyle: "short" });
  };

  const displayDropdown = () => {
    dropRef.current.classList.toggle("display-dropdown");
  };

  // DELETE comment call to the API and then use the returned user object to update the logged in user, ensuring UI updates
  // are reflected
  const removeComment = async () => {
    // determine if the comment to be deleted is on the user's profile OR on a friend's profile created by the user
    let profile;
    if (props.user.username === props.comment.author)
      profile = props.comment.profile;
    else profile = props.user.username;

    SOCKET.emit("remove comment", profile, props.comment._id, (response) => {
      props.updateComments(response.comments); // update friend's comment list
      displayDropdown();
    });
  };

  // Navigate to comment author's profile page, redirect to own user profile if clicked on own comment
  const viewProfile = () => {
    if (props.user.username === props.comment.author)
      navigate(`/${props.user.username}/profile`);
    else navigate(`/${props.user.username}/friends/${props.comment.author}`);
  };

  // on dependency change, this useEffect hook determines if the logged in user has the ability to remove comment by setting isRemovable state.  isRemovable
  // is used in conditional rendering of the remove button in the comment menu
  useEffect(() => {
    if (
      props.user.username === props.comment.author ||
      props.user.username === props.comment.profile
    )
      setIsRemovable(true);
    else setIsRemovable(false);
  }, [props.user.username, props.comment.author, props.comment.profile]);

  return (
    <section className="comment-container" key={props.comment._id}>
      <div className="comment-author-info">
        <img
          src={props.comment.avatar}
          alt="avatar"
          className="comment-avatar"
        />
        <div className="comment-name-date">
          <h3>{props.comment.author}</h3>
          <p className="comment-timestamp">
            <i>
              {props.now ? props.now : timeStamped(props.comment.timestamp)}
            </i>
          </p>
        </div>
        {/* <div className="comment-menu-btn" onClick={displayDropdown}>
          menu
        </div> */}
        <img
          onClick={displayDropdown}
          src={Menu}
          alt="menu"
          className="comment-menu-btn"
        />
        <div className="menu-dropdown">
          <ul className="menu-list" ref={dropRef}>
            {isRemovable && <li onClick={removeComment}>Remove</li>}
            <li>Report</li>
            <li onClick={viewProfile}>View Profile</li>
          </ul>
        </div>
      </div>
      {props.comment.text && (
        <Linkify>
          <p className="comment-linkify-text">"{props.comment.text}"</p>
        </Linkify>
      )}
      {props.comment.gif && (
        <img src={props.comment.gif} alt="GiF" className="comment-gif" />
      )}

      {props.comment.urlMetaData && props.comment.urlMetaData["og:title"] && (
        <a
          className="comment-md-card"
          href={props.comment.urlMetaData["og:url"]}
          target="_blank"
          rel="noreferrer"
        >
          {props.comment.urlMetaData["og:image"] && (
            <div className="md-image">
              <img src={props.comment.urlMetaData["og:image"]} />
            </div>
          )}
          <div className="md-text-block">
            <b>
              {props.comment.urlMetaData["og:title"].length > 100
                ? props.comment.urlMetaData["og:title"].substring(0, 100) +
                  "..."
                : props.comment.urlMetaData["og:title"]}
            </b>
            {props.comment.urlMetaData["og:description"] && (
              <p className="md-descrip">
                {props.comment.urlMetaData["og:description"].length > 100
                  ? props.comment.urlMetaData["og:description"].substring(
                      0,
                      100
                    ) + "..."
                  : props.comment.urlMetaData["og:description"]}
              </p>
            )}
            <i className="comment-md-site-name">
              {props.comment.urlMetaData["og:site_name"]}
            </i>
          </div>
        </a>
      )}
    </section>
  );
}

export default Comment;
