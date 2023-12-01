import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

export const Comment = mongoose.model("comments", CommentSchema);
