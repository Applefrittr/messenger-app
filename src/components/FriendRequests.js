import SOCKET from "../API/websocket";

// FriendRequests which display pending incoming and outgoing friend request for the user.  Each request element displays the friend's username and avatar, as well as
// buttons to either accept or deny (incoming) or cancel (outgoing) the friend request
function FriendRequests(props) {
  // Accepted friend request call to API.  Returned updated user used to update UI with changes
  const handleAccept = async (e) => {
    SOCKET.emit(
      "accept request",
      props.user.username,
      e.target.value,
      (response) => {
        props.updateIncoming(response.incoming);
        props.updateFriends(response.friends);
      }
    );
  };

  // Declined friend request call to API.  Returned updated user used to update UI with changes
  const handleDecline = async (e) => {
    SOCKET.emit(
      "remove request",
      props.user.username,
      e.target.value,
      (response) => {
        props.updateIncoming(response.incoming);
        props.updateOutgoing(response.outgoing);
      }
    );
  };

  return (
    <section>
      <div className="friends-list">
        <h2>Incoming Requests</h2>
        {props.incoming.map((request) => {
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
        {props.incoming.length === 0 && (
          <p>
            <i>No Incoming Reqeusts</i>
          </p>
        )}
      </div>
      <div className="friends-list">
        <h2>Outgoing Requests</h2>
        {props.outgoing.map((request) => {
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
        {props.outgoing.length === 0 && (
          <p>
            <i>No Outgoing Reqeusts</i>
          </p>
        )}
      </div>
    </section>
  );
}

export default FriendRequests;
