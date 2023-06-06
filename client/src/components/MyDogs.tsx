import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Text,
} from "@chakra-ui/react";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";
import { useEffect, useState } from "react";
import AddDogForm from "./AddDogForm";
interface Dogs {
  id: string;
  breed: string;
  age: string;
  name: string;
}
const MyDogs = () => {
  const [dogs, setDogs] = useState<Dogs[]>([]);
  const { user } = useAuth() as AuthContextType;
  const [noDogs, setNoDogs] = useState<boolean>(false);
  useEffect(() => {
    const displayDogs = async () => {
      const res = await fetch(`/api/dogs/${user.id}`);
      const data = await res.json();
      if (res.status !== 200) {
        throw {
          status: res.status,
          message: data.message,
        };
      }

      setDogs(
        data.map((dog: any) => ({
          id: dog.id,
          name: dog.name,
          breed: dog.breed,
          age: dog.age,
        }))
      );
    };
    async () => {
      try {
        await displayDogs();
      } catch (err: any) {
        setNoDogs(true);
      }
    };
  }, []);

  const handleDelete = async (id: string) => {};
  return (
    <Box ml="220px" padding="1px 16px" mt="50px">
      <Button colorScheme="blue">Add my dog(s)</Button>
      <AddDogForm />
      {noDogs && <Text>You haven't added your dog(s) yet.</Text>}
      {dogs.map((dog) => {
        return (
          <Card key={dog.id} mt="50px">
            <CardHeader>
              Name: {dog.name} Age: {dog.age}yr(s)
            </CardHeader>
            <CardBody>Breed: {dog.breed}</CardBody>
            <Button
              onClick={() => {
                handleDelete(`${dog.id}`);
              }}
            >
              Delete
            </Button>
          </Card>
        );
      })}
    </Box>
  );
};

export default MyDogs;
