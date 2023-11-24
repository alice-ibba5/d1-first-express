import express from "express";
import apiRouter from "./apiRouter.js";
import mongoose from "mongoose";

const server = express();

server.use(express.json());

const port = 3000;

server.use("/api", apiRouter);

mongoose
  .connect(
    "mongodb+srv://aliceibba5:150988Arya@cluster0.2otrbmg.mongodb.net/Epicode"
  )
  .then(() => {
    server.listen(port, () => {
      console.log("Server listening on port: " + port);
    });
  })
  .catch(() => {
    console.log("Errore nella connessione al DB");
  });
