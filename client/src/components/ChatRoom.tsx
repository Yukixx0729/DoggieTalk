import { useEffect, useState } from "react";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";
import { Box, Flex } from "@chakra-ui/react";
import "./ChatRoom.css";
import ChatContent from "./ChatContent";
interface ChatRoom {
  id: string;
  name: string;
  message: Message[];
}

export interface Message {
  id: string;
  sender: string;
  message: string;
  senderId: string;
  timestamp: string;
  senderName: string;
}

const Chat = () => {
  const { user } = useAuth() as AuthContextType;
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    const getChatRooms = async () => {
      const res = await fetch(`/api/users/${user.id}`);
      const data = await res.json();
      if (res.status !== 200) {
        throw {
          status: res.status,
          message: data.message,
        };
      }
      setChatRooms(data.groups);
    };
    getChatRooms();
  }, []);
  const displayChat = async (id: string) => {
    const res = await fetch(`/api/groups/${id}`);
    const data = await res.json();
    const { messages } = data;
    console.log(messages);
    setMessages(
      messages.map((message: any) => ({
        id: message.id,
        sender: message.sender,
        message: message.message,
        senderId: message.senderId,
        senderName: message.senderName,
        timestamp: message.timestamp,
      }))
    );
  };
  return (
    <Flex bg="white" flex="1">
      <Box mt="20px" padding="20px">
        <ul className="chatLists">
          {chatRooms &&
            chatRooms.map((room) => {
              return (
                <li
                  key={room.id}
                  className="chatRoomName"
                  onClick={() => displayChat(`${room.id}`)}
                >
                  {room.name}
                </li>
              );
            })}
        </ul>
      </Box>
      {messages.length > 0 && <ChatContent messages={messages} />}
    </Flex>
  );
};

export default Chat;
