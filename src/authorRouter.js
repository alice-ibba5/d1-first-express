import express from "express";
import { Author } from "./models/authors.js";
import { genericError } from "./middlewares/genericError.js";
import cloudinaryUploader from "./confAuthor.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import bcrypt from "bcrypt";
import checkJwt from "./middlewares/jwt.js";
import jwt from "jsonwebtoken";
import passport from "passport";

const authorRouter = express.Router();

authorRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

authorRouter.get(
  "/google-callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  async (req, res) => {
    const payload = { id: req.user.id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.redirect(
      `https://strive-blog-ai.netlify.app/?token=${token}&userId=${req.user.id}`
    );
  }
);

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

authorRouter.get("/:id", checkJwt, async (req, res) => {
  //ritorna un autore specifico autenticato
  /* try {
    const { id } = req.params;
    const author = await Author.findById(id);

    if (!author) {
      return res.status(404).send();
    }*/

  res.status(200).json(req.author);
  /*} catch (error)  {
    next(error);
  }*/
});

authorRouter.post("/", async (req, res, next) => {
  //aggiunge un autore specifico con password criptata
  const password = await bcrypt.hash(req.body.password, 10);
  try {
    const newAuthor = await Author.create({
      ...req.body,
      password,
    });

    const {
      password: _,
      __v,
      ...newAuthorWithoutPassword
    } = newAuthor.toObject();

    res.status(201).json(newAuthorWithoutPassword);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

// Authentication - Autenticazione
// il processo di verifica dell'identità di un utente
authorRouter.post("/session", async (req, res, next) => {
  const { email, password } = req.body;

  const author = await Author.findOne({ email });

  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, author.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { id: author._id };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({ authorId: author._id, token });
});

authorRouter.delete("/session", async (req, res) => {});
// Logout

authorRouter.post("/checkUserExistence", async (req, res) => {
  try {
    const { authorEmail } = req.body;

    // Cerca l'utente nel database usando il campo email
    const existingUser = await Author.findOne({ email: authorEmail });

    // Invia la risposta al client indicando se l'utente esiste o meno
    res.json({ userExists: !!existingUser });
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
