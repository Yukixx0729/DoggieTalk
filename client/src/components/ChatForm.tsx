import { Box, Input, Textarea } from "@chakra-ui/react";
// import { useAuth, AuthContextType } from "../contexts/AuthProvider";

const ChatForm = () => {
  //   const { user } = useAuth() as AuthContextType;
  const handleSending = () => {};
  return (
    <Box mt="20px">
      <form onSubmit={handleSending}>
        <Textarea name="message" placeholder="write here" required></Textarea>
        <Input type="submit" value="send" />
      </form>
    </Box>
  );
};

export default ChatForm;
