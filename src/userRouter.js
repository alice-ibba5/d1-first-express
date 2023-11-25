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

userRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedAuthor);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);

    if (!deletedAuthor) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
