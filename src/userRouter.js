import express from "express";
import { Author } from "./schemas/users.js";

const userRouter = express.Router();

userRouter.get("/test", async (req, res) => {
  res.json({ message: "Users router working! 🚀" });
});

userRouter.get("/", async (req, res, next) => {
  try {
    const authors = await Author.find({});
    res.json(authors);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await Author.findById(id);

    if (!author) {
      return res.status(404).send();
    }

    res.json(author);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new Author(req.body);

    await newAuthor.save();

    res.status(201).json(newAuthor);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

export default userRouter;
