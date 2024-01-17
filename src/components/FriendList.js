import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Displays a list of the logged in user's friends.  Each friend has a card element which displays their avatar and username, as well as the abilty to view profile and remove the from
// the logged in user's firend's list
function FriendList(props) {
  const [friends, setFriends] = useState();
  const [removeFriend, setRemoveFriend] = useState();
  const modalRef = useRef();
  const confirmRef = useRef();

  // Toggle display of the edit form
  const toggleModal = () => {
    modalRef.current.classList.toggle("toggle-modal");
    setTimeout(() => {
      confirmRef.current.classList.toggle("toggle-form");
    }, 100);
  };

  const updateRemoveFriend = (e) => {
    setRemoveFriend(e.target.value);
    toggleModal();
  };

  // Remove a friend from the firend'slist.  API call updates both the user and friends' friends list as well as return an
  // updated user to ensure the UI is updated with the change
  const handleRemove = async (e) => {
    const request = await fetch(
      `http://localhost:5000/users/${props.user.username}/friends/${removeFriend}/remove`,
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
    // from Dashboard.js, updates the logged in user to reflect changes in UI
    props.updateUser(response.user);
    toggleModal();
  };

  useEffect(() => {
    const friendsArray = [];

    props.user.friends.forEach((friend) => {
      console.log(friend);
      friendsArray.push(
        <div className="friend-card" key={friend.username}>
          <div className="friend-card-info">
            <div className="friend-avatar">
              <img src={friend.avatar} alt="avatar" />
            </div>
            <p>
              <i>{friend.username}</i>
            </p>
            {friend.online && (
              <p className="online-status">
                <i>ONLINE</i>
              </p>
            )}
          </div>
          <div className="friend-card-btns">
            {/* <button onClick={viewProfile(friend)}>Profile</button> */}
            <Link
              to={`/${props.user.username}/friends/${friend.username}`}
              className="nav-links"
            >
              Profile
            </Link>
            <button
              className="nav-links"
              value={friend.username}
              onClick={updateRemoveFriend}
            >
              Remove
            </button>
          </div>
        </div>
      );
    });

    setFriends(friendsArray);
  }, [props.user]);

  return (
    <section className="friends-list-container">
      <div className="friends-list">
        <div>Friend List</div>
        {friends}
      </div>

      <div className="modal" ref={modalRef}>
        <div className="remove-friend-confirm" ref={confirmRef}>
          <p>
            Confirm removing <i>{removeFriend}</i> from friends list?
          </p>
          <div>
            <button onClick={handleRemove} className="nav-links nav-links-red">
              Confirm
            </button>
            <button onClick={toggleModal} className="nav-links">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FriendList;
