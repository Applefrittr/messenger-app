import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FriendRequests(props) {
  const [incoming, setIncoming] = useState();
  const [outgoing, setOutgoing] = useState();
  const navigate = useNavigate();

  const renderIncoming = (userArray) => {
    const requestInArray = [];
    userArray.forEach((user) => {
      requestInArray.push(
        <div className="friend-card" key={user.username}>
          <div className="friend-card-info">
            <div className="friend-avatar">
              <img src={user.avatar} alt="avatar" />
            </div>
            <p>
              <i>{user.username}</i>
            </p>
          </div>
          <div className="friend-card-btns">
            <button value={user.username} onClick={handleAccept}>
              Accept
            </button>
            <button value={user.username} onClick={handleDecline}>
              Decline
            </button>
          </div>
        </div>
      );
    });
    setIncoming(requestInArray);
  };

  const renderOutgoing = (userArray) => {
    const requestOutArray = [];
    userArray.forEach((user) => {
      requestOutArray.push(
        <div className="friend-card" key={user.username}>
          <div className="friend-card-info">
            <div className="friend-avatar">
              <img src={user.avatar} alt="avatar" />
            </div>
            <p>
              <i>{user.username}</i>
            </p>
          </div>
          <div className="friend-card-btns">
            <button value={user.username} onClick={handleDecline}>
              Cancel
            </button>
          </div>
        </div>
      );
    });
    setOutgoing(requestOutArray);
  };

  useEffect(() => {
    renderIncoming(props.user.requestIn);
    renderOutgoing(props.user.requestOut);
  }, []);

  // Accepted friend request call to API.  Returned updated user used to update UI with changes
  const handleAccept = async (e) => {
    const request = await fetch(
      `http://localhost:5000/users/${props.user.username}/request/${e.target.value}/accept`,
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

      renderIncoming(response.user.requestIn);
      renderOutgoing(response.user.requestOut);
    }
  };

  // Declined friend request call to API.  Returned updated user used to update UI with changes
  const handleDecline = async (e) => {
    const request = await fetch(
      `http://localhost:5000/users/${props.user.username}/request/${e.target.value}/decline`,
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

      renderIncoming(response.user.requestIn);
      renderOutgoing(response.user.requestOut);
    }
  };

  return (
    <section>
      <div className="friends-list">
        <h2>Incoming Requests</h2>
        {incoming}
      </div>
      <div className="friends-list">
        <h2>Outgoing Requests</h2>
        {outgoing}
      </div>
    </section>
  );
}

export default FriendRequests;
