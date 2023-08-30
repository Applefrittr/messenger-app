import { useRef, useState } from "react";
import "../styles/Friends.css";
import FriendsSearch from "./FriendsSearch";

function Friends() {
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
        {tab === listRef && <p>Friend list component</p>}
        {tab === requestsRef && <p>Requests component</p>}
        {tab === searchRef && <FriendsSearch />}
      </div>
    </section>
  );
}

export default Friends;
