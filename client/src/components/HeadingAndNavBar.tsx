import { Link } from "react-router-dom";
const HeadingAndNavBar = () => {
  return (
    <nav className="navBar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/events">Events</Link>
        </li>
        <li>
          <Link to="/setting">Settings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default HeadingAndNavBar;
