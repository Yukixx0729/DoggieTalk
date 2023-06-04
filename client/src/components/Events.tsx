import { Box, Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Events {
  id: string;
  date: string;
  description: string;
  location: string;
  title: string;
}

const Events = () => {
  const [events, setEvents] = useState<Events[]>([]);

  useEffect(() => {
    const getEvents = async () => {
      const res = await fetch("/api/events");
      const data = await res.json();
      console.log(data);
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
        }))
      );
    };
    getEvents();
  }, []);
  return (
    <Box>
      {events.length &&
        events.map((event) => {
          return (
            <Card key={event.id}>
              <CardHeader>{event.title}</CardHeader>
              <CardBody>{event.description}</CardBody>
              <CardFooter>
                Date:{event.date} Location: {event.location}
              </CardFooter>
            </Card>
          );
        })}
    </Box>
  );
};

export default Events;
