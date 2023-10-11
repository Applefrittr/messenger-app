import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function FriendProfile(props) {
  const [profile, setProfile] = useState();
  const [friendsList, setFriendsList] = useState();
  //UseParams hook to access the URL friend value passed by the <Route path="/friends/:friend" ...> in Dashboard.js
  const { friend } = useParams();
  const navigate = useNavigate();

  // navigate back to FriendsList.js
  const back = () => {
    navigate(`/${props.user.username}/friends`);
  };

  // fetch the friend's(url param) user profile and construct the friend's list to be rendered.  Called everytime the 'friend' url param changes
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
      )}
    </section>
  );
}

export default FriendProfile;
