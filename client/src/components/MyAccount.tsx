import "./MyAccount.css";
import { useState } from "react";
import MyDogs from "./MyDogs";
import MyEvents from "./MyEvets";
import { Box } from "@chakra-ui/react";

const MyAccount = () => {
  const [content, setContent] = useState<string>("");

  return (
    <div className="settinglist-container">
      <Box padding="20px">
        <ul id="settingNav">
          <h1>My account</h1>
          <li className="settingNavItem" onClick={() => setContent("dogs")}>
            🐕 My dogs
          </li>
          <li className="settingNavItem" onClick={() => setContent("events")}>
            📝 My events
          </li>
        </ul>
      </Box>
      {content === "dogs" && <MyDogs />}
      {content === "events" && <MyEvents />}
    </div>
  );
};

export default MyAccount;
