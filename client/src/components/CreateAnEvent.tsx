import { Input, Textarea } from "@chakra-ui/react";
import { useRef } from "react";

interface CreateAnEventProps {
  getEvents: () => void;
}

const CreateAnEvent = ({ getEvents }: CreateAnEventProps) => {
  const formRef = useRef<HTMLFormElement>(null);

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
    if (formRef.current) {
      formRef.current.reset();
    }
    getEvents();
  };

  return (
    <div className="event-form">
      <form onSubmit={handleSubmit} ref={formRef}>
        <Input name="title" placeholder="event title" required size="sm" />
        <Input
          type="datetime-local"
          name="date"
          placeholder="event date"
          required
          size="sm"
        />

        <Input
          name="location"
          placeholder="event location"
          required
          size="sm"
        />
        <Textarea
          name="description"
          placeholder="event description"
          required
          size="sm"
        />
        <Input type="submit" value="post" size="sm" />
      </form>
    </div>
  );
};

export default CreateAnEvent;
