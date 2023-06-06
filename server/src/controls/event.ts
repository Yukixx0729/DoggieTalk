import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { loginRequired } from "../middleware/loginCheck";

const prisma = new PrismaClient();
const router = express.Router();

//get all events
router.get("/", loginRequired, async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: currentDate,
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed,try again later", error });
  }
});
//post an event
router.post("/", loginRequired, async (req: Request, res: Response) => {
  const { title, description, location, date } = req.body;
  if (!req.session.user) {
    return res.status(401).json({ message: "You must be logged in" });
  }
  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        participants: {
          connect: {
            id: req.session.user.id,
          },
        },
      },
      include: {
        participants: true,
      },
    });
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Failed,try again later", error });
  }
});

//get an event by id
router.get("/:id", loginRequired, async (req: Request, res: Response) => {
  const eventId = req.params.id;
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        participants: true,
      },
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed,try again later", error });
  }
});

//update participants of an event by id
router.put("/:id", loginRequired, async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "You must be logged in" });
  }
  const eventId = req.params.id;
  try {
    const event = await await prisma.event.update({
      where: {
        id: eventId,
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      data: {
        participants: {
          connect: {
            id: req.session.user.id,
          },
        },
      },
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed,try again later", error });
  }
});

const shutdown = async () => {
  try {
    await prisma.$disconnect();
    console.log("Prisma disconnected");
  } catch (error) {
    console.error("Error disconnecting Prisma:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);

export default router;
