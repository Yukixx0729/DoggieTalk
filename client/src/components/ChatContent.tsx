import { Box, Text, Flex } from "@chakra-ui/react";
import { Message } from "./ChatRoom";
import { Socket } from "socket.io-client";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";
import { useEffect, useState } from "react";
import ChatForm from "./ChatForm";

export interface ChatContentProps {
  initialMessages: Message[];
  selectedGroupID: string | null;
  setInitialMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  socket: Socket;
}

// const socket: Socket = io("http://localhost:3000");

const ChatContent: React.FC<ChatContentProps> = ({
  initialMessages,
  selectedGroupID,
  setInitialMessages,
  socket,
}) => {
  const { user } = useAuth() as AuthContextType;
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    console.log("Get new message(s)");
    console.log(initialMessages);
    socket.on("new_message", (newMsg: Message) => {
      console.log("Received new message", newMsg);
      console.log("messages", messages);
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    });
  }, []);

  return (
    <Flex direction="column">
      <Box overflow="scroll" maxH="500px">
        <ul>
          {messages.map(({ id, senderId, message, senderName, timestamp }) => {
            return (
              <li key={`${id}-${timestamp}`}>
                {senderId === user.id ? (
                  <Box bg="#c4ffc450" padding="10px" borderRadius="8px">
                    <Text>
                      {senderName} {timestamp}
                    </Text>
                    <Text>{message}</Text>
                  </Box>
                ) : (
                  <Box bg="#c4c4ff50" padding="10px" borderRadius="8px">
                    <Text>{senderName}</Text>
                    <Text>{message}</Text>
                  </Box>
                )}
              </li>
            );
          })}
        </ul>
      </Box>

      <ChatForm
        selectedGroupID={selectedGroupID}
        setInitialMessages={setInitialMessages}
        socket={socket}
      />
    </Flex>
  );
};

export default ChatContent;
