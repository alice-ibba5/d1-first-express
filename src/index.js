import express from "express";
import apiRouter from "./apiRouter.js";
import mongoose from "mongoose";

const server = express();

server.use(express.json());

const port = 3000;

server.use("/api", apiRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(port, () => {
      console.log("Server listening on port: " + port);
    });
  })
  .catch(() => {
    console.log("Errore nella connessione al DB");
  });
