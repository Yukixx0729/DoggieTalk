import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Text,
} from "@chakra-ui/react";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

export interface Events {
  id: string;
  host: string;
  title: string;
  date: string;
  description: string;
  location: string;
}

const MyEvents = () => {
  const { user } = useAuth() as AuthContextType;
  const [noEvent, setNoEvent] = useState<boolean>(false);
  const [events, setEvents] = useState<Events[]>([]);

  const joinedEvents = async () => {
    const res = await fetch(`/api/users/${user.id}`);
    const data = await res.json();
    console.log(data.events);
    if (!data.events.length) {
      setNoEvent(true);
    } else {
      setEvents(
        data.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          host: event.host,
          date: event.date,
          description: event.description,
          location: event.location,
        }))
      );
    }
  };

  useEffect(() => {
    joinedEvents();
  }, []);

  const handleDeleteEvent = async (id: string) => {
    await fetch(`/api/events/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    if (!events.length) setNoEvent(true);
  };

  const handleUnjoin = async (id: string) => {
    await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ unjoin: true }),
    });
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    if (!events.length) setNoEvent(true);
  };

  return (
    <Box ml="220px" padding="1px 16px" mt="50px">
      {(noEvent || !events.length) && (
        <Text>You currently didn't join(create) any events.</Text>
      )}
      {events.map((event) => {
        const currentTime = dayjs(event.date).utc();
        const sydneyDate = currentTime
          .tz("Australia/Sydney")
          .format("YYYY-MM-DD HH:mm");
        return (
          <Card key={event.id} mt="20px">
            <CardHeader>Event title: {event.title}</CardHeader>
            <CardBody>
              Date:{sydneyDate} Location: {event.location}
            </CardBody>
            <CardFooter>
              {event.host === user.id ? (
                <Button onClick={() => handleDeleteEvent(`${event.id}`)}>
                  Cancel the event
                </Button>
              ) : (
                <Button onClick={() => handleUnjoin(`${event.id}`)}>
                  Unjoin
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </Box>
  );
};

export default MyEvents;
