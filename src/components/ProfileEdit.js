import { useState, useRef, useEffect } from "react";

function ProfileEdit(props) {
  const [avatars, setAvatars] = useState();
  const modalRef = useRef();
  const formRef = useRef();

  // useEffect(() => {
  //   console.log(props.user);
  //   const getAvatars = async () => {
  //     const request = await fetch("http://localhost:5000/json/avatars.json");

  //     const response = await request.json();

  //     const linkArray = Object.values(response);
  //     let avatarArray = [];

  //     linkArray.forEach((link) => {
  //       avatarArray.push(
  //         <div className="avatar-thumbnail">
  //           <img src={link} alt="avatar" onClick={pickAvatar}></img>
  //         </div>
  //       );
  //     });

  //     setAvatars(avatarArray);
  //   };

  //   getAvatars();
  // }, []);

  const toggleModal = () => {
    modalRef.current.classList.toggle("toggle-modal");
    setTimeout(() => {
      formRef.current.classList.toggle("toggle-form");
    }, 100);
  };

  return (
    <div className="edit-modal" ref={modalRef}>
      {/* <form className="edit-form" ref={formRef}>
        <div>
          <div className="avatar-container">
            <img
              className="avatar-edit"
              src={userAvatar}
              alt="avatar"
              onClick={toggleTool}
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
              value={user.country}
              onChange={handleChange}
            />
            <label htmlFor="birthday">Birthday</label>
            <input
              type="text"
              name="birthday"
              onChange={handleChange}
              value={user.birthday}
            />
          </div>
        </div>
        <label htmlFor="personal">Personal Note</label>
        <textarea
          name="personal"
          rows="7"
          cols="35"
          onChange={handleChange}
          value={user.personal}
        />
        <input
          name="avatar"
          onChange={handleChange}
          value={user.avatar ? user.avatar : ""}
          hidden
          ref={avatarInput}
        />
        <div>
          <button type="submit" onClick={submitEdits}>
            Submit
          </button>
          <button type="button" onClick={toggleModal}>
            Cancel
          </button>
        </div>
      </form> */}
    </div>
  );
}

export default ProfileEdit;
