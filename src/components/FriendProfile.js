import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Comment from "./Comment";
import GIFSearch from "./GIFSearch";

// FriendProfile displays the profile of another user other than the currently logged in user.  This displayed user can either be or not be a friend to the currently logged in user.  There is also the functionalty to leave
// a comment on the currently displayed user's profile by the logged in user.  All comments, friends, and profile details are displayed in the UI
function FriendProfile(props) {
  const [profile, setProfile] = useState();
  const [commentsList, setCommentsList] = useState();
  const [renderModal, setRenderModal] = useState(false);
  const [gif, setGif] = useState();
  //UseParams hook to access the URL friend value passed by the <Route path="/friends/:friend" ...> in Dashboard.js
  const { friend } = useParams();
  const navigate = useNavigate();
  const refs = useRef([]); // use a single ref hook to create an array of elements - for comment form buttonsand text
  const formRef = useRef(); // input field in the comment form
  const modalRef = useRef(); // modal overlay
  const gifUrlRef = useRef(); // ref to hidden <input> which holds the GIF url

  // pushes elements with the ref tag into the refs array.  Mounting and unmounting pushes the elemnt into the array
  // multiple times so ensure only a single copy of the elements gets pushed
  const pushRef = (element) => {
    if (refs.current.indexOf(element) < 0) refs.current.push(element);
  };

  // navigate back to FriendsList.js
  const back = () => {
    navigate(-1);
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
    setGif(); // Removes the slected gif from the new comment tool
  };

  // set GIF function which will render GIF in the new comment form if selected in the search tool
  const renderGif = (url) => {
    setGif(url);
  };

  // updateComemnts function to be passed to individual comment components to assist with edits, deletes, etc.
  const updateComments = (list) => {
    setCommentsList(list);
  };

  const toggleModal = () => {
    modalRef.current.classList.toggle("toggle-modal");
    setRenderModal(!renderModal);
    props.toggleScroll();
  };

  // call to the API to POST the new comment to the friend's profile as well as render the new comment to the UI
  const postComment = async (e) => {
    e.preventDefault();

    // FormData API to pull info from the form then convert to standard JS object
    const formData = new FormData(formRef.current);
    const dataObj = Object.fromEntries(formData.entries());

    const request = await fetch(
      `https://messenger-api-production-1558.up.railway.app/users/${props.user.username}/friends/${friend}/comment`,
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

    // if API call success, update the commentsList state to reflect new comment
    if (response.comment) {
      const tempList = [...commentsList];
      console.log(tempList);
      response.comment.now = "Now";
      console.log(response.comment);
      tempList.unshift(response.comment);

      setCommentsList(tempList);
    }

    formRef.current.reset();
    hideButtons();
  };

  // fetch the friend's(url param) user profile and construct the friend's list and comments to be rendered.  Called everytime the 'friend' url param changes
  useEffect(() => {
    const getProfile = async () => {
      const request = await fetch(
        `https://messenger-api-production-1558.up.railway.app/users/${friend}/profile`
      );

      const response = await request.json();

      setProfile(response.user);

      setCommentsList(response.user.comments);

      // buildComments(response.user); // call buildComments to construct comment list
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
              <button onClick={back} className="nav-links">
                Back
              </button>
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
                    <input
                      name="gif"
                      ref={gifUrlRef}
                      value={gif}
                      hidden
                    ></input>
                  </div>
                </div>
                {gif && (
                  <img
                    src={gif}
                    alt="gif placeholder"
                    className="comment-gif"
                  />
                )}
                <div className="comment-buttons" ref={pushRef}>
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="nav-links"
                  >
                    Add GiF
                  </button>
                  <div>
                    <button
                      type="button"
                      onClick={postComment}
                      className="nav-links"
                    >
                      Comment
                    </button>
                    <button
                      type="button"
                      onClick={hideButtons}
                      className="nav-links"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
              {profile &&
                commentsList.map((comment) => {
                  return (
                    <Comment
                      comment={comment}
                      user={props.user}
                      token={props.token}
                      updateComments={updateComments}
                      updateTokenErr={props.updateTokenErr}
                    />
                  );
                })}
            </div>
            <div className="friends-container">
              {profile.online && (
                <p className="online-status">
                  <i>ONLINE</i>
                </p>
              )}
              <div className="friend-list">
                Friends <i className="big-font">{profile.friends.length}</i>
              </div>
              {profile &&
                profile.friends.map((friend) => {
                  if (props.user.username !== friend.username) {
                    return (
                      <Link
                        to={`/${props.user.username}/friends/${friend.username}`}
                        className="friend-card-link"
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
                  } else return <></>;
                })}
            </div>
          </div>
        </section>
      )}

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
  );
}

export default FriendProfile;
