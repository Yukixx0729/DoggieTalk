import { Box, Text } from "@chakra-ui/react";
import { Message } from "./ChatRoom";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";
import ChatForm from "./ChatForm";
interface ChatContentMessages {
  messages: Message[];
}
const ChatContent: React.FC<ChatContentMessages> = ({ messages }) => {
  const { user } = useAuth() as AuthContextType;

  return (
    <Box>
      <ul>
        {messages.map((message) => {
          return (
            <li key={message.id}>
              {message.senderId === user.id ? (
                <Box bg="green" padding="3px">
                  {" "}
                  <Text>{message.message}</Text>
                  <Text>{message.senderName}</Text>
                </Box>
              ) : (
                <Box bg="lightblue" padding="3px">
                  {" "}
                  <Text>{message.message}</Text>
                  <Text>{message.senderName}</Text>
                </Box>
              )}
            </li>
          );
        })}
      </ul>
      <ChatForm />
    </Box>
  );
};

export default ChatContent;
