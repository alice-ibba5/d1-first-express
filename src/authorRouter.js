import express from "express";
import { Author } from "./schemas/authors.js";

const authorRouter = express.Router();

authorRouter.get("/test", async (req, res) => {
  res.json({ message: "Users router working! 🚀" });
});

authorRouter.get("/authors", async (req, res, next) => {
  try {
    const authors = await Author.find({});
    res.json(authors);
  } catch (error) {
    next(error);
  }
});

authorRouter.get("/authors/:id", async (req, res, next) => {
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

authorRouter.post("/authors", async (req, res, next) => {
  try {
    const newAuthor = new Author(req.body);

    await newAuthor.save();

    res.status(201).json(newAuthor);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

authorRouter.put("/authors/:id", async (req, res, next) => {
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

authorRouter.delete("/authors/:id", async (req, res, next) => {
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

export default authorRouter;
