import express from "express";
import { Author } from "./models/authors.js";
import { genericError } from "./middlewares/genericError.js";
import cloudinaryUploader from "./confAuthor.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import bcrypt from "bcrypt";

const authorRouter = express.Router();

authorRouter.get("/test", async (req, res) => {
  res.json({ message: "Authors router working! 🚀" });
});

authorRouter.get("/", async (req, res, next) => {
  //ritorna tutti gli autori
  try {
    const authors = await Author.find({});
    res.json(authors);
  } catch (error) {
    next(error);
  }
});

authorRouter.get("/:id", async (req, res, next) => {
  //ritorna un autore specifico
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

authorRouter.post("/", async (req, res, next) => {
  //aggiunge un autore specifico
  const password = await bcrypt.hash(req.body.password, 10);
  try {
    const newAuthor = await Author.create({
      ...req.body,
      password,
    });
    res.status(201).json(newAuthor);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

authorRouter.put("/:id", async (req, res, next) => {
  //modifica un autore specifico
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

authorRouter.delete("/:id", async (req, res, next) => {
  //cancella un autore specifico
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

cloudinary.config({
  URL: process.env.CLOUDINARY_URL,
});

authorRouter.patch(
  "/:id/avatar",
  cloudinaryUploader,
  async (req, res, next) => {
    //aggiunge l'avatar di un autore specifico
    try {
      console.log(req.file);
      let updatedAvatar = await Author.findByIdAndUpdate(
        req.params.id,
        { avatar: req.file.path },
        { new: true }
      );
      res.send(updatedAvatar);
    } catch (error) {
      next(error);
    }
  }
);

export default authorRouter;
