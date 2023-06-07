import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { loginRequired } from "../middleware/loginCheck";
import { CustomRequest } from "../app";

const prisma = new PrismaClient();
const router = express.Router();

//send a msg
router.post(
  "/",
  loginRequired,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { message, groupId } = req.body;
    const socket = req.io;

    if (!req.session.user) {
      return res.status(401).json({ message: "You must be logged in" });
    }
    try {
      const { id: senderId } = req.session.user;
      const sender = await prisma.users.findUnique({ where: { id: senderId } });
      if (!sender) {
        return res.status(404).json({ message: "Sender not found" });
      }
      const currentTime = String(new Date());
      const newMsg = await prisma.chat.create({
        data: {
          message,
          senderId,
          groupId,
          senderName: sender.name,
          timestamp: currentTime,
        },
      });

      // io?.emit("new message", newMsg);
      // io?.to(groupId).emit("new_message", newMsg);
      socket?.emit("new_message", newMsg);
      // console.log("emitted: ", newMsg);

      res.status(201).json(newMsg);
    } catch (error) {
      res.status(500).json({ message: "Failed,try again later.", error });
    }
  }
);

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
