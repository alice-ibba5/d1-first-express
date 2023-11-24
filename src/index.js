import express from "express";
import apiRouter from "./apiRouter";

const server = express();

server.use(express.json());

const port = 3000;

server.use("/api", apiRouter);

server.listen(port, () => {
  console.log("Server listening on port: " + port);
});
