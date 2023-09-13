import { useEffect, useState } from "react";

function FriendRequests(props) {
  const [incoming, setIncoming] = useState();
  const [outgoing, setOutgoing] = useState();

  const renderIncoming = (userArray) => {
    const requestInArray = [];
    userArray.forEach((user) => {
      requestInArray.push(
        <div className="friend-card">
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
        <div className="friend-card">
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

    console.log(response.message);

    // Update the logged in User by calling updateUser from Dashboard.  This will ensure logged in User will include the newly submitted friend request
    const requestUser = await fetch(
      `http://localhost:5000/users/${props.user.username}/profile`
    );

    const responseUser = await requestUser.json();

    props.updateUser(responseUser.user);

    renderIncoming(responseUser.user.requestIn);
    renderOutgoing(responseUser.user.requestOut);
  };

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

    console.log(response.message);

    // Update the logged in User by calling updateUser from Dashboard.  This will ensure logged in User will include the newly submitted friend request
    const requestUser = await fetch(
      `http://localhost:5000/users/${props.user.username}/profile`
    );

    const responseUser = await requestUser.json();

    props.updateUser(responseUser.user);

    renderIncoming(responseUser.user.requestIn);
    renderOutgoing(responseUser.user.requestOut);
  };

  return (
    <section>
      <div>
        <h2>Incoming Requests</h2>
        {incoming}
      </div>
      <div>
        <h2>Outgoing Requests</h2>
        {outgoing}
      </div>
    </section>
  );
}

export default FriendRequests;
