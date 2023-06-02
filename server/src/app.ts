import express, { Request, Response, NextFunction, Application } from "express";
import { Server } from "http";
import userRouter from "./controls/user";
import sessionRouter from "./controls/session";
import dogRouter from "./controls/dog";
import groupRouter from "./controls/group";
import chatRouter from "./controls/chat";
import db from "./db";
require("dotenv").config();

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const app: Application = express();
const PORT: Number = Number(process.env.PORT) || 3000;

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
      pool: db,
      createTableIfMissing: true,
    }),
  })
);

app.use(express.static("client"));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/session", sessionRouter);
app.use("/api/dogs", dogRouter);
app.use("/api/groups", groupRouter);
app.use("/api/chat", chatRouter);

const server: Server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
