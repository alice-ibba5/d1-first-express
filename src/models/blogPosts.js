import mongoose, { Schema } from "mongoose";
import { Comment } from "./comments.js";

const BlogPostSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },

  readTime: {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: "minute",
    },
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "authors",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
  },
  cover: {
    type: String,
  },
});

export const BlogPost = mongoose.model("blogPosts", BlogPostSchema);
