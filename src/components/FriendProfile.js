import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Comment from "./Comment";

function FriendProfile(props) {
  const [profile, setProfile] = useState();
  const [friendsList, setFriendsList] = useState();
  const [commentsList, setCommentsList] = useState([]);
  //UseParams hook to access the URL friend value passed by the <Route path="/friends/:friend" ...> in Dashboard.js
  const { friend } = useParams();
  const navigate = useNavigate();
  const refs = useRef([]); // use a single ref hook to create an array of elements
  const formRef = useRef();

  // pushes elements with the ref tag into the refs array.  Mounting and unmounting pushes the elemnt into the array
  // multiple times so ensure only a single copy of the elements gets pushed
  const pushRef = (element) => {
    if (refs.current.indexOf(element) < 0) refs.current.push(element);
  };

  // navigate back to FriendsList.js
  const back = () => {
    navigate(`/${props.user.username}/friends`);
  };

  // display and hide functions to enable/disable the new comment widget
  const displayButtons = () => {
    refs.current.forEach((element) => {
      if (element === null) return;
      element.classList.add("display");
    });
  };
  const hideButtons = () => {
    refs.current.forEach((element) => {
      if (element === null) return;
      element.classList.remove("display");
    });
  };

  // constructs the Comment component array to be rendered.  Also passed to the Comment itself as a prop function to update the list with any
  // changes to any (deletions, edits, etc.)
  const buildComments = (user) => {
    const tempList = [];
    user.comments.forEach((comment) => {
      tempList.unshift(
        <Comment
          comment={comment}
          user={props.user}
          token={props.token}
          updateComments={buildComments}
        />
      );
    });

    setCommentsList(tempList);
  };

  // call to the API to POST the new comment to the friend's profile as well as render the new comment to the UI
  const postComment = async (e) => {
    e.preventDefault();

    // FormData API to pull info from the form then convert to standard JS object
    const formData = new FormData(formRef.current);
    const dataObj = Object.fromEntries(formData.entries());

    const request = await fetch(
      `http://localhost:5000/users/${props.user.username}/friends/${friend}/comment`,
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

    if (response.comment) {
      const tempList = [...commentsList];
      console.log(tempList);
      tempList.unshift(
        <Comment
          comment={response.comment}
          now={"Now"}
          user={props.user}
          token={props.token}
          updateComments={buildComments}
        />
      );
      setCommentsList(tempList);
    }
    formRef.current.reset();
    hideButtons();
  };

  // fetch the friend's(url param) user profile and construct the friend's list and comments to be rendered.  Called everytime the 'friend' url param changes
  useEffect(() => {
    const getProfile = async () => {
      const request = await fetch(
        `http://localhost:5000/users/${friend}/profile`
      );

      const response = await request.json();

      setProfile(response.user);

      const friendsList = [];

      // construct the friends list as a collection of links of viewable profiles BUT exclude the currently logged in user
      response.user.friends.forEach((friend) => {
        if (props.user.username !== friend.username) {
          friendsList.push(
            <Link
              to={`/${props.user.username}/friends/${friend.username}`}
              className="friend-card"
              key={friend.username}
            >
              <div className="friend-avatar-small">
                <img src={friend.avatar} alt="avatar" />
              </div>
              <p>
                <i>{friend.username}</i>
              </p>
            </Link>
          );
        }
      });

      buildComments(response.user); // call buildComments to construct comment list
      setFriendsList(friendsList);
    };

    getProfile();
  }, [friend]);

  return (
    <section className="component-view">
      {profile && (
        <section className="component-container">
          <div className="profile-header">
            <div className="img-container">
              <img src={profile.avatar} alt="avatar"></img>
            </div>
            <div className="profile-info">
              <div>
                <h2>{profile.username}</h2>
                <p>country: {profile.country}</p>
              </div>
              <p>Personal Bio: {profile.personal}</p>
            </div>
            <div className="profile-info">
              <button onClick={back}>Back</button>
              <div>
                <h2>joined: {profile.userSince_string}</h2>
                <p>
                  birthday:{" "}
                  {profile.birthday
                    ? new Date(profile.birthday).toDateString()
                    : "???"}
                </p>
              </div>
            </div>
          </div>
          <div className="profile-content">
            <div className="comment-container">
              <div className="comment-header">Comments</div>
              <form className="new-comment-form" ref={formRef}>
                <p className="comment-form-title" ref={pushRef}>
                  <i>Commenting as</i>
                </p>
                <div className="new-comment-container">
                  <img
                    src={props.user.avatar}
                    className="comment-avatar"
                    alt="avatar"
                  ></img>
                  <div className="comment-input-element">
                    <p className="comment-form-title" ref={pushRef}>
                      <i>{props.user.username}</i>
                    </p>
                    <input
                      placeholder="Add a comment..."
                      onClick={displayButtons}
                      name="text"
                    ></input>
                  </div>
                </div>
                <div className="comment-buttons" ref={pushRef}>
                  <button type="button" onClick={postComment}>
                    Comment
                  </button>
                  <button type="button" onClick={hideButtons}>
                    Cancel
                  </button>
                </div>
              </form>
              {commentsList}
            </div>
            <div className="friends-container">
              <div className="online-status">ONLINE</div>
              <div className="friend-list">
                Friends <i className="big-font">{profile.friends.length}</i>
              </div>
              {friendsList}
            </div>
          </div>
        </section>
      )}
    </section>
  );
}

export default FriendProfile;
