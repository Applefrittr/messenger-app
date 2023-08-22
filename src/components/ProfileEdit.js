import { useState } from "react";

function ProfileEdit() {
  const [avatars, setAvatars] = useState();

  const testing = async () => {
    const request = await fetch("http://localhost:5000/json/avatars.json");

    const response = await request.json();

    console.log(response);
    console.log(Object.values(response));
    const linkArray = Object.values(response);
    let avatarArray = [];

    linkArray.forEach((link) => {
      avatarArray.push(
        <div>
          <img src={link} alt="avatar"></img>
        </div>
      );
    });

    setAvatars(avatarArray);
  };

  return (
    <section>
      <p>ProfileEdit component</p>
      <button className="nav-links" onClick={testing}>
        Testing
      </button>
      <div>{avatars}</div>
    </section>
  );
}

export default ProfileEdit;
