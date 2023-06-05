import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";

interface userInfo {
  id: string;
  userName: string;
  dogs: Dog[];
}

interface Dog {
  id: string;
  age: string;
  name: string;
  breed: string;
}

const UserInfo = () => {
  const navigate = useNavigate();
  const [checkChat, setCheckChat] = useState<boolean>(false);
  const { user } = useAuth() as AuthContextType;
  const { userId } = useParams();
  const [info, setInfo] = useState<userInfo>({
    id: "",
    userName: "",
    dogs: [],
  });

  useEffect(() => {
    const getInfo = async () => {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      if (res.status !== 200) {
        throw {
          status: res.status,
          message: data.message,
        };
      }
      setInfo({
        id: data.id,
        userName: data.name,
        dogs: data.dogs,
      });
    };
    getInfo();
  }, []);

  const groupCheck = async (groupName: string) => {
    const res = await fetch(`/api/users/${user.id}`);
    const data = await res.json();
    console.log(info.userName);
    const checkResult = data.groups.filter((group: any) => {
      return group.name.includes(groupName);
    });
    return checkResult;
  };

  const CreatePMChat = async (id: string, name: string) => {
    const groupinfo = { name: `Chat with ${name}`, members: [id] };
    const result = await groupCheck(`${groupinfo.name}`);
    if (result.length > 0) {
      setCheckChat(true);
    } else {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupinfo),
      });
      const data = await res.json();
      if (res.status !== 201) {
        throw {
          status: res.status,
          message: data.message,
        };
      }
      navigate("/chat");
    }
  };

  return (
    <Box ml="250px" padding="1px 16px" height="1000px" mt="20px">
      <Heading size="md" mb="20px">
        User information
      </Heading>
      <Text as="b">{info.userName} </Text>
      {info.dogs.map((dog) => {
        return (
          <Card key={dog.id} mt="20px">
            <CardHeader>Pet name: {dog.name}</CardHeader>
            <CardBody>Pet age: {dog.age} yr(s)</CardBody>
            <CardFooter>Pet breed:{dog.breed}</CardFooter>
          </Card>
        );
      })}
      {!info.dogs.length && (
        <Box mt="20px">This user hasn't updated his(her) dog(s) yet.</Box>
      )}
      <Button
        mt="20px"
        onClick={() => CreatePMChat(`${info.id}`, `${info.userName}`)}
      >
        Start a chat with him(her)
      </Button>
      {checkChat && <Box>You already set up a chat with him(her).</Box>}
    </Box>
  );
};
export default UserInfo;
