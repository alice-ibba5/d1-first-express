import mongoose, { Schema } from "mongoose";
import { BlogPost } from "./blogPosts.js";

const CommentSchema = new Schema({
  blogPost: {
    type: Schema.Types.ObjectId,
    ref: "blogPosts",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "authors",
    required: true,
  },
});

export const Comment = mongoose.model("comments", CommentSchema);
