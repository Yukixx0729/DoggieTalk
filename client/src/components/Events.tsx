import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";

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
  const { user } = useAuth() as AuthContextType;
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
  }, [events]);

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
      if (event.id === `${eventId}`) {
        return {
          ...event,
          participants: [data.participants],
        };
      }
      return event;
    });
    console.log(selectEvent);
    setEvents(selectEvent);
  };

  return (
    <Box ml="220px" padding="1px 16px" height="1000px">
      <Button>Create an event!</Button>
      {events.length &&
        events.map((event) => {
          return (
            <Card key={event.id} mt="20px">
              <CardHeader>Event title: {event.title}</CardHeader>
              <CardBody>
                Date:{event.date} Location: {event.location}
              </CardBody>
              <CardBody>Description: {event.description}</CardBody>
              <CardBody>
                Participants:{" "}
                <HStack spacing="8px">
                  {event.participants.map((person) => {
                    return (
                      <Box key={`${event.title} ${person.id}`}>
                        <Link to={`/user/${person.id}`}>{person.name}</Link>
                      </Box>
                    );
                  })}
                </HStack>
              </CardBody>
              <CardFooter>
                <Button
                  onClick={() => {
                    joinEvent(`${event.id}`);
                  }}
                >
                  Join the event too!
                </Button>
              </CardFooter>
            </Card>
          );
        })}
    </Box>
  );
};

export default Events;
