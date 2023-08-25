import "../styles/Profile.css";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function Profile(props) {
  const [avatars, setAvatars] = useState("");
  const [userAvatar, setUserAvatar] = useState();
  const [editAvatar, setEditAvatar] = useState(props.user.avatar);
  const [user, setUser] = useState(props.user);

  const modalRef = useRef();
  const formRef = useRef();
  const toolRef = useRef();
  const avatarEdit = useRef();

  const toggleModal = () => {
    modalRef.current.classList.toggle("toggle-modal");
    setTimeout(() => {
      formRef.current.classList.toggle("toggle-form");
    }, 100);

    //console.log(user);
  };

  const toggleTool = () => {
    toolRef.current.classList.toggle("toggle-tool");
    setTimeout(() => {
      toolRef.current.classList.toggle("grow-tool");
    }, 100);
  };

  const pickAvatar = (e) => {
    toggleTool();
    // //console.log(e.target.src);
    setEditAvatar(e.target.src);
    // console.log(user);
    //handleChange(e);
  };

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
    console.log(response.message);

    props.updateUser(user); // Update the App state user with the edits
    setUser(user); // Update local state user to display current info in the form fields
    setUserAvatar(editAvatar); // Update profile avatar to match form avatar selection
    toggleModal();
  };

  // function will handle changes to form fields "title", "text", or the checkbox. Updates the local state user (handles form manipulation), which is a copy of the App state user
  const handleChange = (e) => {
    //console.log("change", user);
    let updatedUser = { ...user };
    //console.log("user", user.personal);
    if (e.target.name === "country") updatedUser.country = e.target.value;
    else if (e.target.name === "personal")
      updatedUser.personal = e.target.value;
    else if (e.target.name === "birthday")
      updatedUser.birthday = e.target.value;
    //else updatedUser.avatar = e.target.src;
    //console.log("updated", user);
    setUser(updatedUser);
    //props.updateUser(updatedUser);
  };

  useEffect(() => {
    //console.log(props.user);
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

  return (
    <section className="profile-view">
      <section className="profile-container">
        <div className="profile-header">
          <div className="img-container">
            <img src={props.user.avatar} alt="avatar"></img>
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
              <h2>joined: {props.user.userSince}</h2>
              <p>birthday: {props.user.birthday}</p>
            </div>
            {/* <Link to="edit" className="nav-links">
              Edit Profile
            </Link> */}
            <button onClick={toggleModal}>Edit Profile</button>
          </div>
        </div>
        <div className="profile-content">
          <div className="posts-container">
            <div className="posts-header">Posts</div>
          </div>
          <div className="friends-container">
            <div className="online-status">ONLINE</div>
            <div className="friend-list">Friends</div>
          </div>
        </div>
      </section>

      <div className="edit-modal" ref={modalRef}>
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
