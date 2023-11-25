import express from "express";
import { BlogPost } from "./schemas/blogPosts.js";

const blogPostRouter = express.Router();

blogPostRouter.get("/test", async (req, res) => {
  res.json({ message: "Users router working! 🚀" });
});

blogPostRouter.get("/blogPosts", async (req, res, next) => {
  try {
    const blogPosts = await BlogPost.find({});
    res.json(blogPosts);
  } catch (error) {
    next(error);
  }
});

blogPostRouter.get("/blogPosts/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogPost = await BlogPost.findById(id);

    if (!blogPost) {
      return res.status(404).send();
    }

    res.json(blogPost);
  } catch (error) {
    next(error);
  }
});

blogPostRouter.post("/blogPosts", async (req, res, next) => {
  try {
    const newBlogPost = new BlogPost(req.body);

    await newBlogPost.save();

    res.status(201).json(newBlogPost);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

blogPostRouter.put("/blogPosts/:id", async (req, res, next) => {
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

blogPostRouter.delete("/blogPosts/:id", async (req, res, next) => {
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

export default blogPostRouter;
