import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, AuthContextType } from "../contexts/AuthProvider";
import CreateAnEvent from "./CreateAnEvent";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

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
  const [displayForm, setDisplayForm] = useState<boolean>(false);

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

  useEffect(() => {
    getEvents();
  }, []);

  const joinEvent = async (eventId: string) => {
    const res = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ join: true }),
    });
    await res.json();
    getEvents();
  };

  const handleDisplayForm = () => {
    if (displayForm) {
      setDisplayForm(false);
    } else {
      setDisplayForm(true);
    }
  };
  return (
    <div className="events-container">
      <Button
        colorScheme="blue"
        mt="20px"
        mb="20px"
        onClick={() => {
          handleDisplayForm();
        }}
      >
        Create an event!
      </Button>

      {displayForm && <CreateAnEvent getEvents={getEvents} />}

      <h1 className="sub-headings">Events' list</h1>
      {events.length &&
        events.map((event) => {
          const currentTime = dayjs(event.date).utc();
          const sydneyDate = currentTime
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm");
          const isUserJoined = event.participants.some(
            (participant) => participant.id === user.id
          );
          return (
            <Card
              key={event.id}
              mt="15px"
              bg="#E7E1C450"
              fontFamily="Josefin Sans, sans-serif"
              width="450px"
            >
              <CardHeader>Event title: {event.title}</CardHeader>
              <CardBody>
                Date:{sydneyDate} Location: {event.location}
              </CardBody>
              <CardBody>Description: {event.description}</CardBody>
              <CardBody>
                Participants:{" "}
                <HStack spacing="8px">
                  {event.participants.map((person) => {
                    return (
                      <Box key={`${event.title} ${person.id}`}>
                        {person.id === user.id ? (
                          <Text>{person.name}(Yourself)</Text>
                        ) : (
                          <Text as="b">
                            <Link to={`/user/${person.id}`}>{person.name}</Link>
                          </Text>
                        )}
                      </Box>
                    );
                  })}
                </HStack>
              </CardBody>
              <CardFooter>
                {!isUserJoined ? (
                  <Button onClick={() => joinEvent(event.id)}>
                    Join the event!
                  </Button>
                ) : (
                  <Text>Joined</Text>
                )}
              </CardFooter>
            </Card>
          );
        })}
    </div>
  );
};

export default Events;
