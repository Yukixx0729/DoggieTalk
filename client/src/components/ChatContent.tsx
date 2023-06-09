import { Box, Text, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Message } from "./ChatRoom";
import { Socket } from "socket.io-client";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";
import { useEffect, useState } from "react";
import ChatForm from "./ChatForm";
import "./ChatContent.css";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

export interface ChatContentProps {
  initialMessages: Message[];
  selectedGroupID: string | null;
  setInitialMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  socket: Socket;
}

const ChatContent: React.FC<ChatContentProps> = ({
  initialMessages,
  selectedGroupID,
  setInitialMessages,
  socket,
}) => {
  const { user } = useAuth() as AuthContextType;
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    socket.on("new_message", (newMsg: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    });
  }, []);

  return (
    <Flex direction="column" alignItems="center" marginTop={10}>
      <div className="chat-container">
        <ul style={{ padding: "0 15px" }}>
          {messages.map(({ id, senderId, message, senderName, timestamp }) => {
            const currentTime = dayjs(timestamp).utc();
            const sydneyDate = currentTime
              .tz("Australia/Sydney")
              .format("YYYY-MM-DD HH:mm");
            return (
              <li key={`${id}-${timestamp}`}>
                {senderId === user.id ? (
                  <Box
                    bg="#c4ffc450"
                    padding="10px"
                    borderRadius="8px"
                    className="myMsg"
                  >
                    <Text as="em">
                      {senderName}(yourself) {sydneyDate}
                    </Text>
                    <Text>{message}</Text>
                  </Box>
                ) : (
                  <Box
                    bg="#c4c4ff50"
                    padding="10px"
                    borderRadius="8px"
                    className="othersMsg"
                  >
                    <Text>
                      <Link to={`/user/${senderId}`}>
                        <Text as="b">{senderName}</Text>
                      </Link>{" "}
                      {sydneyDate}
                    </Text>
                    <Text>{message}</Text>
                  </Box>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <ChatForm
        selectedGroupID={selectedGroupID}
        setInitialMessages={setInitialMessages}
        socket={socket}
      />
    </Flex>
  );
};

export default ChatContent;
