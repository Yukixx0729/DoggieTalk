import "./HeadingAndNavBar.css";
import { Link } from "react-router-dom";
const HeadingAndNavBar = () => {
  return (
    <div>
      <ul className="sideBar">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/chat">Chats</Link>
        </li>
        <li>
          <Link to="/events">Events</Link>
        </li>
        <li>
          <Link to="/myaccount">My Account</Link>
        </li>
      </ul>
    </div>
  );
};

export default HeadingAndNavBar;
