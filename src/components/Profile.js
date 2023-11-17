import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";

function Profile(props) {
  const [avatars, setAvatars] = useState("");
  const [userAvatar, setUserAvatar] = useState(props.user.avatar);
  const [editAvatar, setEditAvatar] = useState(props.user.avatar);
  const [user, setUser] = useState(props.user);

  const modalRef = useRef();
  const formRef = useRef();
  const toolRef = useRef();
  const avatarEdit = useRef();
  const navigate = useNavigate();

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

  // submit the edits to be saved to the DB.  Update the states of Dashboard as well as Profile to reflect the changes as well
  const submitEdits = async (e) => {
    e.preventDefault();

    // FormData API to pull info from the form then convert to standard JS object
    const formData = new FormData(formRef.current);
    const dataObj = Object.fromEntries(formData.entries());

    dataObj.avatar = editAvatar;

    const request = await fetch(
      `http://localhost:5000/users/${user.username}/profile`,
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

    if (response.error) {
      console.log(response);
      props.updateTokenErr(response.error);
      navigate(`/`);
    } else {
      console.log(response.message);

      props.updateUser({ ...user, avatar: editAvatar }); // Update the Dashboard state user with the edits
      setUser({ ...user, avatar: editAvatar }); // Update local state user to display current info in the form fields
      setUserAvatar(editAvatar); // Update profile avatar to match form avatar selection
      toggleModal();
    }
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

  // on component mount, retrieve the avatars from the API
  useEffect(() => {
    const getAvatars = async () => {
      const request = await fetch("http://localhost:5000/json/avatars.json");

      const response = await request.json();

      const linkArray = Object.values(response);
      let avatarArray = [];

      linkArray.forEach((link) => {
        avatarArray.push(
          <div className="avatar-thumbnail" key={link}>
            <img src={link} alt="avatar" onClick={pickAvatar}></img>
          </div>
        );
      });

      setAvatars(avatarArray);
    };

    getAvatars();
  }, []);

  // construct the friends list as a collection of links of viewable profiles
  const friendsList = [];
  props.user.friends.forEach((friend) => {
    friendsList.push(
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
  });

  // construct the comments list
  const commentsList = [];
  props.user.comments.forEach((comment) => {
    commentsList.push(
      <Comment
        comment={comment}
        user={props.user}
        token={props.token}
        updateUser={props.updateUser}
        updateTokenErr={props.updateTokenErr}
      />
    );
  });

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
            <p>Personal Bio: {props.user.personal}</p>
          </div>
          <div className="profile-info">
            <div>
              <h2>joined: {props.user.userSince_string}</h2>
              <p>
                birthday:{" "}
                {props.user.birthday
                  ? new Date(props.user.birthday).toDateString()
                  : "???"}
              </p>
            </div>
            <button onClick={toggleModal} className="nav-links">
              Edit Profile
            </button>
          </div>
        </div>
        <div className="profile-content">
          <div className="comment-container">
            <div className="comment-header">Comments</div>
            {commentsList}
          </div>
          <div className="friends-container">
            <div className="friend-list">
              Friends <i className="big-font">{user.friends.length}</i>
            </div>
            {friendsList}
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
                {avatars}
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
            <button type="submit" onClick={submitEdits}>
              Submit
            </button>
            <button type="button" onClick={toggleModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Profile;
