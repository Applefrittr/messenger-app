import { useEffect, useState } from "react";

function FriendProfile(props) {
  const [profile, setProfile] = useState(props.friend);

  console.log(profile);
  const friendsList = [];

  profile.friends.forEach((friend) => {
    friendsList.push(
      <div className="friend-card">
        <div className="friend-avatar-small">
          <img src={friend.avatar} alt="avatar" />
        </div>
        <p>
          <i>{friend.username}</i>
        </p>
      </div>
    );
  });

  return (
    <section className="friend-profile-container">
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
          <button onClick={props.close}>Back</button>
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
        <div className="posts-container">
          <div className="posts-header">Posts</div>
        </div>
        <div className="friends-container">
          <div className="online-status">ONLINE</div>
          <div className="friend-list">Friends</div>
          {friendsList}
        </div>
      </div>
    </section>
  );
}

export default FriendProfile;
