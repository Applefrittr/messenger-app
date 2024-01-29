import { useEffect, useRef, useState } from "react";
import FriendSearch from "./FriendSearch";
import FriendRequests from "./FriendRequests";
import FriendList from "./FriendList";
import SOCKET from "../API/websocket";

// The Firends component is a navigational component which renders either the FriendList, FriendRequests, or FriendSearch components, depending on which tab is selected
// by the user
function Friends(props) {
  // const [friends, setFriends] = useState();
  const [incoming, setIncoming] = useState();
  const [outgoing, setOutgoing] = useState();
  const listRef = useRef();
  const searchRef = useRef();
  const requestsRef = useRef();
  const [tab, setTab] = useState(listRef);

  const toggleTab = (e) => {
    if (e.target.classList.contains("active-tab")) return;
    else {
      const tabs = [listRef, searchRef, requestsRef];
      tabs.forEach((tab) => {
        if (tab.current === e.target) {
          tab.current.classList.add("active-tab");
          setTab(tab);
        } else tab.current.classList.remove("active-tab");
      });
    }
  };

  const updateOutgoing = (data) => {
    setOutgoing(data);
  };

  const updateIncoming = (data) => {
    setIncoming(data);
  };

  // const updateFriends = (data) => {
  //   setFriends(data);
  // };

  // Set up socket listeners for changes to both incoming and outgoing friend requests as well as any changes to the firends list (removals).
  // Get all current requests as well as the friends list on component mount.  Clean up listeners when unmounted
  useEffect(() => {
    SOCKET.on("incoming request", (requests) => {
      setIncoming(requests);
    });

    SOCKET.on("remove request", (incoming, outgoing) => {
      setIncoming(incoming);
      setOutgoing(outgoing);
    });

    SOCKET.on("accept request", (outgoing, friends) => {
      setOutgoing(outgoing);
      props.updateFriends(friends);
    });

    SOCKET.on("remove friend", (friends) => {
      props.updateFriends(friends);
    });

    SOCKET.emit("get requests", props.user.username, (response) => {
      setIncoming(response.incoming);
      setOutgoing(response.outgoing);
    });

    SOCKET.emit("get friends", props.user.username, (response) => {
      props.updateFriends(response.friends);
    });

    return () => {
      SOCKET.off("incoming request");
      SOCKET.off("remove request");
      SOCKET.off("remove friend");
      SOCKET.off("accept request");
    };
  }, []);

  return (
    <section className="component-view">
      <div className="component-container">
        <div className="friends-nav">
          <p
            className="friends-nav-btn active-tab"
            ref={listRef}
            onClick={toggleTab}
          >
            Friends List
          </p>
          <p className="friends-nav-btn" ref={requestsRef} onClick={toggleTab}>
            Pending Requests
          </p>
          {props.user.requestIn.length > 0 && (
            <span className="request-counter">
              {props.user.requestIn.length}
            </span>
          )}
          <p className="friends-nav-btn" ref={searchRef} onClick={toggleTab}>
            Search
          </p>
        </div>
        {tab === listRef && (
          <FriendList
            user={props.user}
            token={props.token}
            updateTokenErr={props.updateTokenErr}
            friends={props.friends}
            updateFriends={props.updateFriends}
          />
        )}
        {tab === requestsRef && (
          <FriendRequests
            user={props.user}
            token={props.token}
            incoming={incoming}
            outgoing={outgoing}
            updateTokenErr={props.updateTokenErr}
            updateIncoming={updateIncoming}
            updateOutgoing={updateOutgoing}
            updateFriends={props.updateFriends}
          />
        )}
        {tab === searchRef && (
          <FriendSearch
            user={props.user}
            token={props.token}
            updateTokenErr={props.updateTokenErr}
            updateOutgoing={updateOutgoing}
            currFriends={props.friends}
            incoming={incoming}
            outgoing={outgoing}
          />
        )}
      </div>
    </section>
  );
}

export default Friends;
