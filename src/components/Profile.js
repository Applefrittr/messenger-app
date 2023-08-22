import "../styles/Profile.css";
import { Link } from "react-router-dom";

function Profile(props) {
  console.log(props.user);
  return (
    <section className="profile-container">
      <div className="profile-header">
        <div className="img-container">
          <img
            src="https://static.wikia.nocookie.net/leagueoflegends/images/e/e9/Majestic_Empress_Morgana_Border_profileicon.png"
            alt="avatar"
          ></img>
        </div>
        <div className="profile-info">
          <div>
            <h2>{props.user.username}</h2>
            <p>country: {props.user.country}</p>
          </div>
          <p>Personal Bio</p>
        </div>
        <div className="profile-info">
          <div>
            <h2>user since: March 23rd, 2023</h2>
            <p>birthday</p>
          </div>
          <Link to="edit" className="nav-links">
            Edit Profile
          </Link>
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
  );
}

export default Profile;
