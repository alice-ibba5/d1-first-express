import express from "express";
import { Comment } from "./schemas/comments.js";
import { genericError } from "./middlewares/genericError.js";

const commentRouter = express.Router();

commentRouter.get("/test", async (req, res) => {
  res.json({ message: "Authors router working! 🚀" });
});

commentRouter.get("/", async (req, res, next) => {
  //ritorna tutti i commenti di un blog post specifico
  try {
    const comments = await Comment.find({});
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

commentRouter.get("/:commentId", async (req, res, next) => {
  //ritorna un commento specifico di un blog post specifico
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).send();
    }

    res.json(comment);
  } catch (error) {
    next(error);
  }
});

commentRouter.post("/", async (req, res, next) => {
  //aggiunge un nuovo commento ad un post specifico
  try {
    const newComment = new Comment(req.body);

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

commentRouter.put("/:commentId", async (req, res, next) => {
  //modifica un commento ad un post specifico
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedComment);
  } catch (error) {
    next(error);
  }
});

commentRouter.delete("/:commentId", async (req, res, next) => {
  //elimina un commento ad un post specifico
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

export default commentRouter;
