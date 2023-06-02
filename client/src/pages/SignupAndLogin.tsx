import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { Container, Heading, Box, Select } from "@chakra-ui/react";

export const SignupAndLogin = () => {
  const [userAct, setUserAct] = useState("login");
  return (
    <Container>
      <Heading color="#5BB0BA" size="xl" textAlign="center">
        Doggie Talk🐶
      </Heading>

      <Box marginTop="30px" textAlign="left">
        <Heading size="sm">Has an account yet?</Heading>
        <Select
          name="users"
          id="users"
          onChange={(e) => setUserAct(e.target.value)}
        >
          <option value="login">Login</option>
          <option value="signup">Signup</option>
        </Select>{" "}
      </Box>
      <Container centerContent bg="#EBF5F7" marginTop="30px">
        {userAct === "login" && <LoginForm />}
        {userAct === "signup" && <SignupForm />}
      </Container>
    </Container>
  );
};
