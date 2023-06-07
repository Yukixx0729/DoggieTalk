import { Box, Input } from "@chakra-ui/react";
import { Dogs } from "./MyDogs";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";
import { useRef } from "react";

interface MyDogsProps {
  setDogs: (dogs: Dogs[]) => void;
  setNoDogs: (value: boolean) => void;
}

const AddDogForm = ({ setDogs, setNoDogs }: MyDogsProps) => {
  const { user } = useAuth() as AuthContextType;
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    console.log(fields);
    const res = await fetch("/api/dogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });

    const data = await res.json();

    if (res.status !== 201) {
      throw {
        status: res.status,
        message: data.message,
      };
    }

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
    await displayDogs();
    setNoDogs(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <Box width="500px" mt="20px">
      <form onSubmit={handleSubmit} ref={formRef}>
        <Input name="name" placeholder="dog's name" required />
        <Input name="breed" placeholder="dog's breed" required />
        <Input name="age" placeholder="dog's age" required />
        <Input type="submit" value="add" />
      </form>
    </Box>
  );
};

export default AddDogForm;
