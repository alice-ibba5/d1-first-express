import express from "express";
import { BlogPost } from "./models/blogPosts.js";
import { Comment } from "./models/comments.js";
import { genericError } from "./middlewares/genericError.js";
import uploadFile from "./confBlogpost.js";
import path from "path";

const blogPostRouter = express.Router();

blogPostRouter.get("/test", async (req, res) => {
  res.json({ message: "Blog Posts router working! 🚀" });
});

blogPostRouter.get("/", async (req, res, next) => {
  //ritorna tutti i blog post
  try {
    const blogPosts = await BlogPost.find({}).populate("author");
    res.json(blogPosts);
  } catch (error) {
    next(error);
  }
});

blogPostRouter.get("/:id", async (req, res, next) => {
  //ritorna un blog post specifico
  try {
    const { id } = req.params;
    const blogPost = await BlogPost.findById(id).populate(
      "author",
      "-_id name surname avatar"
    );

    if (!blogPost) {
      return res.status(404).send();
    }

    res.json(blogPost);
  } catch (error) {
    next(error);
  }
});

blogPostRouter.get("/:id/comments", async (req, res, next) => {
  //ritorna tutti i commenti di un blog post specifico FUNZIONA
  try {
    const comments = await Comment.find({ blogPost: req.params.id }).populate(
      "author",
      "-_id name surname avatar"
    );

    if (!comments) {
      return res.status(404).send();
    }
    res.json(comments);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

blogPostRouter.get("/:id/comments/:commentId", async (req, res, next) => {
  //ritorna un commento specifico di un blog post specifico FUNZIONA
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId).populate(
      "author",
      "-_id name surname avatar"
    );

    if (!comment) {
      return res.status(404).send();
    }

    res.json(comment);
  } catch (error) {
    next(error);
  }
});

blogPostRouter.post("/", async (req, res, next) => {
  //aggiunge un nuovo blog post
  try {
    const newBlogPost = new BlogPost(req.body);

    await newBlogPost.save();

    res.status(201).json(newBlogPost);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

blogPostRouter.post("/:id", async (req, res, next) => {
  //aggiunge un nuovo commento ad un post specifico FUNZIONA
  try {
    const newComment = new Comment(req.body);

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

blogPostRouter.put("/:id", async (req, res, next) => {
  //modifica un blog post specifico
  try {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedBlogPost);
  } catch (error) {
    next(error);
  }
});

blogPostRouter.put("/:id/comments/:commentId", async (req, res, next) => {
  //modifica un commento ad un post specifico FUNZIONA
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
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

blogPostRouter.delete("/:id", async (req, res, next) => {
  //elimina un blog post specifico
  try {
    const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);

    if (!deletedBlogPost) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

blogPostRouter.delete("/:id/comments/:commentId", async (req, res, next) => {
  //elimina un commento ad un post specifico FUNZIONA
  try {
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId
    );

    if (!deletedComment) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

blogPostRouter.patch(
  "/:id/cover",
  uploadFile.single("cover"),
  async (req, res, next) => {
    //aggiunge la cover ad un blog post specifico
    try {
      console.log(req.file);
      let updatedCover = await BlogPost.findByIdAndUpdate(
        req.params.id,
        { cover: req.file.path },
        { new: true }
      );
      if (!updatedCover) {
        return res.status(404).json({ error: "Cover non trovata." });
      } else {
        res.json(updatedCover);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default blogPostRouter;
