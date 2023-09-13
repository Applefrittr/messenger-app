import { useEffect, useState } from "react";

function FriendList(props) {
  const [friends, setFriends] = useState();

  useEffect(() => {
    const friendsArray = [];

    props.user.friends.forEach((friend) => {
      friendsArray.push(
        <div className="friend-card">
          <div className="friend-card-info">
            <div className="friend-avatar">
              <img src={friend.avatar} alt="avatar" />
            </div>
            <p>
              <i>{friend.username}</i>
            </p>
          </div>
          <div className="friend-card-btns">
            <button value={friend.username}>Profile</button>
            <button>Remove</button>
          </div>
        </div>
      );
    });

    setFriends(friendsArray);
  }, [props.user]);

  return (
    <section>
      <div>Friend List</div>
      {friends}
    </section>
  );
}

export default FriendList;
