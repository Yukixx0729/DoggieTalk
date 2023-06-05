import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";

import { hashPassword, passwordCheck } from "./user-password";
import { CustomRequest } from "../app";

export function exclude(user: { [x: string]: any }, ...keys: any[]) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

const prisma = new PrismaClient();
const router = express.Router();

// Get user by id
router.get("/:id", async (req: CustomRequest, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        dogs: true,
        messages: true,
        groups: {
          include: {
            messages: true,
            users: true,
          },
        },
        events: {
          include: {
            participants: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userWithoutPassword = exclude(user, "Password");
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
});

//get user by email
function getUserByEmail(email: string) {
  return prisma.users.count({
    where: {
      email,
    },
  });
}

//create an user
router.post("/", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const validUser = name && email && password;
  //check if valid user
  if (!validUser) {
    return res.status(400).json({ message: "More information please." });
  }
  if ((await getUserByEmail(email)) > 0) {
    return res.status(400).json({ message: "Email has been used." });
  }

  //valid password
  if (passwordCheck(password)) {
    const hashedPassword = hashPassword(password);
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        Password: hashedPassword,
        groups: {
          connect: [{ id: "clihhgwce0004eiir9t6kskf2" }],
        },
      },
    });
    res.status(201).json(newUser);
  } else {
    return res.status(400).json({
      message: "Password should contain letters, numbers and symbols.",
    });
  }
});

//delete an user by id
router.delete("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const deletedUser = await prisma.users.delete({
      where: { id: userId },
    });
    return res.json({ message: "Deleted user." });
  } catch (error) {
    res.status(500).json({ message: "User not found.", error });
  }
});

//update an user by id
router.put("/:id", async (req: Request, res: Response) => {});

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
