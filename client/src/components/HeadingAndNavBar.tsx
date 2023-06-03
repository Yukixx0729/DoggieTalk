import { Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
const HeadingAndNavBar = () => {
  return (
    <Box padding="20px">
      <ul>
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
          <Link to="/setting">Settings</Link>
        </li>
      </ul>
    </Box>
  );
};

export default HeadingAndNavBar;
