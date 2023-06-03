import { Heading, Input, Box, Text } from "@chakra-ui/react";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";
import { useState } from "react";

const SignupForm = () => {
  const { register } = useAuth() as AuthContextType;
  const [err, setErr] = useState<null | string>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fields = Object.fromEntries(new FormData(e.currentTarget));

    if (fields.password !== fields.password2) {
      setErr("Passwords do not match!");
      return;
    }
    delete fields.password2;

    try {
      await register(fields);
    } catch (err: any) {
      setErr(err.message);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Heading textAlign="center" size="sm">
          Sign up
        </Heading>

        <Input type="text" name="name" placeholder="username" required />
        <Input type="email" name="email" placeholder="email" required />
        <Input
          type="password"
          name="password"
          placeholder="password"
          required
        />
        <Input
          type="password"
          name="password2"
          placeholder="confirm password"
          required
        />
        <Input type="submit" value="Signup" required />
      </form>
      {err && <Text color="red">{err}</Text>}
    </Box>
  );
};

export default SignupForm;
