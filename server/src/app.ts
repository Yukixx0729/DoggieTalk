import express, { Request, Response, NextFunction, Application } from "express";
import { Server } from "socket.io";
// import { createServer } from "http";
import userRouter from "./controls/user";
import sessionRouter from "./controls/session";
import dogRouter from "./controls/dog";
import groupRouter from "./controls/group";
import chatRouter from "./controls/chat";
import eventRouter from "./controls/event";
import db from "./db";
require("dotenv").config();

const http = require("http");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const cors = require("cors");

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.static("client"));
app.use(express.json());
app.use(cors());

export interface CustomRequest extends Request {
  io?: Server;
}

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

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const socketMiddleware = (io: Server) => {
  return (req: any, res: any, next: any) => {
    req.io = io;
    next();
  };
};

// app.use(attachIOToRequest); // middleware function to share IO instance to all nested routes
app.use(socketMiddleware(io));

io.on("connection", (socket) => {
  socket.on("client_connected", () => {
    console.log("Client connected", socket.id);
  });

  socket.on("send_message", (data) => {
    console.log("logging sent msg", data);
  });
});

app.use(express.static("client"));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/session", sessionRouter);
app.use("/api/dogs", dogRouter);
app.use("/api/groups", groupRouter);
app.use("/api/chat", chatRouter);
app.use("/api/events", eventRouter);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
