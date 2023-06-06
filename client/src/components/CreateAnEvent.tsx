import { Box, Input, Textarea } from "@chakra-ui/react";

const CreateAnEvent = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    console.log(fields);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw {
        status: res.status,
        message: data.message,
      };
    }
  };
  return (
    <Box mr="250px" ml="250px" alignContent="center" mb="20px">
      <form onSubmit={handleSubmit}>
        <Input name="title" placeholder="event title" required />
        <Input
          type="datetime-local"
          name="date"
          placeholder="event date"
          required
        />

        <Input name="location" placeholder="event location" required />
        <Textarea name="description" placeholder="event description" required />
        <Input type="submit" value="post" />
      </form>
    </Box>
  );
};

export default CreateAnEvent;
