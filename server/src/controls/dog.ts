import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { loginRequired } from "../middleware/loginCheck";
const prisma = new PrismaClient();
const router = express.Router();

//add a dog
router.post("/", loginRequired, async (req: Request, res: Response) => {
  const { name, breed, age } = req.body;
  if (!req.session.user) {
    return res.status(401).json({ message: "You must be logged in" });
  }
  try {
    const { id } = req.session.user;
    const newDog = await prisma.dog.create({
      data: {
        name,
        breed,
        age,
        userId: id,
      },
    });
    res.status(201);
    res.json(newDog);
  } catch (error) {
    res.status(500).json({ message: "Failed,try again later.", error });
  }
});

//get all dogs by id
router.get("/:id", loginRequired, async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const dogs = await prisma.dog.findMany({
      where: { userId },
    });

    if (!dogs.length) {
      return res
        .status(404)
        .json({ message: "This user currently has no dog." });
    }
    res.json(dogs);
  } catch (error) {
    res.status(500).json({ message: "Failed,try again later", error });
  }
});

//delete a dog
router.delete("/:id", loginRequired, async (req: Request, res: Response) => {
  const dogId = req.params.id;

  try {
    const deletedDog = await prisma.dog.delete({
      where: { id: dogId },
    });
    return res.json({ message: "Deleted dog." });
  } catch (error) {
    res.status(500).json({ message: "Dog not found.", error });
  }
});

//update a dog
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
