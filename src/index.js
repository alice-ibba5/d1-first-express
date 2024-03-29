import express from "express";
import apiRouter from "./apiRouter.js";
import mongoose from "mongoose";
import list from "express-list-endpoints";
import { genericError } from "./middlewares/genericError.js";
import cors from "cors";
import passport from "passport";
import googleStrategy from "./middlewares/google.js";

const server = express();

const whitelist = [
  "https://strive-blog-ai.netlify.app",
  "http://localhost:3000",
  "http://localhost:3030",
  "https://accounts.google.com/o/oauth2/auth",
  "https://strive-blog-backend.onrender.com/api/authors/google",
];
const corsOptions = {
  origin: function (origin, next) {
    if (whitelist.includes(origin) || !origin) {
      next(null, true);
    } else {
      next(new Error("Not allowed by CORS"));
    }
  },
};

server.use(cors(corsOptions));

server.use(express.json());

const port = 3030;

passport.use(googleStrategy);

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
