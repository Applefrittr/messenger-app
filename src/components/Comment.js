import { useEffect, useRef, useState } from "react";

function Comment(props) {
  const dropRef = useRef();
  const [canRemoveComment, setCanRemoveComment] = useState(false);
  const [dropDown, setDropDown] = useState([]);

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

  // DELETE comment call to the API and then use the returned user object to update the logged in user, ensuring UI updates
  // are reflected
  const removeComment = async () => {
    // determine if the comment to be deleted is on the user's profile OR on a friend's profile created by the user
    let profile;
    if (props.user.username === props.comment.author)
      profile = props.comment.profile;
    else profile = props.user.username;

    console.log(profile);

    const request = await fetch(
      `http://localhost:5000/users/${profile}/profile/comment/${props.comment._id}`,
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
    console.log(response.message);

    // Determine which profile to update depending on where the comment to be removed was posted: user profile OR the friend's profile
    if (props.user.username === props.comment.author) {
      console.log("update frined");
      props.updateComments(response.user);
    } else props.updateUser(response.user);
    displayDropdown();
  };

  // Determine if the comment rendered can be removed by either the author OR the profile owner
  // Renders the remove button in the dropdown menu tab of the comment
  useEffect(() => {
    // if (
    //   props.user.username === props.comment.author ||
    //   props.user.username === props.comment.profile
    // )
    //   setCanRemoveComment(true);

    const menu = [];
    menu.push(<li>Report</li>);
    if (
      props.user.username === props.comment.author ||
      props.user.username === props.comment.profile
    )
      menu.push(<li onClick={removeComment}>Remove</li>);
    if (props.user.username !== props.comment.author)
      menu.push(<li onClick={test}>View Profile</li>);

    setDropDown(menu);

    return () => {
      setDropDown();
    };
  }, []);

  const test = () => {
    console.log(props.user.username, props.comment.profile);
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
            {dropDown}
          </ul>
        </div>
      </div>
      <p>"{props.comment.text}"</p>
    </section>
  );
}

export default Comment;
