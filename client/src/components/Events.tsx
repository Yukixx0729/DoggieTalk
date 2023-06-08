import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  HStack,
  Heading,
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
      body: JSON.stringify({ join: true }),
    });
    const data = await res.json();
    const selectEvent = events.map((event) => {
      if (event.id === `${eventId}`) {
        return {
          ...event,
          participants: [data.participants],
        };
      }
      return event;
    });
    setEvents(selectEvent);
  };

  const handleDisplayForm = () => {
    if (displayForm) {
      setDisplayForm(false);
    } else {
      setDisplayForm(true);
    }
  };
  return (
    <Box ml="220px" padding="1px 16px">
      <Box textAlign="center">
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
        {displayForm && <CreateAnEvent />}
      </Box>
      <Heading textAlign="center">Events' list</Heading>
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
            <Card key={event.id} mt="50px" mr="150px" ml="150px" bg="#E7E1C450">
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
    </Box>
  );
};

export default Events;
