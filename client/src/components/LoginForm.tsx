import { useState } from "react";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";
import { Heading, Input, Box, Text } from "@chakra-ui/react";

const LoginForm = () => {
  const { login } = useAuth() as AuthContextType;
  const [invalidUser, setInvalidUser] = useState<String>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fields = Object.fromEntries(new FormData(e.currentTarget));

    try {
      await login(fields);
    } catch (err: any) {
      setInvalidUser(err.message);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Heading textAlign="center" size="sm">
          Log in
        </Heading>

        <Input type="email" name="email" placeholder="email" required />

        <Input
          type="password"
          name="password"
          placeholder="password"
          required
        />

        <Input type="submit" value="login" />
      </form>
      <Text color="red">{invalidUser}</Text>
    </Box>
  );
};

export default LoginForm;
