import express from "express";
import apiRouter from "./apiRouter.js";
import mongoose from "mongoose";
import list from "express-list-endpoints";
import { genericError } from "./middlewares/genericError.js";
import cors from "cors";

const server = express();

server.use(cors());

server.use(express.json());

const port = 3030;

server.use("/api", apiRouter);

server.use(genericError);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(port, () => {
      console.log("Server listening on port: " + port);
      console.log(list(server));
    });
  })
  .catch(() => {
    console.log("Errore nella connessione al DB");
  });
