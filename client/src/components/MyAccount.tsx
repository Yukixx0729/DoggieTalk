import { Box, Flex, Heading } from "@chakra-ui/react";
import "./MyAccount.css";
import { useState } from "react";
import MyDogs from "./MyDogs";
import MyEvents from "./MyEvets";

const MyAccount = () => {
  const [content, setContent] = useState<string>("");

  return (
    <Flex bg="white" flex="1" ml="200px" padding="1px 16px" height="1000px">
      <Box mt="20px" padding="20px">
        <ul id="settingNav">
          <Heading textAlign="center" size="md" as="i">
            My account
          </Heading>
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
    </Flex>
  );
};

export default MyAccount;
