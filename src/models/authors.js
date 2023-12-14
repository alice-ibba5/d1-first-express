import mongoose, { Schema } from "mongoose";

const AuthorSchema = new Schema({
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
  password: {
    type: String,
    required: function () {
      return this.googleId ? false : true;
    },
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  googleId: {
    type: String,
    required: function () {
      return this.password ? false : true;
    },
  },
});

export const Author = mongoose.model("authors", AuthorSchema);
