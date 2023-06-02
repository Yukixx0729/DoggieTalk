import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { checkPasswordHash } from "./user-password";
import { exclude } from "./user";

const prisma = new PrismaClient();
const router = express.Router();

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

//log in an user
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findMany({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid username or password" });
    }
    const passwordValid = checkPasswordHash(password, user[0].Password);
    if (passwordValid) {
      const userWithoutPassword = exclude(user[0], "Password");
      req.session.user = userWithoutPassword;
      res.json(userWithoutPassword);
    }
  } catch (error) {
    res.status(500).json({ message: "User not found.", error });
  }
});

//get current user
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user) {
    const currentUser = req.session.user;
    res.json({ currentUser });
  } else {
    res.status(401).json({ message: "User not logged in" });
  }
});

//log out an user
router.delete("/", (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Something went wrong." });
    }

    res.status(200).json({ message: "Logged out successfully" });
  });
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
