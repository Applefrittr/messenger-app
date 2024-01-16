import { useState } from "react";
import { useNavigate } from "react-router-dom";

// FriendRequests which display pending incoming and outgoing friend request for the user.  Each request element displays the friend's username and avatar, as well as
// buttons to either accept or deny (incoming) or cancel (outgoing) the friend request
function FriendRequests(props) {
  const [incoming, setIncoming] = useState(props.user.requestIn);
  const [outgoing, setOutgoing] = useState(props.user.requestOut);
  const navigate = useNavigate();

  // Accepted friend request call to API.  Returned updated user used to update UI with changes
  const handleAccept = async (e) => {
    const request = await fetch(
      `https://messenger-api-production-1558.up.railway.app/users/${props.user.username}/request/${e.target.value}/accept`,
      {
        mode: "cors",
        method: "POST",
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
      // from Dashboard.js, updates the logged in user to reflect changes in UI
      props.updateUser(response.user);

      setIncoming(response.user.requestIn);
      setOutgoing(response.user.requestOut);
    }
  };

  // Declined friend request call to API.  Returned updated user used to update UI with changes
  const handleDecline = async (e) => {
    const request = await fetch(
      `https://messenger-api-production-1558.up.railway.app/users/${props.user.username}/request/${e.target.value}/decline`,
      {
        mode: "cors",
        method: "POST",
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
      // from Dashboard.js, updates the logged in user to reflect changes in UI
      props.updateUser(response.user);

      setIncoming(response.user.requestIn);
      setOutgoing(response.user.requestOut);
    }
  };

  return (
    <section>
      <div className="friends-list">
        <h2>Incoming Requests</h2>
        {incoming.map((request) => {
          return (
            <div className="friend-card" key={request.username}>
              <div className="friend-card-info">
                <div className="friend-avatar">
                  <img src={request.avatar} alt="avatar" />
                </div>
                <p>
                  <i>{request.username}</i>
                </p>
              </div>
              <div className="friend-card-btns">
                <button
                  value={request.username}
                  onClick={handleAccept}
                  className="nav-links"
                >
                  Accept
                </button>
                <button
                  value={request.username}
                  onClick={handleDecline}
                  className="nav-links"
                >
                  Decline
                </button>
              </div>
            </div>
          );
        })}
        {incoming.length === 0 && (
          <p>
            <i>No Incoming Reqeusts</i>
          </p>
        )}
      </div>
      <div className="friends-list">
        <h2>Outgoing Requests</h2>
        {outgoing.map((request) => {
          return (
            <div className="friend-card" key={request.username}>
              <div className="friend-card-info">
                <div className="friend-avatar">
                  <img src={request.avatar} alt="avatar" />
                </div>
                <p>
                  <i>{request.username}</i>
                </p>
              </div>
              <div className="friend-card-btns">
                <button
                  value={request.username}
                  onClick={handleDecline}
                  className="nav-links"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
        {outgoing.length === 0 && (
          <p>
            <i>No Outgoing Reqeusts</i>
          </p>
        )}
      </div>
    </section>
  );
}

export default FriendRequests;
