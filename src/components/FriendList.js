import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import SOCKET from "../API/websocket";

// Displays a list of the logged in user's friends.  Each friend has a card element which displays their avatar and username, as well as the abilty to view profile and remove the from
// the logged in user's firend's list
function FriendList(props) {
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
    SOCKET.emit(
      "remove friend",
      props.user.username,
      removeFriend,
      (response) => {
        props.updateFriends(response.friends);
      }
    );
    toggleModal();
  };

  return (
    <section className="friends-list-container">
      <div className="friends-list">
        <div>Friend List</div>

        {props.friends &&
          props.friends.map((friend) => {
            return (
              <div className="friend-card" key={friend.username}>
                <div className="friend-card-info">
                  <div className="friend-avatar">
                    <img src={friend.avatar} alt="avatar" />
                  </div>
                  <p>
                    <i>{friend.username}</i>
                  </p>
                  {friend.online && <div className="online-status-icon" />}
                </div>
                <div className="friend-card-btns">
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
          })}
      </div>

      <div className="modal" ref={modalRef}>
        <div className="remove-friend-confirm" ref={confirmRef}>
          <p>
            Confirm removing{" "}
            <i>
              <b>{removeFriend}</b>
            </i>{" "}
            from friends list?
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
