import { useRef, useState } from "react";
import FriendSearch from "./FriendSearch";
import FriendRequests from "./FriendRequests";
import FriendList from "./FriendList";

function Friends(props) {
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
          <p className="friends-nav-btn" ref={searchRef} onClick={toggleTab}>
            Search
          </p>
        </div>
        {tab === listRef && (
          <FriendList
            user={props.user}
            token={props.token}
            updateUser={props.updateUser}
            updateTokenErr={props.updateTokenErr}
          />
        )}
        {tab === requestsRef && (
          <FriendRequests
            user={props.user}
            token={props.token}
            updateUser={props.updateUser}
            updateTokenErr={props.updateTokenErr}
          />
        )}
        {tab === searchRef && (
          <FriendSearch
            user={props.user}
            token={props.token}
            updateUser={props.updateUser}
            updateTokenErr={props.updateTokenErr}
          />
        )}
      </div>
    </section>
  );
}

export default Friends;
