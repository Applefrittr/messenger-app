import { useEffect, useState } from "react";

function FriendList(props) {
  const [friends, setFriends] = useState();

  const handleRemove = async (e) => {
    const request = await fetch(
      `http://localhost:5000/users/${props.user.username}/friends/${e.target.value}/remove`,
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

    // Update the logged in User by calling updateUser from Dashboard.  This will ensure the fiends list will be updated in thie UI
    const requestUser = await fetch(
      `http://localhost:5000/users/${props.user.username}/profile`
    );

    const responseUser = await requestUser.json();

    props.updateUser(responseUser.user);
  };

  useEffect(() => {
    const friendsArray = [];

    props.user.friends.forEach((friend) => {
      friendsArray.push(
        <div className="friend-card" key={friend.username}>
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
            <button value={friend.username} onClick={handleRemove}>
              Remove
            </button>
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
