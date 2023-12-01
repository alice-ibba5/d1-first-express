import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export const Comment = mongoose.model("comments", CommentSchema);
