import { useEffect, useState } from "react";

function FriendRequests(props) {
  const [incoming, setIncoming] = useState();
  const [outgoing, setOutgoing] = useState();

  useEffect(() => {
    const requestInArray = [];
    props.user.requestIn.forEach((friend) => {
      requestInArray.push(
        <div className="friend-card">
          <div className="friend-avatar">
            <img src={friend.avatar} alt="avatar" />
          </div>
          <p>
            <i>{friend.username}</i>
          </p>
        </div>
      );
    });
    setIncoming(requestInArray);

    const requestOutArray = [];
    props.user.requestOut.forEach((friend) => {
      requestOutArray.push(
        <div className="friend-card">
          <div className="friend-avatar">
            <img src={friend.avatar} alt="avatar" />
          </div>
          <p>
            <i>{friend.username}</i>
          </p>
        </div>
      );
    });
    setOutgoing(requestOutArray);
  }, []);

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
