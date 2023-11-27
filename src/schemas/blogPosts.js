import mongoose, { Schema } from "mongoose";

const BlogPostSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
  },
  readTime: {
    valore: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: "minute",
    },
  },
  author: {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

export const BlogPost = mongoose.model("blogPosts", BlogPostSchema);
