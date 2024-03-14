import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import URL from "../API/apiURL.js";
import SOCKET from "../API/websocket";

// Profile component.  Renders the user's profile page complete with editable functionality, comments on profile, and friend's list.
function Profile(props) {
  const [avatars, setAvatars] = useState("");
  const [userAvatar, setUserAvatar] = useState(props.user.avatar);
  const [editAvatar, setEditAvatar] = useState(props.user.avatar);
  const [user, setUser] = useState(props.user);
  const [comments, setComments] = useState(props.user.comments);

  const modalRef = useRef();
  const formRef = useRef();
  const toolRef = useRef();
  const avatarEdit = useRef();

  // Toggle display of the edit form
  const toggleModal = () => {
    modalRef.current.classList.toggle("toggle-modal");
    setTimeout(() => {
      formRef.current.classList.toggle("toggle-form");
    }, 100);
  };

  // Toggle the display of the avatar selection tool
  const toggleTool = () => {
    toolRef.current.classList.toggle("toggle-tool");
    setTimeout(() => {
      toolRef.current.classList.toggle("grow-tool");
    }, 100);
  };

  // Close the avatar selection tool when a new avatar is selected
  const pickAvatar = (e) => {
    toggleTool();
    setEditAvatar(e.target.src);
  };

  const updateComments = (data) => {
    setComments(data);
  };

  // submit the edits to be saved to the DB.  Update the states of Dashboard as well as Profile to reflect the changes as well
  const submitEdits = async (e) => {
    e.preventDefault();

    // FormData API to pull info from the form then convert to standard JS object
    const formData = new FormData(formRef.current);
    const dataObj = Object.fromEntries(formData.entries());

    dataObj.avatar = editAvatar;

    SOCKET.emit("edit profile", props.user.username, dataObj);

    props.updateUser({ ...user, avatar: editAvatar }); // Update the Dashboard state user with the edits
    setUser({ ...user, avatar: editAvatar }); // Update local state user to display current info in the form fields
    setUserAvatar(editAvatar); // Update profile avatar to match form avatar selection
    toggleModal();
  };

  // function will handle changes to form fields "title", "text", or the checkbox. Updates the local state user (handles form manipulation), which is a copy of the App state user
  const handleChange = (e) => {
    let updatedUser = { ...user };

    if (e.target.name === "country") updatedUser.country = e.target.value;
    else if (e.target.name === "personal")
      updatedUser.personal = e.target.value;
    else if (e.target.name === "birthday")
      updatedUser.birthday = e.target.value;

    setUser(updatedUser);
  };

  // on component mount, retrieve the avatars from the API and set up listener to retrieve new comments
  useEffect(() => {
    const getAvatars = async () => {
      const request = await fetch(`${URL}/json/avatars.json`);
      const response = await request.json();

      setAvatars(Object.values(response));
    };

    getAvatars();

    SOCKET.on("new comment", (comment) => {
      setComments((prevComments) => [comment, ...prevComments]);
    });

    SOCKET.on("update comments", (comments) => {
      setComments(comments);
    });
    return () => {
      SOCKET.off("new comment");
      SOCKET.off("update comments");
    };
  }, []);

  return (
    <section className="component-view">
      <section className="component-container">
        <div className="profile-header">
          <div className="img-container">
            <img src={userAvatar} alt="avatar"></img>
          </div>
          <div className="profile-info">
            <div>
              <h2>{props.user.username}</h2>
              <p>country: {props.user.country}</p>
            </div>
            <p>
              <i>{props.user.personal}</i>
            </p>
          </div>
          <div className="profile-info2">
            <div>
              <h2>joined: {props.user.userSince_string}</h2>
              <p>
                birthday:{" "}
                {props.user.birthday
                  ? new Date(props.user.birthday).toDateString()
                  : "???"}
              </p>
            </div>
            <div>
              <button onClick={toggleModal} className="nav-links">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        <div className="profile-content">
          <div className="comment-container">
            <div className="comment-header">Comments</div>
            {comments &&
              comments.map((comment) => {
                return (
                  <Comment
                    comment={comment}
                    user={props.user}
                    token={props.token}
                    updateUser={props.updateUser}
                    updateTokenErr={props.updateTokenErr}
                    updateComments={updateComments}
                  />
                );
              })}
          </div>
          <div className="friends-container">
            <div className="friend-list">
              Friends <i className="big-font">{user.friends.length}</i>
            </div>
            {props.friends &&
              props.friends.map((friend) => {
                return (
                  <Link
                    to={`/${props.user.username}/friends/${friend.username}`}
                    className="friend-card-link"
                    key={friend._id}
                  >
                    <div className="friend-avatar-small">
                      <img src={friend.avatar} alt="avatar" />
                    </div>
                    <p>
                      <i>{friend.username}</i>
                    </p>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      <div className="modal" ref={modalRef}>
        <form className="edit-form" ref={formRef}>
          <div>
            <div className="avatar-container">
              <img
                className="avatar-edit"
                src={editAvatar}
                alt="avatar"
                onClick={toggleTool}
                ref={avatarEdit}
                name="avatar"
              ></img>
              <div className="avatar-selection-tool" ref={toolRef}>
                {avatars &&
                  avatars.map((link) => {
                    return (
                      <div className="avatar-thumbnail" key={link}>
                        <img src={link} alt="avatar" onClick={pickAvatar}></img>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="edit-form-field">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                name="country"
                value={user.country ? user.country : ""}
                onChange={handleChange}
              />
              <label htmlFor="birthday">Birthday</label>
              <input
                type="date"
                name="birthday"
                onChange={handleChange}
                value={user.birthday ? user.birthday : ""}
              />
            </div>
          </div>
          <label htmlFor="personal">Personal Note</label>
          <textarea
            name="personal"
            rows="7"
            cols="35"
            onChange={handleChange}
            value={user.personal ? user.personal : ""}
          />
          <div>
            <button type="submit" onClick={submitEdits} className="nav-links">
              Submit
            </button>
            <button type="button" onClick={toggleModal} className="nav-links">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Profile;
