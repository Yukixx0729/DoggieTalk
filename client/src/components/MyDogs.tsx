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

export interface Dogs {
  id: string;
  breed: string;
  age: string;
  name: string;
}
const MyDogs = () => {
  const [dogs, setDogs] = useState<Dogs[]>([]);
  const { user } = useAuth() as AuthContextType;
  const [noDogs, setNoDogs] = useState<boolean>(false);
  const [displayForm, setDisplayForm] = useState<boolean>(false);

  const displayDogs = async () => {
    const res = await fetch(`/api/dogs/${user.id}`);
    const data = await res.json();
    if (!data.length) {
      setNoDogs(true);
    } else {
      setDogs(
        data.map((dog: any) => ({
          id: dog.id,
          name: dog.name,
          breed: dog.breed,
          age: dog.age,
        }))
      );
    }
  };

  useEffect(() => {
    displayDogs();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/dogs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setDogs((prevDogs) => prevDogs.filter((dog) => dog.id !== id));
  };

  const handleOnClick = () => {
    return displayForm ? setDisplayForm(false) : setDisplayForm(true);
  };

  return (
    <Box ml="220px" padding="1px 16px" mt="50px">
      <Button colorScheme="blue" onClick={handleOnClick}>
        Add my dog(s)
      </Button>
      {displayForm && <AddDogForm setDogs={setDogs} setNoDogs={setNoDogs} />}
      {(noDogs || !dogs.length) && (
        <Text mt="20px">You haven't added your dog(s) yet.</Text>
      )}
      {dogs.map((dog) => {
        return (
          <Card key={dog.id} mt="50px">
            <CardHeader>MY DOG</CardHeader>
            <CardBody>
              Name: {dog.name} Age: {dog.age}yr(s)
            </CardBody>
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
