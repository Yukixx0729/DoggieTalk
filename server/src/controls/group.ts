import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { loginRequired } from "../middleware/loginCheck";

const prisma = new PrismaClient();
const router = express.Router();

//add a chat group
router.post(
  "/",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, members } = req.body;
    if (!req.session.user) {
      return res.status(401).json({ message: "You must be logged in" });
    }
    try {
      const { id } = req.session.user;
      const groupMembers = [...members, id];
      const newGroup = await prisma.group.create({
        data: {
          name,
          users: {
            connect: groupMembers.map((memberId: string) => ({ id: memberId })),
          },
        },
      });
      res.status(201);
      res.json(newGroup);
    } catch (error) {
      res.status(500).json({ message: "Failed,try again later.", error });
    }
  }
);

// get a group by id
router.get("/:id", loginRequired, async (req: Request, res: Response) => {
  const gourpId = req.params.id;
  try {
    const group = await prisma.group.findUnique({
      where: { id: gourpId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: true,
      },
    });
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: "Failed,try again later", error });
  }
});

//disconnect prisma
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
