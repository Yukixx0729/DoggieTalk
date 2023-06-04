import { Box, Input, Textarea } from "@chakra-ui/react";
import { Message } from "./ChatRoom";
import { Socket } from "socket.io-client";
import { useState } from "react";

interface ChatFormProps {
  selectedGroupID: string | null;
  setInitialMessages: React.Dispatch<React.SetStateAction<Message[]>>;

  socket: Socket;
}

const ChatForm: React.FC<ChatFormProps> = ({ selectedGroupID, socket }) => {
  const [chatInput, setChatInput] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    const msgContent = { ...fields, groupId: selectedGroupID };
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msgContent),
    });

    const data = await res.json();

    if (res.status !== 201) {
      throw {
        status: res.status,
        message: data.message,
      };
    }

    if (msgContent) {
      socket.emit("send_message", msgContent);
    }
    setChatInput("");
  };
  return (
    <Box mt="20px">
      <form onSubmit={handleSubmit}>
        <Textarea
          name="message"
          placeholder="Type here"
          value={chatInput}
          onChange={(e) => {
            setChatInput(e.target.value);
          }}
          required
        />
        <Input type="submit" value="send" />
      </form>
    </Box>
  );
};

export default ChatForm;
