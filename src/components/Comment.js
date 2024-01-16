import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../assets/menu.png";

// Comment component is rendered in iether the Profile or the FriendProfile components.  Displays a dynamic timestamp depending on the current time as well as the commenter's name, avatar and a GIF if included.
// Also included is a drop down menu which has a few options avaiable to the current logged in user.  Delete funtionality if the current user wrote the comment.
// IMPORTANT:  The REMOVE button in the dropdown menu currently does nothing, just there as a placeholder
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

    console.log(props.user);

    const request = await fetch(
      `https://messenger-api-production-1558.up.railway.app/users/${profile}/profile/comment/${props.comment._id}`,
      {
        mode: "cors",
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = await request.json();

    if (response.error) {
      console.log(response);
      props.updateTokenErr(response.error);
      navigate(`/`);
    } else {
      console.log(response.message);

      // Determine which profile to update depending on where the comment to be removed was posted: user profile OR the friend's profile
      if (props.user.username === props.comment.author) {
        props.updateComments(response.user.comments); // update friend's comment list
      } else props.updateUser(response.user); // update the logged in user to reflect comment removal
      displayDropdown();
    }
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
      {props.comment.text && <p>"{props.comment.text}"</p>}
      {props.comment.gif && (
        <img src={props.comment.gif} alt="GiF" className="comment-gif" />
      )}
    </section>
  );
}

export default Comment;
