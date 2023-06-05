import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Events {
  id: string;
  date: string;
  description: string;
  location: string;
  title: string;
  participants: participants[];
}

interface participants {
  id: string;
  name: string;
  email: string;
}

const Events = () => {
  const [events, setEvents] = useState<Events[]>([]);

  useEffect(() => {
    const getEvents = async () => {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (res.status !== 200) {
        throw {
          status: res.status,
          message: data.message,
        };
      }
      setEvents(
        data.map((event: any) => ({
          id: event.id,
          date: event.date,
          description: event.description,
          location: event.location,
          title: event.title,
          participants: event.participants,
        }))
      );
    };
    getEvents();
  }, []);

  const joinEvent = async (eventId: string) => {
    const res = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    console.log(data.participants);
    const selectEvent = events.map((event) => {
      if (event.id === `${eventId}`)
        return {
          ...event,
          participants: [data.participants],
        };
    });
    console.log(selectEvent);
    // setEvents([...events, selectEvent]);
  };
  return (
    <Box ml="200px" padding="1px 16px" height="1000px">
      {events.length &&
        events.map((event) => {
          return (
            <Card key={event.id} mt="20px">
              <CardHeader>{event.title}</CardHeader>
              <CardBody>
                Date:{event.date} Location: {event.location}
              </CardBody>
              <CardBody>{event.description}</CardBody>
              <CardFooter>
                Participants:{" "}
                {event.participants.map((person) => {
                  return <span key={person.id}>{person.name} </span>;
                })}
              </CardFooter>
              <Button
                onClick={() => {
                  joinEvent(`${event.id}`);
                }}
              >
                Join the event too!
              </Button>
            </Card>
          );
        })}
    </Box>
  );
};

export default Events;
