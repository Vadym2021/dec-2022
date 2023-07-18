import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import http from "http";
import * as mongoose from "mongoose";
import { Server } from "socket.io";
import * as swaggerUi from "swagger-ui-express";

import { configs } from "./configs/config";
import { cronRunner } from "./crons";
import { ApiError } from "./errors";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";
import * as swaggerJson from "./utils/swagger.json";

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  // console.log(socket);
  console.log(socket.id);

  socket.on("message:create", (messageData) => {
    console.log(messageData, "MESSAGE DATA");

    socket.emit("message:receive", { ok: true });
  });

  //send to all connected sockets
  // socket.on("broadcast:all", () => {
  //   io.emit("alert", "Air strike WARNING");

  socket.on("broadcast:all", () => {
    socket.broadcast.emit("alert", "Air strike WARNING");
  });

  socket.on("room:joinUser", ({ roomId }) => {
    socket.join(roomId); // enter room
    //socket.leave(roomId); выйти из комнаты

    // send to all users:
    // io.to(roomId).emit("room:newUserAlert", socket.id);

    // send to all users in room except sender
    // socket.to(roomId).emit("room:newUserAlert", socket.id);

    io.to(roomId).emit("room:newUserAlert", socket.id);
  });
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

app.use("*", apiLimiter);
app.use(
  cors({
    origin: "*",
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    // allowHeaders: [
    //   "Authorization",
    //   "Content-Type",
    //   "Origin",
    //   "Access-Control-Allow-Origin",
    // ],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// CRUD - create, read, update, delete

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;

  return res.status(status).json({
    message: err.message,
    status: err.status,
  });
});

server.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URL);
  cronRunner();
  console.log(`Server has started on PORT ${configs.PORT} 🥸`);
});
