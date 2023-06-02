import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { loginRequired } from "../middleware/loginCheck";

const prisma = new PrismaClient();
const router = express.Router();

//send a msg
router.post(
  "/",
  loginRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    const { message, groupId } = req.body;
    if (!req.session.user) {
      return res.status(401).json({ message: "You must be logged in" });
    }
    try {
      const { id: senderId } = req.session.user;
      const newMsg = await prisma.chat.create({
        data: {
          message,
          senderId,
          groupId,
        },
      });
      res.status(201);
      res.json(newMsg);
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
